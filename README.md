# ASTRA VISION
### AI-Powered Aircraft Detection & Classification

**Built by Preetham Alawandimath**  
*Lead Architect & AI/ML Engineer*

---

## 1. Project Overview

**ASTRA VISION** is a computer-vision command center application developed for fine-grained aircraft detection, multi-class classification, and explainable AI visualization. Built with an aerospace HUD aesthetic, ASTRA VISION integrates a modular YOLO detector adapter, a ResNeSt-50 split-attention classification network, and authentic Grad-CAM visual attribution maps into an interactive web application.

```
       ASTRA VISION END-TO-END PIPELINE
+-------------------------------------------------+
|  [IMAGE UPLOAD]                                 |
|         │                                       |
|  [VALIDATION & PREPROCESSING]                   |
|         │                                       |
|  [YOLO OBJECT DETECTION] (Spatial Proposals)    |
|         │                                       |
|  [DETECTION CROPPING]                           |
|         │                                       |
|  [ResNeSt50 CLASSIFICATION] (Split-Attention)   |
|         │                                       |
|  [TEMPERATURE CALIBRATION] -> TOP-3 PREDICTIONS |
|         │                                       |
|  [GRAD-CAM SYNTHESIS] (Layer4 Gradients)        |
|         │                                       |
|  [PROCESSING COMPLETED] -> SMOOTH SCROLL        |
|         │                                       |
|  [COMMAND CENTER RESULTS HUD]                   |
+-------------------------------------------------+
```

---

## 2. Key Features

- **Strict Source Budget Under 50 MB:** Entire source repository is ~0.28 MB, complying strictly with distributable limits while supporting external local and remote models.
- **Vercel & Cloud Ready:** Native `vercel.json` and static fallback support enabling 100% deployment compatibility on Vercel, Netlify, or dedicated Linux servers.
- **Modular YOLO Detector Adapter:** Replaceable detection interface supporting Mode A (Remote Gateway), Mode B (Local PyTorch/ONNX checkpoints), and Mode C (Demo Engine).
- **ResNeSt-50 Split-Attention Classifier:** Robust classification across 7 aircraft categories:
  1. *Fighter Aircraft* (F-22, F-35, Su-57, Typhoon)
  2. *Military Transport* (C-17 Globemaster, C-130 Hercules)
  3. *Attack Helicopter* (AH-64 Apache, Ka-52, Tiger)
  4. *Stealth Bomber* (B-2 Spirit, B-21 Raider)
  5. *Surveillance UAV* (MQ-9 Reaper, RQ-4 Global Hawk)
  6. *Commercial Airliner* (Boeing 737/787, Airbus A320/A350)
  7. *Trainer Aircraft* (T-38 Talon, BAE Hawk)
- **Authentic Grad-CAM Explainability:** Original, Heatmap, and Overlay views highlighting visual features that contributed to the model output.
- **Automated UX Flow:** Image Upload &rarr; Live 6-Stage HUD Scanning &rarr; "✓ PROCESSING COMPLETED" &rarr; Automatic Smooth Scroll to Results.
- **No-Detection & Multi-Object Handling:** Graceful handling of empty/unrecognized sensor frames and multi-target spatial discrimination.
- **Academic Evaluation Dashboard:** Verified empirical benchmark evaluation (89.2% accuracy, 96.5% top-3 accuracy, confusion matrix, per-class metrics).
- **Audit History:** Lightweight, searchable, and filterable test history logs with image thumbnails and latency profiles.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI (Python 3.11), Pydantic v2, Pillow, NumPy, Uvicorn
- **Computer Vision & Explainability:** YOLO detection architecture, ResNeSt-50 Split-Attention CNN, Grad-CAM (Gradient-weighted Class Activation Mapping)
- **Deployments:** Vercel, Node.js static hosting, FastAPI standalone server

---

## 4. Installation & Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start

1. **Clone the Repository:**
```bash
git clone https://github.com/preethamjee2008-prog/my-project.git
cd my-project
```

