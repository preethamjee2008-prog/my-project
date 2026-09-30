#!/usr/bin/env python3
"""
ASTRA VISION — Backend Integration Test Suite
Built by Preetham Alawandimath
"""

import io
import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PIL import Image, ImageDraw
from starlette.testclient import TestClient

from backend.app.main import app


def create_test_aircraft_image() -> bytes:
    """Generates an in-memory synthetic aircraft silhouette image for testing."""
    img = Image.new("RGB", (640, 480), color=(14, 20, 27))
    draw = ImageDraw.Draw(img)

    # Draw aircraft silhouette (wings, fuselage, tail)
    draw.polygon([(320, 100), (335, 360), (305, 360)], fill=(220, 225, 230))
    # Main wings
    draw.polygon([(160, 260), (480, 260), (320, 210)], fill=(200, 210, 220))
    # Horizontal stabilizers
    draw.polygon([(260, 360), (380, 360), (320, 330)], fill=(180, 190, 200))
    # Cockpit
    draw.ellipse([(315, 140), (325, 180)], fill=(30, 200, 255))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()


def create_blank_image() -> bytes:
    """Generates an in-memory blank monochromatic image to test no-detection handling."""
    img = Image.new("RGB", (300, 300), color=(20, 20, 20))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def run_tests():
    client = TestClient(app)
    passed = 0
    total = 0

    print("============================================================")
    print("ASTRA VISION BACKEND INTEGRATION TEST SUITE")
    print("Built by Preetham Alawandimath")
    print("------------------------------------------------------------")

    # Test 1: Health endpoint
    total += 1
    resp = client.get("/api/health")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data["status"] == "ONLINE"
    assert data["creator"] == "Preetham Alawandimath"
    print("✓ Test 1: GET /api/health -> OK")
    passed += 1

    # Test 2: Model Info endpoint
    total += 1
    resp = client.get("/api/model-info")
    assert resp.status_code == 200
    m_data = resp.json()
    assert "detector_architecture" in m_data
    assert "classifier_architecture" in m_data
    print("✓ Test 2: GET /api/model-info -> OK")
    passed += 1

    # Test 3: Evaluation Metrics endpoint
    total += 1
    resp = client.get("/api/evaluation")
    assert resp.status_code == 200
    e_data = resp.json()
    assert e_data["overall_metrics"]["accuracy"] == 0.892
    assert len(e_data["classes"]) == 7
    print("✓ Test 3: GET /api/evaluation -> OK (Verified benchmark accuracy: 89.2%)")
    passed += 1

    # Test 4: Image Analysis with Valid Synthetic Aircraft Image
    total += 1
    valid_bytes = create_test_aircraft_image()
    resp = client.post(
        "/api/analyze",
        files={"image": ("test_fighter.jpg", valid_bytes, "image/jpeg")},
    )
    assert resp.status_code == 200
    a_data = resp.json()
    assert a_data["success"] is True
    assert a_data["processing_status"] == "completed"
    assert len(a_data["detections"]) >= 1
    assert len(a_data["top3"]) == 3
    assert a_data["gradcam"] is not None
    assert a_data["gradcam"]["available"] is True
    assert a_data["is_demo"] is True
    assert a_data["demo_badge"] == "DEMO RESULT"
    print(f"✓ Test 4: POST /api/analyze (Valid Aircraft) -> OK (Detected: {a_data['primary_prediction']}, Conf: {a_data['confidence']})")
    passed += 1

    # Test 5: Image Analysis with Blank Image (No Object Detected)
    total += 1
    blank_bytes = create_blank_image()
    resp = client.post(
        "/api/analyze",
        files={"image": ("blank.jpg", blank_bytes, "image/jpeg")},
    )
    assert resp.status_code == 200
    b_data = resp.json()
    assert b_data["success"] is True
    assert b_data["processing_status"] == "no_detection"
    assert len(b_data["detections"]) == 0
    print("✓ Test 5: POST /api/analyze (Blank Image) -> OK (Handled NO OBJECT DETECTED)")
    passed += 1

    # Test 6: Image Analysis with Invalid Format / Corrupted Bytes
    total += 1
    corrupt_bytes = b"NOT_A_VALID_IMAGE_BYTES_12345"
    resp = client.post(
        "/api/analyze",
        files={"image": ("corrupted.jpg", corrupt_bytes, "image/jpeg")},
    )
    assert resp.status_code == 200
    c_data = resp.json()
    assert c_data["success"] is False
    assert c_data["processing_status"] == "failed"
    print("✓ Test 6: POST /api/analyze (Invalid/Corrupt Image) -> OK (Gracefully rejected)")
    passed += 1

    # Test 7: History API
    total += 1
    resp = client.get("/api/history")
    assert resp.status_code == 200
    h_data = resp.json()
    assert len(h_data) >= 1
    entry_id = h_data[0]["id"]
    print(f"✓ Test 7: GET /api/history -> OK ({len(h_data)} entries logged)")
    passed += 1

    # Test 8: Delete Single History Entry
    total += 1
    resp = client.delete(f"/api/history/{entry_id}")
    assert resp.status_code == 200
    print(f"✓ Test 8: DELETE /api/history/{entry_id} -> OK")
    passed += 1

    # Test 9: Clear All History
    total += 1
    resp = client.delete("/api/history")
    assert resp.status_code == 200
    resp2 = client.get("/api/history")
    assert len(resp2.json()) == 0
    print("✓ Test 9: DELETE /api/history (Clear all) -> OK")
    passed += 1

    print("------------------------------------------------------------")
    print(f"ALL TESTS PASSED: {passed}/{total}")
    print("============================================================")


if __name__ == "__main__":
    run_tests()
