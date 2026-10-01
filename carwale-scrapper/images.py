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

    def save_remote_with_status(self, source_url, folder, name_hint):
        source_url = high_resolution_image_url(source_url)
        if not source_url:
            return None, "missing"
        filename = deterministic_name(source_url, name_hint)
        directory = UPLOAD_ROOT / Path(folder)
        output_path = directory / filename
        public_path = f"/uploads/{Path(folder).as_posix()}/{filename}"
        if output_path.exists():
            return public_path, "reused"

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
        return public_path, "downloaded"

    def save_remote(self, source_url, folder, name_hint):
        public_path, _ = self.save_remote_with_status(source_url, folder, name_hint)
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
        label = f"{brand['name']} {model['name']}"
        self.logger.write("info", f"Preparing media: {label}")
        try:
            cover_url, cover_status = self.save_remote_with_status(
                model.get("cover_source_url"),
                "car-model-covers",
                f"{brand['slug']}-{model['slug']}-cover",
            )
            self.logger.write("info", f"Cover image {cover_status}: {label}")
        except Exception as error:
            self.logger.write("warn", f"Cover image skipped: {label}", error=str(error))
            cover_url = None

        colors = []
        color_counts = {"downloaded": 0, "reused": 0, "skipped": 0}
        color_total = len(bundle["colors"])
        for position, color in enumerate(bundle["colors"], start=1):
            try:
                image_url, status = self.save_remote_with_status(
                    color.get("imagePath"),
                    "colors",
                    f"{model_key}-{color.get('name', 'color')}",
                )
                if status == "missing":
                    color_counts["skipped"] += 1
                else:
                    color_counts[status] += 1
            except Exception as error:
                self.logger.write("warn", f"Color image skipped: {model['name']} {color.get('name')}", error=str(error))
                image_url = None
                color_counts["skipped"] += 1
            colors.append({**color, "local_image_url": image_url})
            self.logger.progress(
                f"Colors {position}/{color_total}: {label} | downloaded {color_counts['downloaded']}, "
                f"reused {color_counts['reused']}, skipped {color_counts['skipped']}",
                position,
                color_total,
            )
        self.logger.finish_progress()
        self.logger.write(
            "info",
            f"Colors ready: {label} | downloaded {color_counts['downloaded']}, "
            f"reused {color_counts['reused']}, skipped {color_counts['skipped']}",
        )

        images = []
        seen = set()
        gallery_counts = {"downloaded": 0, "reused": 0, "skipped": 0}
        gallery_total = len(bundle["gallery"])
        for position, item in enumerate(bundle["gallery"], start=1):
            index = position - 1
            source_url = high_resolution_image_url(item.get("path"))
            if not source_url or source_url in seen:
                gallery_counts["skipped"] += 1
                self.logger.progress(
                    f"Gallery {position}/{gallery_total}: {label} | downloaded {gallery_counts['downloaded']}, "
                    f"reused {gallery_counts['reused']}, skipped {gallery_counts['skipped']}",
                    position,
                    gallery_total,
                )
                continue
            seen.add(source_url)
            try:
                local_url, status = self.save_remote_with_status(
                    source_url,
                    "car-images",
                    f"{model_key}-{item.get('name') or item.get('altImageName') or 'image'}-{item.get('id') or index}",
                )
                if not local_url:
                    gallery_counts["skipped"] += 1
                    continue
                gallery_counts[status] += 1
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
                gallery_counts["skipped"] += 1
            finally:
                self.logger.progress(
                    f"Gallery {position}/{gallery_total}: {label} | downloaded {gallery_counts['downloaded']}, "
                    f"reused {gallery_counts['reused']}, skipped {gallery_counts['skipped']}",
                    position,
                    gallery_total,
                )
        self.logger.finish_progress()
        self.logger.write(
            "info",
            f"Gallery ready: {label} | downloaded {gallery_counts['downloaded']}, "
            f"reused {gallery_counts['reused']}, skipped {gallery_counts['skipped']}",
        )

        frame_base = (bundle.get("three_sixty") or {}).get("frame_base")
        if frame_base:
            consecutive_missing = 0
            frame = 1
            frame_counts = {"downloaded": 0, "reused": 0, "skipped": 0}
            while frame <= 120 and consecutive_missing < 3:
                source_url = f"{frame_base}{frame}.jpg"
                try:
                    local_url, status = self.save_remote_with_status(
                        source_url,
                        "car-images",
                        f"{model_key}-360-frame-{frame:03d}",
                    )
                    if not local_url:
                        raise ValueError("360 frame URL is missing")
                    frame_counts[status] += 1
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
                    self.logger.write("warn", f"360 frame skipped: {model['name']} {frame}", error=str(error))
                    frame_counts["skipped"] += 1
                    consecutive_missing += 1
                except Exception as error:
                    self.logger.write("warn", f"360 frame skipped: {model['name']} {frame}", error=str(error))
                    frame_counts["skipped"] += 1
                    consecutive_missing += 1
                finally:
                    self.logger.progress(
                        f"360 frames {frame}/120: {label} | downloaded {frame_counts['downloaded']}, "
                        f"reused {frame_counts['reused']}, skipped {frame_counts['skipped']}",
                        frame,
                        120,
                    )
                frame += 1
            self.logger.finish_progress()
            self.logger.write(
                "info",
                f"360 frames ready: {label} | downloaded {frame_counts['downloaded']}, "
                f"reused {frame_counts['reused']}, skipped {frame_counts['skipped']}",
            )
        else:
            self.logger.write("info", f"No 360 media available: {label}")

        return {"cover_image_url": cover_url, "colors": colors, "images": images}
