import argparse
import sys

from dotenv import load_dotenv

from carwale import CarWaleScraper
from db import get_connection
from http_client import CarWaleHttpClient, HttpStatusError
from images import ImageStore
from importer import CatalogImporter
from utils import BACKEND_ROOT, RunLogger, load_checkpoint, parse_selection, save_checkpoint


def build_parser():
    parser = argparse.ArgumentParser(description="Import factual CarWale catalog data into ApniCars")
    parser.add_argument("--status", default=None, help="all, available, upcoming, discontinued")
    parser.add_argument("--brands", default=None, help="all, list numbers, CarWale IDs, names, or slugs")
    parser.add_argument("--models", default=None, help="all, list numbers, CarWale IDs, or slugs")
    parser.add_argument("--fuel", default=None, help="all, petrol, diesel, cng, electric, hybrid")
    parser.add_argument("--transmission", default=None, help="all, manual, amt, tc, cvt, dct")
    parser.add_argument("--limit", type=int, default=None, help="Process only the first N matching models")
    parser.add_argument("--resume", action="store_true", help="Skip models completed in previous runs")
    parser.add_argument("--dry-run", action="store_true", help="Scrape and report without images or database writes")
    parser.add_argument("--skip-images", action="store_true", help="Import catalog data without images")
    parser.add_argument("--no-360", action="store_true", help="Skip 360 frames but keep normal gallery images")
    parser.add_argument("--no-adb-rotation", action="store_true", help="Disable automatic ADB airplane-mode recovery")
    parser.add_argument("--yes", action="store_true", help="Non-interactive; missing filters default to all")
    return parser


def print_numbered(items, render):
    for index, item in enumerate(items, start=1):
        print(f"{index:3}. {render(item)}")


def expanded_selection(raw_value, items, identity_values):
    selection = parse_selection(raw_value)
    if selection is None:
        return None
    expanded = set(selection)
    for value in list(selection):
        if value.isdigit():
            index = int(value) - 1
            if 0 <= index < len(items):
                expanded.update(str(item).lower() for item in identity_values(items[index]))
    return expanded


def selected(selection, *values):
    return selection is None or any(str(value).lower() in selection for value in values)


def resolve_scope(args, scraper, brands, logger):
    interactive = not args.yes
    status_raw = args.status or (input("Status [all/available/upcoming/discontinued] (all): ").strip() if interactive else "all") or "all"
    statuses = parse_selection(status_raw)

    if interactive and not args.brands:
        print("\nBrands")
        print_numbered(brands, lambda brand: f"{brand['name']} ({brand['slug']})")
    brand_raw = args.brands or (input("\nBrands [all, numbers, IDs, names, or slugs] (all): ").strip() if interactive else "all") or "all"
    brand_selection = expanded_selection(brand_raw, brands, lambda brand: [brand["source_id"], brand["name"], brand["slug"]])
    chosen_brands = [
        brand for brand in brands
        if selected(brand_selection, brand["source_id"], brand["name"], brand["slug"])
    ]

    models = []
    for brand in chosen_brands:
        logger.write("info", f"Fetching {brand['name']} model list")
        try:
            brand_models = scraper.fetch_brand_models(brand)
        except HttpStatusError as error:
            if error.status_code == 404:
                logger.write("warn", f"Brand skipped: model-list URL not found for {brand['name']}", url=error.url)
            else:
                logger.write("error", f"Brand skipped after request failure: {brand['name']}", error=repr(error))
            continue
        except Exception as error:
            logger.write("error", f"Brand skipped after processing failure: {brand['name']}", error=repr(error))
            continue
        for model in brand_models:
            if statuses is None or model["status"] in statuses:
                models.append({**model, "brand": brand})

    if interactive and not args.models:
        print("\nModels")
        print_numbered(
            models,
            lambda model: f"{model['brand']['name']} {model['name']} [{model['status']}] (ID {model['source_id']})",
        )
    model_raw = args.models or (input("\nModels [all, numbers, IDs, or slugs] (all): ").strip() if interactive else "all") or "all"
    model_selection = expanded_selection(
        model_raw,
        models,
        lambda model: [model["source_id"], model["slug"], f"{model['brand']['slug']}/{model['slug']}"],
    )
    chosen_models = [
        model for model in models
        if selected(model_selection, model["source_id"], model["slug"], f"{model['brand']['slug']}/{model['slug']}")
    ]
    if args.limit is not None:
        chosen_models = chosen_models[:max(0, args.limit)]

    fuel_raw = args.fuel or (input("Fuel [all/petrol,diesel,cng,electric,hybrid] (all): ").strip() if interactive else "all") or "all"
    transmission_raw = args.transmission or (input("Transmission [all/manual,amt,tc,cvt,dct] (all): ").strip() if interactive else "all") or "all"

    if interactive:
        print(
            f"\nReady: {len(chosen_brands)} brand(s), {len(chosen_models)} model(s), "
            f"status={status_raw}, fuel={fuel_raw}, transmission={transmission_raw}"
        )
        print("This writes directly to live catalog tables and downloads every public gallery image.")
        if input("Type IMPORT to continue: ").strip() != "IMPORT":
            raise RuntimeError("Import cancelled")

    return chosen_models, parse_selection(fuel_raw), parse_selection(transmission_raw)


