#imported necessary libraries for data ingestion
import json
import re
from datetime import datetime , timezone
from pathlib import Path
from urllib.request import urlopen

CELESTRAK_URL = (
    "https://celestrak.org/NORAD/elements/"
    "gp.php?GROUP=active&FORMAT=tle"
)

OUTPUT_FILE = Path(__file__).resolve().parent.parent / "data" / "orbital_data.json"

OBJECT_LIMIT = 10


def fetch_tle_data():
    """Fetch the latest TLE data from CelesTrak."""
    
    with urlopen(CELESTRAK_URL, timeout=30) as response:
        data = response.read().decode("utf-8")

    return data


def parse_tle_data(raw_data, limit=OBJECT_LIMIT):
    """Parse CelesTrak's 3-line TLE format."""

    lines = [
        line.strip()
        for line in raw_data.splitlines()
        if line.strip()
    ]

    objects = []

    for i in range(0, len(lines) - 2, 3):

        name = lines[i]
        line1 = lines[i + 1]
        line2 = lines[i + 2]

        # Basic TLE structure validation
        if not line1.startswith("1 "):
            continue

        if not line2.startswith("2 "):
            continue

        # Extract NORAD ID from both TLE lines
        norad_1 = line1[2:7].strip()
        norad_2 = line2[2:7].strip()

        # Make sure both lines belong to the same object
        if norad_1 != norad_2:
            continue

        # Extract TLE epoch
        epoch = parse_tle_epoch(line1)

        objects.append(
            {
                "object_id": norad_1,
                "name": name,
                "tle": {
                    "line1": line1,
                    "line2": line2
                },
                "epoch": epoch
            }
        )

        if len(objects) >= limit:
            break

    return objects


def parse_tle_epoch(line1):
    """Convert TLE epoch into ISO-8601 UTC."""

    epoch_year = int(line1[18:20])
    epoch_day = float(line1[20:32])

    # TLE convention:
    # 00-56 -> 2000-2056
    # 57-99 -> 1957-1999
    year = 2000 + epoch_year if epoch_year < 57 else 1900 + epoch_year

    epoch = datetime(year, 1, 1, tzinfo=timezone.utc)

    from datetime import timedelta

    epoch += timedelta(days=epoch_day - 1)

    return epoch.isoformat().replace("+00:00", "Z")


def save_json(objects):
    """Save the processed orbital data."""

    fetched_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    output = {
        "source": "CelesTrak",
        "fetched_at": fetched_at,
        "objects": objects
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(output, file, indent=2)

    print(f"Saved {len(objects)} objects to {OUTPUT_FILE}")


def main():
    print("Fetching orbital data from CelesTrak...")

    raw_data = fetch_tle_data()

    print("Parsing TLE data...")

    objects = parse_tle_data(raw_data)

    if not objects:
        raise RuntimeError("No valid TLE objects were found.")

    save_json(objects)

    print("Data ingestion completed successfully.")


if __name__ == "__main__":
    main()