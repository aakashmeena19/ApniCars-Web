import hashlib
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit


ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
BACKEND_ROOT = PROJECT_ROOT / "backend"
UPLOAD_ROOT = BACKEND_ROOT / "uploads"


def slugify(value: str, max_length: int = 100) -> str:
    value = str(value or "").lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return (value or "unknown")[:max_length]


def clean_text(value) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def number_from(value):
    match = re.search(r"-?\d+(?:\.\d+)?", str(value or "").replace(",", ""))
    return float(match.group()) if match else None


def integer_from(value):
    number = number_from(value)
    return round(number) if number is not None else None


def parse_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(str(value)[:10], "%m/%d/%Y").date()
    except ValueError:
        return None


def absolute_url(value, image=False):
    if not value:
        return None
    base = "https://imgd.aeplcdn.com/" if image else "https://www.carwale.com/"
    return urljoin(base, str(value).replace("&amp;", "&"))


def high_resolution_image_url(value):
    absolute = absolute_url(value, image=True)
    if not absolute:
        return None
    parts = urlsplit(absolute)
    path = re.sub(r"^/(?:\d+x\d+|0x0)/", "/1280x720/", parts.path, flags=re.IGNORECASE)
    if path.startswith("/n/"):
        path = f"/1280x720{path}"
    query = urlencode([(key, val) for key, val in parse_qsl(parts.query) if key != "q"])
    return urlunsplit((parts.scheme, parts.netloc, path, query, ""))


def extract_assigned_json(html: str, variable_name: str):
    marker = f"window.{variable_name}"
    marker_index = html.find(marker)
    if marker_index < 0:
        raise ValueError(f"{variable_name} was not found")
    start = html.find("{", html.find("=", marker_index))
    if start < 0:
        raise ValueError(f"{variable_name} JSON start was not found")
    value, _ = json.JSONDecoder().raw_decode(html[start:])
    return value


def parse_selection(value):
    if not value or str(value).lower() == "all":
        return None
    return {item.strip().lower() for item in str(value).split(",") if item.strip()}


def deterministic_name(source_url: str, hint: str) -> str:
    parts = urlsplit(source_url)
    stable_source = urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))
    digest = hashlib.sha256(stable_source.encode("utf-8")).hexdigest()[:16]
    return f"{slugify(hint, 55)}-{digest}.avif"


class RunLogger:
    def __init__(self):
        log_dir = ROOT / "logs"
        log_dir.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%S")
        self.path = log_dir / f"run-{stamp}.jsonl"

    def write(self, level, message, **data):
        entry = {
            "at": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
            **data,
        }
        with self.path.open("a", encoding="utf-8") as stream:
            stream.write(json.dumps(entry, ensure_ascii=True) + "\n")
        print(f"[{level.upper()}] {message}")


def load_checkpoint():
    path = ROOT / "state" / "checkpoint.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {"completedModels": []}


def save_checkpoint(completed):
    path = ROOT / "state" / "checkpoint.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(".tmp")
    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "completedModels": sorted(completed),
    }
    temporary_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    temporary_path.replace(path)


def sleep_ms(milliseconds):
    time.sleep(max(0, milliseconds) / 1000)