def main():
    load_dotenv(BACKEND_ROOT / ".env")
    args = build_parser().parse_args()
    logger = RunLogger()
    http = CarWaleHttpClient(logger=logger, enable_adb_rotation=not args.no_adb_rotation)
    http.initialize_rotation()
    scraper = CarWaleScraper(http)
    logger.write("info", "Fetching CarWale brand index")
    brands, body_types = scraper.fetch_index()
    models, fuel_filter, transmission_filter = resolve_scope(args, scraper, brands, logger)
    if not models:
        raise RuntimeError("No models matched the selected filters")

    checkpoint = load_checkpoint()
    completed = set(checkpoint.get("completedModels", [])) if args.resume else set()
    connection = None
    importer = None
    image_store = ImageStore(http, logger)
    brand_ids = {}

    try:
        if not args.dry_run:
            connection = get_connection()
            importer = CatalogImporter(connection, body_types, fuel_filter, transmission_filter, logger)

        for position, model in enumerate(models, start=1):
            brand = model["brand"]
            key = f"{brand['slug']}/{model['slug']}/{model['source_id']}"
            if key in completed:
                logger.write("info", f"Skipping completed model {position}/{len(models)}: {brand['name']} {model['name']}")
                continue
            logger.write("info", f"Processing model {position}/{len(models)}: {brand['name']} {model['name']} [{model['status']}]")
            try:
                bundle = scraper.fetch_model_bundle(model)
                if args.no_360:
                    bundle["three_sixty"] = None
                if args.dry_run:
                    logger.write(
                        "info",
                        f"Dry run: {len(bundle['versions'])} variants, {len(bundle['colors'])} colors, "
                        f"{len(bundle['gallery'])} images, 360={bool(bundle['three_sixty'])}",
                    )
                    continue

                if brand["slug"] not in brand_ids:
                    logo_url = None
                    if not args.skip_images:
                        try:
                            logo_url = image_store.prepare_brand_logo(brand)
                        except Exception as error:
                            logger.write("warn", f"Brand logo skipped: {brand['name']}", error=repr(error))
                    brand_ids[brand["slug"]] = importer.import_brand(brand, logo_url)

                media = (
                    {
                        "cover_image_url": None,
                        "colors": [{**color, "local_image_url": None} for color in bundle["colors"]],
                        "images": [],
                    }
                    if args.skip_images
                    else image_store.prepare_model_media(brand, model, bundle)
                )
                result = importer.import_model(brand_ids[brand["slug"]], brand, model, bundle, media)
                logger.write(
                    "info",
                    f"Saved {brand['name']} {model['name']}: "
                    f"{result['variant_count']} variants, {result['image_count']} images",
                )
                completed.add(key)
                save_checkpoint(completed)
            except HttpStatusError as error:
                if connection:
                    connection.rollback()
                if error.status_code == 404:
                    logger.write(
                        "warn",
                        f"Model skipped: URL not found for {brand['name']} {model['name']}",
                        url=error.url,
                    )
                else:
                    logger.write("error", f"Model failed: {brand['name']} {model['name']}", error=repr(error))
            except Exception as error:
                if connection:
                    connection.rollback()
                logger.write("error", f"Model failed: {brand['name']} {model['name']}", error=repr(error))
    finally:
        if connection:
            connection.close()
        http.close()

    logger.write("info", f"Run complete. Log: {logger.path}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped by user")
        sys.exit(130)
    except Exception as error:
        print(f"Fatal: {error}")
        sys.exit(1)