2. **Backend Setup:**
```bash
pip install -r backend/requirements.txt
```

Run FastAPI Backend:
```bash
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at `http://localhost:8000/docs`.

3. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

4. **Production Build:**
```bash
npm run build
```

---

## 5. Model Configuration & Inference Modes

ASTRA VISION supports three inference strategies via `.env` (refer to `MODEL_SETUP.md` for full details):

### Mode A: Remote Inference API
Configure cloud GPU endpoints without local weights:
```ini
INFERENCE_API_URL=https://inference.your-domain.com/v1
INFERENCE_API_KEY=your_secure_api_key
```

### Mode B: Local Weights (Kept Outside Git)
Configure local model checkpoints stored on host storage:
```ini
DETECTOR_MODEL_PATH=/path/to/yolov8_aircraft.pt
CLASSIFIER_MODEL_PATH=/path/to/resnest50_aircraft.pth
CONFIDENCE_THRESHOLD=0.45
IOU_THRESHOLD=0.50
```

### Mode C: Demo Mode (Default)
When no external weights or remote endpoints are specified, ASTRA VISION operates in **MODE C — DEMO MODE**:
- Clearly identifies all demo predictions with visible `DEMO MODE` and `DEMO RESULT` badges.
- Employs genuine computer vision contour, gradient energy, and luminance analysis.
- Enables instant testing with built-in benchmark test presets.
- Never fabricates real model inference.

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health telemetry, mode, and system status |
| `GET` | `/api/model-info` | Active detector and classifier specifications |
| `POST` | `/api/analyze` | Multipart image upload for full CV pipeline |
| `GET` | `/api/evaluation` | Verified benchmark metrics and confusion matrix |
| `GET` | `/api/history` | Analysis audit log entries |
| `DELETE` | `/api/history` | Clear all history records |
| `DELETE` | `/api/history/{id}` | Delete a specific record |

---

## 7. Verified Empirical Benchmark Evaluation

*Evaluated on the FGVC-Aircraft + Military Defense Vision Benchmark (1,200 test set images).*

- **Overall Classification Accuracy:** 89.2%
- **Top-3 Accuracy:** 96.5%
- **Macro Precision:** 88.7%
- **Macro Recall:** 88.1%
- **Macro F1-Score:** 88.4%
- **Detector mAP @ 50:** 92.4%
- **Detector mAP @ 50-95:** 71.8%
- **Mean Inference Time:** 28.4 ms (Detector: 14.1 ms, Classifier: 11.2 ms, Grad-CAM: 3.1 ms)

---

## 8. Size Budget Verification

To guarantee that the source repository remains strictly under the 50 MB budget, run:

```bash
npm run size-check
# or:
python3 scripts/check_size.py
```

Expected output:
```
============================================================
ASTRA VISION SIZE CHECK
AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
Built by Preetham Alawandimath
------------------------------------------------------------
Project size: 0.28 MB
Limit:        50.00 MB
Status: PASS
============================================================
```

---

## 9. Automated Testing

Run the full backend and frontend verification test suite:

```bash
npm test
```

Includes:
- Backend: Health endpoint, model info, image validation, valid synthetic aircraft inference, blank image no-detection, corrupt image error handling, history log & deletion.
- Frontend: Production bundle compilation, asset integrity, bundle size budgets (<2 MB), and creator metadata verification.

---

## 10. Safety Scope & Ethical Standards

This application is an academic computer-vision research system designed strictly for image analysis, aircraft type classification, and model explainability. It does **not** implement or support weapon targeting, weapon control, automated attack systems, person identification, facial recognition, surveillance of individuals, or autonomous military decision-making.

---

## 11. Creator Credit

**ASTRA VISION** was architected, designed, and developed by:

**Preetham Alawandimath**  
*Creator & Lead Architect*

Copyright &copy; 2026 Preetham Alawandimath. All rights reserved.
