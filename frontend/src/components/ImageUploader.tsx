/**
 * ASTRA VISION Image Upload & Validation Component
 * Built by Preetham Alawandimath
 */

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, AlertCircle, FileImage, CheckCircle, RefreshCw } from 'lucide-react';
import { TEST_SAMPLES, TestSample } from '../services/demoData';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    size: string;
    dimensions?: string;
  } | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setError(null);

    // 1. File size check
    if (file.size > MAX_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size (${mb} MB) exceeds maximum allowed limit of 15 MB.`);
      return;
    }

    // 2. Extension check
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file extension '${ext}'. Allowed: JPG, JPEG, PNG, WEBP.`);
      return;
    }

    // 3. MIME type check
    if (!ALLOWED_TYPES.includes(file.type) && file.type !== '') {
      setError(`Invalid MIME type '${file.type}'. Allowed: image/jpeg, image/png, image/webp.`);
      return;
    }

    // 4. Dimension & integrity check via Image object
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width < 64 || img.height < 64) {
        setError(`Image resolution (${img.width}x${img.height}) is too small. Minimum resolution is 64x64.`);
        URL.revokeObjectURL(previewUrl);
        return;
      }
      if (img.width > 6000 || img.height > 6000) {
        setError(`Image resolution (${img.width}x${img.height}) exceeds max allowed dimension (6000x6000).`);
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setSelectedFileMeta({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        dimensions: `${img.width} × ${img.height} px`,
      });

      onImageSelected(file, previewUrl);
    };

    img.onerror = () => {
      setError('Corrupted or unreadable image file. Please provide a valid image.');
      URL.revokeObjectURL(previewUrl);
    };

    img.src = previewUrl;
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setActivePresetId(null);
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files[0]) {
      setActivePresetId(null);
      validateAndProcess(e.target.files[0]);
    }
  };

  const handleSelectPreset = async (preset: TestSample) => {
    if (disabled) return;
    setActivePresetId(preset.id);
    setError(null);

    // Convert SVG data URI to a synthetic File object
    try {
      const res = await fetch(preset.svgDataUri);
      const blob = await res.blob();
      const file = new File([blob], preset.filename, { type: 'image/jpeg' });
      validateAndProcess(file);
    } catch (err) {
      setError('Failed to load sample preset.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box with Aerospace HUD Corners */}
      <div
        className={`hud-box p-8 rounded-lg text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_24px_rgba(6,182,212,0.3)]'
            : 'border-hud-border hover:border-cyan-500/50 bg-hud-card/60'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          disabled={disabled}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <p className="font-mono text-base font-bold tracking-widest text-white">
              DROP IMAGE HERE
            </p>
            <p className="font-mono text-xs text-hud-muted mt-1">
              OR <span className="text-cyan-400 underline underline-offset-4">UPLOAD IMAGE</span>
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-hud-dim bg-slate-900/60 px-3 py-1 rounded border border-hud-border">
            <span>SUPPORTED: JPG • JPEG • PNG • WEBP</span>
            <span>|</span>
            <span>MAX: 15 MB</span>
          </div>

          {selectedFileMeta && (
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-500/30">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{selectedFileMeta.name}</span>
              <span className="text-emerald-300/70">({selectedFileMeta.size} • {selectedFileMeta.dimensions})</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Test Presets (Zero-friction evaluation presets) */}
      <div className="hud-box p-4 rounded-lg bg-hud-surface/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider flex items-center space-x-1.5">
            <FileImage className="w-3.5 h-3.5 text-cyan-400" />
            <span>BENCHMARK TEST PRESETS (1-CLICK EVALUATION)</span>
          </span>
          <span className="text-[10px] font-mono text-hud-dim">SELECT PRESET TARGET</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {TEST_SAMPLES.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPreset(preset);
                }}
                disabled={disabled}
                className={`p-2 rounded text-left border font-mono text-xs transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'border-hud-border/70 bg-slate-900/40 text-hud-muted hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <div className="font-semibold truncate">{preset.name}</div>
                <div className="text-[10px] text-hud-dim truncate mt-0.5">{preset.category}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
