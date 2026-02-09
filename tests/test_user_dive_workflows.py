from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
from time import perf_counter
import copy
import statistics

import pytest


@pytest.fixture
def sample_user() -> dict:
    return {
        "id": "user-123",
        "username": "diver_one",
        "email": "diver@example.com",
        "fullName": "Diver One",
        "createdAt": "2026-01-01T12:00:00Z",
        "role": "user",
        "preferences": {
            "language": "en",
            "units": "metric",
            "theme": "dark",
            "notifications": {
                "diveReminders": True,
                "weatherAlerts": True,
                "safetyTips": False,
            },
        },
    }


@pytest.fixture
def sample_dive_entry(sample_user: dict) -> dict:
    return {
        "id": "dive-001",
        "userId": sample_user["id"],
        "date": "2026-02-01",
        "time": "06:30",
        "location": "Eilat Reef",
        "depth": 18,
        "duration": 42,
        "visibility": 15,
        "weather": {
            "condition": "sunny",
            "temperature": 27,
            "waterTemperature": 24,
            "windSpeed": 8,
            "windDirection": "NW",
            "waveHeight": 0.6,
            "current": "weak",
        },
        "equipment": {
            "mask": "Cressi",
            "fins": "Mares",
            "suit": "3mm",
            "weight": 4,
            "gear": ["knife", "dive-watch"],
        },
        "fishingType": "speargun",
        "catches": [],
        "photos": [],
        "notes": "Calm morning dive",
        "rating": 5,
        "createdAt": "2026-02-01T06:00:00Z",
        "updatedAt": "2026-02-01T07:15:00Z",
    }


@pytest.fixture
def connection_states() -> list[dict]:
    return [
        {"effectiveType": "4g", "isOnline": True},
        {"effectiveType": "3g", "isOnline": True},
        {"effectiveType": "2g", "isOnline": True},
        {"effectiveType": None, "isOnline": False},
    ]


@pytest.fixture
def large_dive_dataset(sample_dive_entry: dict) -> list[dict]:
    base_time = datetime(2026, 2, 1, 6, 30)
    entries: list[dict] = []
    for i in range(1200):
        entry = copy.deepcopy(sample_dive_entry)
        entry["id"] = f"dive-{i:04d}"
        entry["duration"] = 20 + (i % 60)
        entry["depth"] = 5 + (i % 35)
        entry["date"] = (base_time + timedelta(days=i % 30)).date().isoformat()
        entries.append(entry)
    return entries


def test_user_creation_fixture_contains_required_fields(sample_user: dict):
    required = {"id", "username", "email", "fullName", "role", "preferences"}
    assert required.issubset(sample_user.keys())
    assert sample_user["role"] in {"user", "admin", "moderator"}


def test_user_preferences_fixture_is_well_formed(sample_user: dict):
    preferences = sample_user["preferences"]
    assert preferences["language"] in {"en", "he"}
    assert preferences["units"] in {"metric", "imperial"}
    assert set(preferences["notifications"].keys()) == {
        "diveReminders",
        "weatherAlerts",
        "safetyTips",
    }


def test_new_dive_entry_links_to_existing_user(sample_user: dict, sample_dive_entry: dict):
    assert sample_dive_entry["userId"] == sample_user["id"]
    assert sample_dive_entry["depth"] > 0
    assert 1 <= sample_dive_entry["rating"] <= 5


def test_new_dive_entry_has_expected_nested_structures(sample_dive_entry: dict):
    assert "weather" in sample_dive_entry and "equipment" in sample_dive_entry
    assert sample_dive_entry["weather"]["condition"] in {
        "sunny",
        "cloudy",
        "rainy",
        "stormy",
        "foggy",
    }
    assert isinstance(sample_dive_entry["equipment"]["gear"], list)


def test_connection_states_include_online_and_offline_cases(connection_states: list[dict]):
    assert any(state["isOnline"] for state in connection_states)
    assert any(not state["isOnline"] for state in connection_states)


def test_connection_fallback_type_for_missing_network_info(connection_states: list[dict]):
    fallback = [state["effectiveType"] or "unknown" for state in connection_states]
    assert "unknown" in fallback
    assert {"2g", "3g", "4g"}.issubset(set(fallback))


def test_dive_entry_interface_includes_user_link_and_weather_fields():
    types_file = Path("src/types/index.ts").read_text(encoding="utf-8")
    assert "export interface DiveEntry" in types_file
    assert "userId: string" in types_file
    assert "weather:" in types_file


def test_user_role_union_includes_expected_values():
    user_types_file = Path("src/types/user.ts").read_text(encoding="utf-8")
    assert "export type UserRole = 'user' | 'admin' | 'moderator';" in user_types_file


def test_bulk_dive_duration_aggregation_performance(large_dive_dataset: list[dict]):
    start = perf_counter()
    total_duration = sum(entry["duration"] for entry in large_dive_dataset)
    elapsed = perf_counter() - start

    assert total_duration > 0
    assert elapsed < 0.05


def test_bulk_dive_statistics_performance(large_dive_dataset: list[dict]):
    start = perf_counter()
    average_depth = statistics.fmean(entry["depth"] for entry in large_dive_dataset)
    max_duration = max(entry["duration"] for entry in large_dive_dataset)
    elapsed = perf_counter() - start

    assert 5 <= average_depth <= 40
    assert max_duration == 79
    assert elapsed < 0.05
