# ApniCars CarWale Scraper

Python importer for CarWale's factual new-car catalog. Every run follows the same hierarchy: brand, models, variants, powertrains, specifications, features, colors, and images.

It imports available, upcoming, and discontinued cars with their matching status. Reviews, news, offers, dealers, leads, videos, and user data are excluded. Variant prices are ex-showroom prices only.

## Setup

Run this once from the scraper directory:

```powershell
cd D:\phx-sir\ApniCars-Project\carwale-scrapper
python -m pip install -r requirements.txt --upgrade
```

The database connection is read from `backend/.env`. Images are converted to AVIF and stored in the same folders used by manual admin-panel uploads:

- `backend/uploads/brands`
- `backend/uploads/car-model-covers`
- `backend/uploads/colors`
- `backend/uploads/car-images` (gallery and 360 frames)

Image filenames are deterministic and existing files are reused, so running a command again does not create duplicate images. Existing matching database records are updated through upserts; new records are inserted.

## Commands

Run these commands from `D:\phx-sir\ApniCars-Project\carwale-scrapper`.

### 1. Test without saving

Scrapes one model as a dry run. It does not update the database or download images.

```powershell
python main.py --status available --brands maruti-suzuki --models fronx --dry-run --yes
```

### 2. Scrape one complete brand

Replace `maruti-suzuki` with the required CarWale brand slug.

```powershell
python main.py --status all --brands maruti-suzuki --models all --fuel all --transmission all --yes
```

### 3. Scrape multiple complete brands

Pass comma-separated brand slugs.

```powershell
python main.py --status all --brands maruti-suzuki,hyundai,tata --models all --fuel all --transmission all --yes
```

### 4. Scrape the complete catalog

```powershell
python main.py --status all --brands all --models all --fuel all --transmission all --yes
```

The complete import can take many hours because it downloads all available public gallery images and 360 frames. Each model is committed independently, and errors are recorded under `logs/`.

### Resume an interrupted complete scrape

Completed models are stored in `state/checkpoint.json`. This command skips those models and retries the interrupted or failed models:

```powershell
python main.py --status all --brands all --models all --fuel all --transmission all --resume --yes
```

Resume one brand by replacing the brand slug:

```powershell
python main.py --status all --brands maruti-suzuki --models all --fuel all --transmission all --resume --yes
```

The checkpoint is written atomically after each successful model. A model interrupted before commit is safely retried. Existing deterministic image files are reused.

### Refresh existing data without duplicates

Run the required brand or full-catalog command without `--resume`. Database upserts update matching brands, models, variants, powertrains, colors, features, and images. Unique keys and deterministic image filenames prevent duplicate records and files.

```powershell
python main.py --status all --brands maruti-suzuki --models all --fuel all --transmission all --yes
```

### Automatic ADB IP rotation

The scraper checks for one authorized Android device at startup. After repeated CarWale `403` or `429` responses, it attempts to cycle airplane mode, waits for mobile data to return, starts a fresh HTTP session, and retries the blocked URL. A `404` is treated as missing content and is skipped without rotating the IP.

Requirements:

1. Enable Developer options and USB debugging on the phone.
2. Connect and authorize the phone, then verify it shows as `device`:

```powershell
adb devices
```

3. The computer must use that phone's mobile connection through USB tethering or hotspot. An ADB connection alone does not route computer traffic through the phone.
4. `adb.exe` must be in `PATH`, in the standard Windows Android SDK folder, or configured with `ADB_PATH` in `backend/.env`.

Some Android versions block airplane-mode changes from a normal ADB shell. The scraper logs that permission failure and continues with normal bounded retries. Some phones may also require USB tethering to be re-enabled after an airplane-mode cycle.

Optional values in `backend/.env`:

```dotenv
CARWALE_ADB_AIRPLANE_SECONDS=4
CARWALE_ADB_NETWORK_WAIT_SECONDS=15
CARWALE_ADB_ROTATION_COOLDOWN_SECONDS=60
CARWALE_ADB_MAX_ROTATIONS=20
CARWALE_BLOCK_THRESHOLD=2
CARWALE_MAX_ROTATIONS_PER_REQUEST=2
```

Disable ADB rotation for a run with `--no-adb-rotation`.

### Reset test data

This removes all non-admin database data, all files inside `backend/uploads`, and the scraper checkpoint. Admin users, roles, permissions, and Prisma migration history are preserved. The command refuses to run unless `DATABASE_URL` points to localhost.

Interactive confirmation:

```powershell
python reset_data.py
```

Non-interactive reset:

```powershell
python reset_data.py --yes
```
