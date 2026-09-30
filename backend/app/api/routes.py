"""
ASTRA VISION REST API Endpoints
Built by Preetham Alawandimath
"""

import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, status
from fastapi.responses import JSONResponse

from ..config import settings
from ..api.schemas import (
    HealthResponse,
    ModelInfo,
    AnalyzeResponse,
    EvaluationResponse,
    HistoryItem,
)
from ..inference.pipeline import pipeline
from ..services.evaluation import get_evaluation_metrics
from ..services.history import (
    add_history_entry,
    get_history_entries,
    delete_history_entry,
    clear_all_history,
)
from ..utils.image_ops import create_thumbnail_base64, validate_image_bytes

router = APIRouter(prefix="/api", tags=["Astra Vision"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Returns system status, active inference mode, and version telemetry."""
    return HealthResponse(
        status="ONLINE",
        app_name=settings.APP_NAME,
        tagline=settings.TAGLINE,
        creator=settings.CREATOR,
        version=settings.VERSION,
        inference_mode=settings.inference_mode,
        is_demo=settings.is_demo_mode,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )


@router.get("/model-info", response_model=ModelInfo)
async def model_info():
    """Returns real detector, classifier, and explainability architecture specifications."""
    return pipeline.get_model_info()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(
    image: UploadFile = File(..., description="Target image file (JPEG, PNG, WebP)")
):
    """
    Executes the full computer-vision pipeline on the uploaded image:
    Validation -> Preprocessing -> Detection -> Classification -> Grad-CAM -> Fusion.
    """
    try:
        file_bytes = await image.read()
        filename = image.filename or "uploaded_image.jpg"

        result = pipeline.execute(file_bytes=file_bytes, filename=filename)

        # If analysis succeeded and object was detected, save lightweight entry into history
        if result.success and result.primary_prediction:
            # Generate tiny thumbnail
            _, _, pil_img = validate_image_bytes(file_bytes, filename)
            thumb = create_thumbnail_base64(pil_img, max_dim=96) if pil_img else ""

            history_item = HistoryItem(
                id=str(uuid.uuid4())[:8],
                timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
                filename=filename,
                primary_prediction=result.primary_prediction,
                confidence=result.confidence or 0.0,
                confidence_tier=result.confidence_tier or "UNKNOWN",
                detection_count=len(result.detections),
                is_demo=result.is_demo,
                thumbnail_base64=thumb,
                inference_time_ms=result.timing.total_ms,
            )
            add_history_entry(history_item)

        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline execution error: {str(e)}",
        )


@router.get("/evaluation", response_model=EvaluationResponse)
async def get_evaluation():
    """Returns verified academic benchmark metrics and confusion matrix."""
    try:
        return get_evaluation_metrics()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load evaluation metrics: {str(e)}",
        )


@router.get("/history", response_model=List[HistoryItem])
async def get_history(
    search: Optional[str] = Query(None, description="Search query"),
    sort_by: str = Query("newest", description="Sort by 'newest', 'oldest', or 'confidence'"),
    filter_class: Optional[str] = Query(None, description="Filter by class name or 'ALL'"),
):
    """Retrieves recent analysis history logs."""
    return get_history_entries(search=search, sort_by=sort_by, filter_class=filter_class)


@router.delete("/history")
async def clear_history():
    """Clears all historical analysis entries."""
    cleared_count = clear_all_history()
    return {"success": True, "message": f"Cleared {cleared_count} history entries."}


@router.delete("/history/{entry_id}")
async def delete_history_item(entry_id: str):
    """Deletes a specific history record."""
    deleted = delete_history_entry(entry_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record '{entry_id}' not found.",
        )
    return {"success": True, "message": f"Deleted entry {entry_id}."}
