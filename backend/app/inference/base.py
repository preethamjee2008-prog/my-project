"""
ASTRA VISION Modular Computer Vision Base Interfaces
Built by Preetham Alawandimath
"""

from abc import ABC, abstractmethod
from typing import List, Tuple, Optional
from PIL import Image
from ..api.schemas import BoundingBox, Top3Prediction, GradCamResponse


class BaseDetector(ABC):
    """
    Abstract interface for YOLO-compatible Object Detectors.
    Can be backed by Local PyTorch YOLO, ONNX Runtime, TensorRT, or Remote Inference API.
    """

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Returns the identifier of the detection architecture."""
        pass

    @abstractmethod
    def detect(
        self,
        image: Image.Image,
        confidence_threshold: float = 0.45,
        iou_threshold: float = 0.50,
        max_detections: int = 10,
    ) -> List[BoundingBox]:
        """Performs object detection on the input image."""
        pass


class BaseClassifier(ABC):
    """
    Abstract interface for Aircraft Classification Models.
    Primary architecture: ResNeSt50.
    """

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Returns the classifier model identifier."""
        pass

    @abstractmethod
    def classify(self, crop: Image.Image) -> Tuple[str, float, List[Top3Prediction]]:
        """
        Classifies an aircraft crop.
        Returns:
            primary_class: str
            confidence: float (0.0 to 1.0)
            top3: List[Top3Prediction]
        """
        pass

    @abstractmethod
    def generate_gradcam(
        self, image: Image.Image, target_class_idx: Optional[int] = None
    ) -> Optional[GradCamResponse]:
        """Generates authentic Grad-CAM explainability heatmap and overlay."""
        pass
