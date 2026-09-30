# ASTRA VISION — External Model Setup Guide
**AI-Powered Aircraft Detection & Classification**  
**Creator & Lead Architect:** Preetham Alawandimath

---

## 1. Modular Inference Architecture Overview

To strictly satisfy the **50 MB Source Budget Requirement**, heavy neural-network weights (`.pt`, `.pth`, `.onnx` &gt; 1 MB) are intentionally **excluded** from this git repository.

ASTRA VISION supports three distinct execution modes:

```
+-------------------------------------------------------------+
|                     ASTRA VISION MODES                      |
+-------------------------------------------------------------+
|  MODE A: REMOTE MODEL   -> Configured via INFERENCE_API_URL |
|  MODE B: LOCAL WEIGHTS  -> Stored locally outside repo      |
|  MODE C: DEMO MODE      -> Autonomous academic benchmark    |
+-------------------------------------------------------------+
```

---

## 2. Mode B: Local Model Configuration

If you have trained weights or checkpoints for the YOLO detector and ResNeSt50 classifier:

### A. Directory Placement
Place the model weights in a local directory **outside** or ignored by the git repository:

```bash
mkdir -p /home/user/models/astra-vision/
# Place your files:
# /home/user/models/astra-vision/yolov8_aircraft.pt
# /home/user/models/astra-vision/resnest50_aircraft.pth
```

### B. Environment Variables
Copy `.env.example` to `.env` and set the absolute paths:

```bash
cp .env.example .env
```

Edit `.env`:
```ini
# Detector Path
DETECTOR_MODEL_PATH=/home/user/models/astra-vision/yolov8_aircraft.pt
YOLO_MODEL=yolov8n
CONFIDENCE_THRESHOLD=0.45
IOU_THRESHOLD=0.50

# Classifier Path
CLASSIFIER_MODEL_PATH=/home/user/models/astra-vision/resnest50_aircraft.pth
```

### C. Installing Extended ML Dependencies
For local PyTorch and Ultralytics execution:
```bash
pip install ultralytics torch torchvision timm
```

---

## 3. Mode A: Remote Inference Endpoint

For deployment in cloud environments (e.g. AWS SageMaker, GCP Vertex AI, Triton Inference Server):

```ini
INFERENCE_API_URL=https://inference.your-domain.com/v1
INFERENCE_API_KEY=your_secure_api_key_here
```

The remote endpoint must accept multipart image uploads at:
- `POST /detect` -> returns `{"detections": [{"label": "Fighter Aircraft", "confidence": 0.92, "x_min": 0.1, "y_min": 0.1, "x_max": 0.8, "y_max": 0.8}]}`
- `POST /classify` -> returns `{"class": "Fighter Aircraft", "confidence": 0.924, "top3": [...]}`

---

## 4. Mode C: Demo Mode (Default)

If no external weights or remote endpoints are provided, ASTRA VISION immediately and transparently launches in **MODE C — DEMO MODE**:

- Displays clear `DEMO MODE` and `DEMO RESULT` indicators.
- Employs genuine computer-vision feature analysis (luminance, gradient energy, aspect ratio).
- Accurately executes the 6-stage pipeline, "PROCESSING COMPLETED" notification, and smooth scroll.
- Exercises edge cases such as "NO OBJECT DETECTED" and multi-object discrimination.
- Never fabricates real AI inference.
