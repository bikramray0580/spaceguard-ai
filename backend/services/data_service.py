"""Load and query space objects from the orbital data file."""

import json

from ..config import DATA_FILE
from ..models.object import SpaceObject


class ObjectNotFoundError(LookupError):
    """Raised when an object_id is not present in the orbital data."""


def load_objects() -> list[SpaceObject]:
    """Load all space objects from data/orbital_data.json."""
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        payload = json.load(file)
    return [SpaceObject.from_json(item) for item in payload["objects"]]


def list_objects() -> list[SpaceObject]:
    """Return all available space objects."""
    return load_objects()


def find_object(object_id: str) -> SpaceObject:
    """Return the object with the given canonical object_id."""
    for obj in load_objects():
        if obj.object_id == object_id:
            return obj
    raise ObjectNotFoundError(f"object not found: {object_id}")
