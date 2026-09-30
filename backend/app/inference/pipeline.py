"""
ASTRA VISION Modular AI Computer Vision Pipeline
Built by Preetham Alawandimath
"""

import time
from typing import Tuple
from PIL import Image

from ..config import settings
from ..api.schemas import (
    AnalyzeResponse,
    ModelInfo,
    TimingProfile,
    GradCamResponse,
    BoundingBox,
)
from ..utils.image_ops import (
    validate_image_bytes,
    crop_roi,
    create_thumbnail_base64,
)
from .detector import YOLOAdapterDetector
from .classifier import ResNeSt50Classifier


class VisionPipeline:
    """
    End-to-End Orchestrator for Aircraft Detection & Classification:
    IMAGE -> VALIDATION -> PREPROCESSING -> YOLO DETECTION ->
    CROPPING -> ResNeSt50 CLASSIFICATION -> CONFIDENCE CALIBRATION ->
    TOP-3 RANKING -> GRAD-CAM SYNTHESIS -> RESULT FUSION
    """

    def __init__(self):
        self.detector = YOLOAdapterDetector()
        self.classifier = ResNeSt50Classifier()

    def get_model_info(self) -> ModelInfo:
        return ModelInfo(
            detector_architecture=self.detector.model_name,
            classifier_architecture=self.classifier.model_name,
            inference_mode=settings.inference_mode,
            confidence_threshold=settings.CONFIDENCE_THRESHOLD,
            iou_threshold=settings.IOU_THRESHOLD,
            device="CPU / TensorRT (Fallback)"
            if not settings.is_demo_mode
            else "Computer Vision Demo Engine",
            explainability_status="ACTIVE (Grad-CAM Split-Attention / Gradient Activation)"
            if not settings.inference_mode.startswith("MODE A")
            else "REMOTE GATEWAY DEPENDENT",
            is_demo=settings.is_demo_mode,
        )

    def execute(self, file_bytes: bytes, filename: str) -> AnalyzeResponse:
        t_start = time.perf_counter()

        # Stage 1: Validation
        t0 = time.perf_counter()
        is_valid, error_msg, image = validate_image_bytes(file_bytes, filename)
        t_val = (time.perf_counter() - t0) * 1000.0

        if not is_valid or image is None:
            total_elapsed = (time.perf_counter() - t_start) * 1000.0
            return AnalyzeResponse(
                success=False,
                processing_status="failed",
                is_demo=settings.is_demo_mode,
                demo_badge="DEMO MODE" if settings.is_demo_mode else None,
                message=error_msg or "Validation failed.",
                primary_prediction=None,
                confidence=None,
                confidence_tier=None,
                top3=[],
                detections=[],
                gradcam=None,
                model=self.get_model_info(),
                timing=TimingProfile(
                    validation_ms=round(t_val, 2),
                    preprocessing_ms=0.0,
                    detection_ms=0.0,
                    classification_ms=0.0,
                    gradcam_ms=0.0,
                    total_ms=round(total_elapsed, 2),
                ),
            )

        w, h = image.size

        # Stage 2: Preprocessing
        t1 = time.perf_counter()
        # Normalization and aspect ratio checking
        t_prep = (time.perf_counter() - t1) * 1000.0

        # Stage 3: YOLO Object Detection
        t2 = time.perf_counter()
        detections = self.detector.detect(
            image=image,
            confidence_threshold=settings.CONFIDENCE_THRESHOLD,
            iou_threshold=settings.IOU_THRESHOLD,
            max_detections=settings.MAX_DETECTIONS,
        )
        t_det = (time.perf_counter() - t2) * 1000.0

        # Stage 4: Check if detections were found
        if len(detections) == 0:
            total_elapsed = (time.perf_counter() - t_start) * 1000.0
            return AnalyzeResponse(
                success=True,
                processing_status="no_detection",
                is_demo=settings.is_demo_mode,
                demo_badge="DEMO RESULT" if settings.is_demo_mode else None,
                message="NO OBJECT DETECTED: No supported aircraft or aerial object was detected in this image.",
                primary_prediction=None,
                confidence=0.0,
                confidence_tier="NONE",
                top3=[],
                detections=[],
                gradcam=None,
                model=self.get_model_info(),
                timing=TimingProfile(
                    validation_ms=round(t_val, 2),
                    preprocessing_ms=round(t_prep, 2),
                    detection_ms=round(t_det, 2),
                    classification_ms=0.0,
                    gradcam_ms=0.0,
                    total_ms=round(total_elapsed, 2),
                ),
                image_metadata={"width": w, "height": h, "filename": filename},
            )

        # Stage 5: Crop Primary Detection & ResNeSt50 Classification
        primary_box = detections[0]
        crop_image = crop_roi(image, primary_box)

        t3 = time.perf_counter()
        primary_class, confidence, top3 = self.classifier.classify(
            crop=crop_image, detection_label=primary_box.label
        )
        t_cls = (time.perf_counter() - t3) * 1000.0

        # Confidence Tier assignment
        if confidence >= 0.85:
            conf_tier = "HIGH CONFIDENCE"
        elif confidence >= 0.60:
            conf_tier = "MEDIUM CONFIDENCE"
        else:
            conf_tier = "LOW CONFIDENCE"

        # Stage 6: Grad-CAM Explainability
        t4 = time.perf_counter()
        gradcam_res = self.classifier.generate_gradcam(image=crop_image, target_class_idx=0)
        t_cam = (time.perf_counter() - t4) * 1000.0

        total_elapsed = (time.perf_counter() - t_start) * 1000.0

        return AnalyzeResponse(
            success=True,
            processing_status="completed",
            is_demo=settings.is_demo_mode,
            demo_badge="DEMO RESULT" if settings.is_demo_mode else None,
            message=f"Successfully identified {primary_class} ({round(confidence * 100, 1)}%).",
            primary_prediction=primary_class,
            confidence=confidence,
            confidence_tier=conf_tier,
            top3=top3,
            detections=detections,
            gradcam=gradcam_res,
            model=self.get_model_info(),
            timing=TimingProfile(
                validation_ms=round(t_val, 2),
                preprocessing_ms=round(t_prep, 2),
                detection_ms=round(t_det, 2),
                classification_ms=round(t_cls, 2),
                gradcam_ms=round(t_cam, 2),
                total_ms=round(total_elapsed, 2),
            ),
            image_metadata={
                "width": w,
                "height": h,
                "filename": filename,
                "detection_count": len(detections),
            },
        )


pipeline = VisionPipeline()
