#!/usr/bin/env python3
"""
ASTRA VISION — Distributable Package Size Verification Script
Built by Preetham Alawandimath

Enforces the strict 50 MB ceiling for the distributable source code.
Ignores .git, node_modules, .venv, caches, and build artifacts.
"""

import os
import sys
from pathlib import Path

MAX_ALLOWED_MB = 50.0

# Directories and patterns to exclude from distributable source calculation
EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "ENV",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".cache",
    ".turbo",
    ".next",
    "dist",
    "build",
    ".antigravity",
}

EXCLUDED_EXTENSIONS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".DS_Store",
}


def calculate_dir_size(root_path: Path):
    total_bytes = 0
    file_list = []

    for dirpath, dirnames, filenames in os.walk(root_path):
        # Exclude directories in-place
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS and not d.startswith(".")]

        for f in filenames:
            file_path = Path(dirpath) / f
            if file_path.suffix in EXCLUDED_EXTENSIONS:
                continue

            try:
                size = file_path.stat().st_size
                total_bytes += size
                file_list.append((size, file_path.relative_to(root_path)))
            except (OSError, FileNotFoundError):
                continue

    return total_bytes, file_list


def main():
    root_dir = Path(__file__).resolve().parent.parent
    total_bytes, files = calculate_dir_size(root_dir)
    total_mb = total_bytes / (1024 * 1024)

    # Sort largest files
    files.sort(key=lambda x: x[0], reverse=True)

    print("=" * 60)
    print("ASTRA VISION SIZE CHECK")
    print("AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION")
    print("Built by Preetham Alawandimath")
    print("-" * 60)
    print(f"Project size: {total_mb:.2f} MB")
    print(f"Limit:        {MAX_ALLOWED_MB:.2f} MB")
    print(f"Total source files scanned: {len(files)}")
    print("-" * 60)

    if total_mb <= MAX_ALLOWED_MB:
        print("Status: PASS")
        print("\nTop 5 largest source files:")
        for size, path in files[:5]:
            kb = size / 1024
            print(f"  - {path}: {kb:.2f} KB")
        print("=" * 60)
        sys.exit(0)
    else:
        print("Status: FAIL")
        print("Files exceeding budget:")
        for size, path in files[:10]:
            mb = size / (1024 * 1024)
            print(f"  - {path}: {mb:.2f} MB")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()
