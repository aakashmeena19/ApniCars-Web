import re

from utils import absolute_url, extract_assigned_json, high_resolution_image_url, parse_date


STATUS_BY_ID = {1: "upcoming", 2: "available", 3: "discontinued"}


class CarWaleScraper:
    def __init__(self, http, logger=None):
        self.http = http
        self.logger = logger

    def _log(self, level, message, **data):
        if self.logger:
            self.logger.write(level, message, **data)

    def _state(self, path):
        url = absolute_url(path)
        html = self.http.text(url)
        return html, extract_assigned_json(html, "__INITIAL_STATE__")

    def fetch_index(self):
        _, state = self._state("/new-cars/")
        new_cars = state["newCars"]
        brands = [
            {
                "source_id": brand["makeId"],
                "name": brand["makeName"],
                "slug": brand["maskingName"],
                "logo_url": high_resolution_image_url(brand.get("logoPath")),
            }
            for brand in new_cars.get("makeList", [])
        ]
        body_types = {
            item["id"]: item["name"]
            for item in new_cars.get("filterWidget", {}).get("bodyStyles", [])
        }
        return brands, body_types

    @staticmethod
    def _normalise_model(raw, forced_status=None):
        status = forced_status or STATUS_BY_ID.get(raw.get("status"), "available")
        brand_slug = raw.get("makeMaskingName", "")
        model_slug = raw.get("modelMaskingName", "")
        return {
            "source_id": raw.get("modelId"),
            "name": raw.get("modelName", ""),
            "slug": model_slug,
            "brand_name": raw.get("makeName", ""),
            "brand_slug": brand_slug,
            "body_type_source_id": raw.get("bodyStyleId"),
            "status": status,
            "expected_launch_date": parse_date(raw.get("launchedOn")) if status == "upcoming" else None,
            "cover_source_url": high_resolution_image_url(raw.get("imagePath")),
            "page_path": f"/{brand_slug}-cars/{model_slug}/",
            "raw": raw,
        }

    def fetch_brand_models(self, brand):
        _, state = self._state(f"/{brand['slug']}-cars/")
        make_page = state["makePage"]
        models = [self._normalise_model(item) for item in make_page.get("models", [])]
        models.extend(
            self._normalise_model(item, "discontinued")
            for item in make_page.get("discontinuedModels", [])
        )
        return list({model["source_id"]: model for model in models}.values())

    @staticmethod
    def _flatten_master(groups):
        output = []

        def walk(group, parents):
            names = [*parents, group.get("name")]
            category = " / ".join(name for name in names if name) or "General"
            for item in group.get("items", []):
                if item.get("itemName") and str(item.get("value", "")).strip():
                    output.append({"category": category, **item})
            for child in group.get("subCategories", []):
                walk(child, [name for name in names if name])

        for group in groups or []:
            walk(group, [])
        return output

    def fetch_model_bundle(self, model):
        label = f"{model['brand_name']} {model['name']}".strip()
        self._log("info", f"Fetching model details: {label}")
        _, model_state = self._state(model["page_path"])
        self._log("info", f"Fetching gallery metadata: {label}")
        _, image_state = self._state(f"{model['page_path']}images/")
        page = model_state["modelPage"]
        image_details = image_state["imageDetails"]
        trim_features = {}
        trim_names = {
            version.get("trimMaskingName")
            for version in page.get("versions", [])
            if version.get("trimMaskingName")
        }
        trim_names = sorted(trim_names)
        for position, trim_name in enumerate(trim_names, start=1):
            if self.logger:
                self.logger.progress(
                    f"Trim specifications {position}/{len(trim_names)}: {label}",
                    position,
                    len(trim_names),
                )
            try:
                _, trim_state = self._state(f"{model['page_path']}{trim_name}/")
                trim_page = trim_state["trimPage"]
                trim_id = trim_page.get("trimDetail", {}).get("trimId")
                trim_features[trim_id] = self._flatten_master(trim_page.get("specsFeaturesMaster", []))
            except Exception as error:
                self._log(
                    "warn",
                    f"Trim specifications skipped: {label} / {trim_name}",
                    error=repr(error),
                )
                continue
        if self.logger:
            self.logger.finish_progress()

        three_sixty = None
        details = image_details.get("modelDetails", {})
        if details.get("is360Available") and details.get("threeSixtyPageUrl"):
            try:
                self._log("info", f"Fetching 360 metadata: {label}")
                three_sixty = self.fetch_three_sixty(details["threeSixtyPageUrl"])
            except Exception as error:
                self._log("warn", f"360 metadata skipped: {label}", error=repr(error))

        self._log(
            "info",
            f"Metadata ready: {label} | {len(page.get('versions', []))} variants, "
            f"{len(image_details.get('colors') or page.get('color', {}).get('colors', []))} colors, "
            f"{len(image_details.get('images', []))} gallery images, "
            f"360={'yes' if three_sixty else 'no'}",
        )

        return {
            "details": page.get("modelDetails", {}),
            "versions": page.get("versions", []),
            "colors": image_details.get("colors") or page.get("color", {}).get("colors", []),
            "gallery": image_details.get("images", []),
            "trim_features": trim_features,
            "three_sixty": three_sixty,
        }

    def fetch_three_sixty(self, url):
        html = self.http.text(url).replace("&amp;", "&")
        match = re.search(
            r'id=["\']loadingClosedDoor["\'][^>]+src=["\']([^"\']+)',
            html,
            flags=re.IGNORECASE,
        )
        if not match:
            return None
        image_url = high_resolution_image_url(match.group(1))
        frame_base = re.sub(r"/1\.jpg(?:\?.*)?$", "/", image_url, flags=re.IGNORECASE)
        return {"frame_base": frame_base}
