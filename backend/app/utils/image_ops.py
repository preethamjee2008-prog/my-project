"""
ASTRA VISION Image Operations & Validation Utilities
Built by Preetham Alawandimath
"""

import io
import base64
from typing import Tuple, Optional, List
from PIL import Image, ImageOps, ImageDraw, ImageFont
from ..config import settings
from ..api.schemas import BoundingBox


def validate_image_bytes(
    file_bytes: bytes, filename: str
) -> Tuple[bool, Optional[str], Optional[Image.Image]]:
    """
    Validates uploaded image against strict criteria:
    - Byte length does not exceed limit (15 MB)
    - File extension is allowed
    - Valid decodable image data
    - Reasonable dimensions (64x64 to 6000x6000)
    """
    if len(file_bytes) == 0:
        return False, "Uploaded file is empty (0 bytes).", None

    if len(file_bytes) > settings.MAX_IMAGE_SIZE_BYTES:
        mb = len(file_bytes) / (1024 * 1024)
        return (
            False,
            f"File size exceeds maximum limit of 15 MB (Received: {mb:.1f} MB).",
            None,
        )

    # Check extension
    lower_name = filename.lower()
    has_valid_ext = any(lower_name.endswith(ext) for ext in settings.ALLOWED_EXTENSIONS)
    if not has_valid_ext:
        return (
            False,
            f"Unsupported file format '{filename}'. Allowed formats: JPG, JPEG, PNG, WEBP.",
            None,
        )

    # Decode image with PIL
    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.load()
    except Exception as e:
        return False, f"Failed to decode image: Corrupted or unreadable format ({str(e)}).", None

    # Normalization (EXIF orientation and RGB conversion)
    try:
        image = ImageOps.exif_transpose(image)
    except Exception:
        pass

    if image.mode != "RGB":
        image = image.convert("RGB")

    width, height = image.size
    if width < 64 or height < 64:
        return (
            False,
            f"Image dimensions ({width}x{height}) are too small. Minimum resolution is 64x64.",
            None,
        )

    if width > 6000 or height > 6000:
        return (
            False,
            f"Image dimensions ({width}x{height}) exceed maximum allowed dimension (6000x6000).",
            None,
        )

    return True, None, image


def image_to_base64(img: Image.Image, format_name: str = "JPEG", quality: int = 85) -> str:
    """Encodes PIL Image to Base64 data URI string."""
    buffered = io.BytesIO()
    if format_name.upper() == "PNG":
        img.save(buffered, format="PNG")
        mime = "image/png"
    else:
        img.save(buffered, format="JPEG", quality=quality)
        mime = "image/jpeg"
    b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:{mime};base64,{b64}"


def create_thumbnail_base64(img: Image.Image, max_dim: int = 128) -> str:
    """Creates a tiny thumbnail string for efficient history storage."""
    thumb = img.copy()
    thumb.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    return image_to_base64(thumb, format_name="JPEG", quality=75)


def crop_roi(img: Image.Image, box: BoundingBox) -> Image.Image:
    """Extracts high-resolution region of interest from bounding box."""
    w, h = img.size
    x1 = int(box.x_min * w)
    y1 = int(box.y_min * h)
    x2 = int(box.x_max * w)
    y2 = int(box.y_max * h)

    # Clamp coordinates
    x1 = max(0, min(x1, w - 1))
    y1 = max(0, min(y1, h - 1))
    x2 = max(x1 + 1, min(x2, w))
    y2 = max(y1 + 1, min(y2, h))

    return img.crop((x1, y1, x2, y2))
