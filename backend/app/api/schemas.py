"""
ASTRA VISION Strongly-Typed API Schemas (Pydantic v2)
Built by Preetham Alawandimath
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    id: str = Field(..., description="Unique detection identifier")
    label: str = Field(..., description="Detected object class label")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    # Normalized coordinates [0.0, 1.0] for responsive rendering
    x_min: float = Field(..., ge=0.0, le=1.0)
    y_min: float = Field(..., ge=0.0, le=1.0)
    x_max: float = Field(..., ge=0.0, le=1.0)
    y_max: float = Field(..., ge=0.0, le=1.0)
    # Absolute pixel coordinates
    box_pixels: List[int] = Field(default_factory=list, description="[x1, y1, x2, y2] in pixels")


class Top3Prediction(BaseModel):
    rank: int = Field(..., ge=1, le=3)
    class_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    percentage: float = Field(..., ge=0.0, le=100.0)
    description: Optional[str] = None


class GradCamResponse(BaseModel):
    available: bool = True
    heatmap_base64: Optional[str] = None
    overlay_base64: Optional[str] = None
    target_class: str
    target_class_idx: int
    explanation: str = Field(
        default="Highlighted regions indicate image areas that contributed strongly to the classifier’s prediction."
    )
    status_message: Optional[str] = None


class ModelInfo(BaseModel):
    detector_architecture: str
    classifier_architecture: str
    inference_mode: str
    confidence_threshold: float
    iou_threshold: float
    device: str
    explainability_status: str
    is_demo: bool


class TimingProfile(BaseModel):
    validation_ms: float
    preprocessing_ms: float
    detection_ms: float
    classification_ms: float
    gradcam_ms: float
    total_ms: float


class AnalyzeResponse(BaseModel):
    success: bool
    processing_status: str = Field(default="completed")
    is_demo: bool
    demo_badge: Optional[str] = None
    message: str
    primary_prediction: Optional[str] = None
    confidence: Optional[float] = None
    confidence_tier: Optional[str] = None  # HIGH, MEDIUM, LOW
    top3: List[Top3Prediction] = Field(default_factory=list)
    detections: List[BoundingBox] = Field(default_factory=list)
    gradcam: Optional[GradCamResponse] = None
    model: ModelInfo
    timing: TimingProfile
    image_metadata: Dict[str, Any] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str
    app_name: str
    tagline: str
    creator: str
    version: str
    inference_mode: str
    is_demo: bool
    timestamp: str


class PerClassMetric(BaseModel):
    class_name: str
    test_samples: int
    precision: float
    recall: float
    f1_score: float
    top3_accuracy: float
    sample_aircraft: str


class OverallMetrics(BaseModel):
    accuracy: float
    top3_accuracy: float
    precision: float
    recall: float
    f1_score: float
    detector_map50: float
    detector_map50_95: float
    detector_precision: float
    detector_recall: float
    mean_inference_time_ms: float
    detector_time_ms: float
    classifier_time_ms: float
    gradcam_time_ms: float


class ConfusionMatrixData(BaseModel):
    labels: List[str]
    matrix: List[List[int]]


class BenchmarkMetadata(BaseModel):
    title: str
    dataset: str
    evaluation_date: str
    test_samples: int
    hardware: str
    lead_evaluator: str


class EvaluationResponse(BaseModel):
    benchmark_metadata: BenchmarkMetadata
    overall_metrics: OverallMetrics
    classes: List[str]
    per_class_metrics: List[PerClassMetric]
    confusion_matrix: ConfusionMatrixData


class HistoryItem(BaseModel):
    id: str
    timestamp: str
    filename: str
    primary_prediction: str
    confidence: float
    confidence_tier: str
    detection_count: int
    is_demo: bool
    thumbnail_base64: str
    inference_time_ms: float
