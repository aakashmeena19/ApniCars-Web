import io
import os
from pathlib import Path

import pillow_avif  # noqa: F401
from PIL import Image

from http_client import HttpStatusError
from utils import UPLOAD_ROOT, deterministic_name, high_resolution_image_url, slugify


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/avif"}
MAX_IMAGE_BYTES = int(os.getenv("CARWALE_IMAGE_MAX_BYTES", str(25 * 1024 * 1024)))


class ImageStore:
    def __init__(self, http, logger):
        self.http = http
        self.logger = logger

    def save_remote(self, source_url, folder, name_hint):
        source_url = high_resolution_image_url(source_url)
        if not source_url:
            return None
        filename = deterministic_name(source_url, name_hint)
        directory = UPLOAD_ROOT / Path(folder)
        output_path = directory / filename
        public_path = f"/uploads/{Path(folder).as_posix()}/{filename}"
        if output_path.exists():
            return public_path

        response = self.http.get(source_url, image=True, attempts=4, stream=True)
        try:
            content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
            if content_type not in ALLOWED_IMAGE_TYPES:
                raise ValueError(f"Unsupported image type {content_type or 'unknown'}")
            data = bytearray()
            for chunk in response.iter_content(64 * 1024):
                data.extend(chunk)
                if len(data) > MAX_IMAGE_BYTES:
                    raise ValueError("Image exceeds configured size limit")
        finally:
            response.close()

        directory.mkdir(parents=True, exist_ok=True)
        temporary_path = output_path.with_suffix(".tmp")
        with Image.open(io.BytesIO(data)) as image:
            has_alpha = image.mode in {"RGBA", "LA"} or (
                image.mode == "P" and "transparency" in image.info
            )
            image = image.convert("RGBA" if has_alpha else "RGB")
            image.save(temporary_path, format="AVIF", quality=65)
        temporary_path.replace(output_path)
        return public_path

    def prepare_brand_logo(self, brand):
        return self.save_remote(brand.get("logo_url"), "brands", brand["slug"])

    @staticmethod
    def _category(image):
        if int(image.get("colorId") or 0) > 0:
            return "colour"
        if int(image.get("categoryId") or 0) == 1:
            return "interior"
        if int(image.get("categoryId") or 0) == 2:
            return "exterior"
        return slugify(image.get("subCategoryName") or "gallery", 30)

    def prepare_model_media(self, brand, model, bundle):
        model_key = f"{brand['slug']}-{model['slug']}"
        try:
            cover_url = self.save_remote(
                model.get("cover_source_url"),
                "car-model-covers",
                f"{brand['slug']}-{model['slug']}-cover",
            )
        except Exception as error:
            self.logger.write("warn", f"Cover image skipped: {brand['name']} {model['name']}", error=str(error))
            cover_url = None

        colors = []
        for color in bundle["colors"]:
            try:
                image_url = self.save_remote(
                    color.get("imagePath"),
                    "colors",
                    f"{model_key}-{color.get('name', 'color')}",
                )
            except Exception as error:
                self.logger.write("warn", f"Color image skipped: {model['name']} {color.get('name')}", error=str(error))
                image_url = None
            colors.append({**color, "local_image_url": image_url})

        images = []
        seen = set()
        for index, item in enumerate(bundle["gallery"]):
            source_url = high_resolution_image_url(item.get("path"))
            if not source_url or source_url in seen:
                continue
            seen.add(source_url)
            try:
                local_url = self.save_remote(
                    source_url,
                    "car-images",
                    f"{model_key}-{item.get('name') or item.get('altImageName') or 'image'}-{item.get('id') or index}",
                )
                images.append(
                    {
                        "image_url": local_url,
                        "source_color_id": int(item.get("colorId") or 0) or None,
                        "is_primary": index == 0,
                        "angle": str(item.get("altImageName") or item.get("tagName") or "")[:30] or None,
                        "category": self._category(item),
                        "caption": str(item.get("imageTitle") or item.get("altImageName") or "")[:150] or None,
                        "sort_order": index,
                    }
                )
            except Exception as error:
                self.logger.write("warn", f"Gallery image skipped: {brand['name']} {model['name']}", source=source_url, error=str(error))

        frame_base = (bundle.get("three_sixty") or {}).get("frame_base")
        if frame_base:
            consecutive_missing = 0
            frame = 1
            while frame <= 120 and consecutive_missing < 3:
                source_url = f"{frame_base}{frame}.jpg"
                try:
                    local_url = self.save_remote(
                        source_url,
                        "car-images",
                        f"{model_key}-360-frame-{frame:03d}",
                    )
                    images.append(
                        {
                            "image_url": local_url,
                            "source_color_id": None,
                            "is_primary": False,
                            "angle": f"frame-{frame:03d}",
                            "category": "360",
                            "caption": f"{brand['name']} {model['name']} 360 frame {frame}"[:150],
                            "sort_order": frame,
                        }
                    )
                    consecutive_missing = 0
                except HttpStatusError as error:
                    if error.status_code != 404:
                        self.logger.write("warn", f"360 frame skipped: {model['name']} {frame}", error=str(error))
                    consecutive_missing += 1
                except Exception as error:
                    self.logger.write("warn", f"360 frame skipped: {model['name']} {frame}", error=str(error))
                    consecutive_missing += 1
                frame += 1

        return {"cover_image_url": cover_url, "colors": colors, "images": images}
