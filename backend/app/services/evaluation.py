"""
ASTRA VISION Evaluation Metrics Service
Built by Preetham Alawandimath
"""

import json
from pathlib import Path
from ..api.schemas import EvaluationResponse

BENCHMARK_FILE = Path(__file__).resolve().parent.parent.parent.parent / "evaluation" / "benchmark_data.json"


def get_evaluation_metrics() -> EvaluationResponse:
    """Reads verified benchmark data from benchmark_data.json."""
    if not BENCHMARK_FILE.exists():
        raise FileNotFoundError(f"Benchmark file not found at {BENCHMARK_FILE}")

    with open(BENCHMARK_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    return EvaluationResponse(**data)
