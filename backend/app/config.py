"""
ASTRA VISION Configuration
Built by Preetham Alawandimath
"""

import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseModel):
    APP_NAME: str = "ASTRA VISION"
    TAGLINE: str = "AI-Powered Aircraft Detection & Classification"
    CREATOR: str = "Preetham Alawandimath"
    VERSION: str = "1.0.0"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://antigravity.luch.dev",
        "*",
    ]

    # Model Configuration
    # Mode A: Remote Inference
    INFERENCE_API_URL: str | None = os.getenv("INFERENCE_API_URL", None)
    INFERENCE_API_KEY: str | None = os.getenv("INFERENCE_API_KEY", None)

    # Mode B: Local Weights (Kept outside git repository)
    DETECTOR_MODEL_PATH: str | None = os.getenv("DETECTOR_MODEL_PATH", None)
    CLASSIFIER_MODEL_PATH: str | None = os.getenv("CLASSIFIER_MODEL_PATH", None)
    YOLO_MODEL: str = os.getenv("YOLO_MODEL", "yolov8n")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.45"))
    IOU_THRESHOLD: float = float(os.getenv("IOU_THRESHOLD", "0.50"))
    MAX_DETECTIONS: int = int(os.getenv("MAX_DETECTIONS", "10"))

    # Upload validation
    MAX_IMAGE_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB
    ALLOWED_MIME_TYPES: set[str] = {"image/jpeg", "image/png", "image/webp"}
    ALLOWED_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}

    @property
    def inference_mode(self) -> str:
        """
        Determines active inference mode:
        MODE A: Remote API
        MODE B: Local Model Weights
        MODE C: Demo Mode (Default when no external models configured)
        """
        if self.INFERENCE_API_URL and self.INFERENCE_API_URL.strip():
            return "MODE A — REMOTE MODEL"
        if (
            self.DETECTOR_MODEL_PATH
            and Path(self.DETECTOR_MODEL_PATH).exists()
            and self.CLASSIFIER_MODEL_PATH
            and Path(self.CLASSIFIER_MODEL_PATH).exists()
        ):
            return "MODE B — LOCAL MODEL"
        return "MODE C — DEMO MODE"

    @property
    def is_demo_mode(self) -> bool:
        return self.inference_mode.startswith("MODE C")


settings = Settings()
