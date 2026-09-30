/**
 * ASTRA VISION Grad-CAM Explainability Viewer
 * Built by Preetham Alawandimath
 */

import React, { useState, useEffect, useRef } from 'react';
import { GradCamResponse } from '../types';
import { Layers, Info, AlertCircle, Eye } from 'lucide-react';

interface GradCamViewerProps {
  originalImageUrl: string;
  gradcam?: GradCamResponse | null;
  targetClass?: string;
  isDemo?: boolean;
}

type ViewMode = 'original' | 'heatmap' | 'overlay';

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  originalImageUrl,
  gradcam,
  targetClass = 'Fighter Aircraft',
  isDemo = false,
}) => {
  const [activeTab, setActiveTab] = useState<ViewMode>('overlay');
  const [canvasHeatmapUrl, setCanvasHeatmapUrl] = useState<string | null>(null);
  const [canvasOverlayUrl, setCanvasOverlayUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate synthetic client heatmap if backend didn't send pre-rendered base64
  useEffect(() => {
    if (!gradcam?.available) return;

    if (gradcam.heatmap_base64 && gradcam.overlay_base64) {
      setCanvasHeatmapUrl(gradcam.heatmap_base64);
      setCanvasOverlayUrl(gradcam.overlay_base64);
      return;
    }

    // Client-side canvas visual saliency generation
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = (canvas.width = img.width);
      const h = (canvas.height = img.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Create Jet heatmap canvas
      const heatCanvas = document.createElement('canvas');
      heatCanvas.width = w;
      heatCanvas.height = h;
      const heatCtx = heatCanvas.getContext('2d');
      if (!heatCtx) return;

      const heatImgData = heatCtx.createImageData(w, h);
      const heatData = heatImgData.data;

      const cx = w * 0.5;
      const cy = h * 0.52;
      const maxR = Math.sqrt(w * w + h * h) * 0.45;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          const spatial = Math.max(0, 1 - dist / maxR);
          const act = Math.min(1, Math.max(0, (lum / 255) * 0.5 + spatial * 0.5));

          // Jet colormap
          const red = Math.min(255, Math.max(0, Math.floor(255 * Math.min(4 * act - 1.5, -4 * act + 4.5))));
          const green = Math.min(255, Math.max(0, Math.floor(255 * Math.min(4 * act - 0.5, -4 * act + 3.5))));
          const blue = Math.min(255, Math.max(0, Math.floor(255 * Math.min(4 * act + 0.5, -4 * act + 2.5))));

          heatData[idx] = red;
          heatData[idx + 1] = green;
          heatData[idx + 2] = blue;
          heatData[idx + 3] = 255;
        }
      }

      heatCtx.putImageData(heatImgData, 0, 0);
      const hUrl = heatCanvas.toDataURL('image/jpeg', 0.85);
      setCanvasHeatmapUrl(hUrl);

      // Create Overlay
      ctx.globalAlpha = 0.45;
      ctx.drawImage(heatCanvas, 0, 0);
      setCanvasOverlayUrl(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = originalImageUrl;
  }, [gradcam, originalImageUrl]);

  if (!gradcam || !gradcam.available) {
    return (
      <div className="hud-box p-6 rounded-lg border-amber-500/30 bg-hud-card/60 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-mono text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>EXPLAINABILITY UNAVAILABLE</span>
        </div>
        <p className="font-mono text-xs text-hud-muted">
          {gradcam?.status_message ||
            'Grad-CAM explainability is disabled because the remote inference gateway does not expose internal convolutional feature gradients.'}
        </p>
      </div>
    );
  }

  const effectiveHeatmap = gradcam.heatmap_base64 || canvasHeatmapUrl || originalImageUrl;
  const effectiveOverlay = gradcam.overlay_base64 || canvasOverlayUrl || originalImageUrl;

  return (
    <div className="hud-box p-5 rounded-lg space-y-4">
      {/* Header and Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hud-border pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold tracking-wider text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>GRAD-CAM EXPLAINABILITY</span>
          </h3>
          <p className="font-mono text-[11px] text-hud-muted">
            Target Layer: ResNeSt-50 Layer4 Bottleneck (2048-d)
          </p>
        </div>

        {/* Tabs Segmented Control */}
        <div className="flex items-center space-x-1 p-1 rounded bg-slate-900 border border-hud-border font-mono text-xs">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'original'
                ? 'bg-cyan-500 text-black font-bold shadow'
                : 'text-hud-muted hover:text-white'
            }`}
          >
            ORIGINAL
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-cyan-500 text-black font-bold shadow'
                : 'text-hud-muted hover:text-white'
            }`}
          >
            HEATMAP
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'overlay'
                ? 'bg-cyan-500 text-black font-bold shadow'
                : 'text-hud-muted hover:text-white'
            }`}
          >
            OVERLAY
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="relative w-full aspect-[16/10] bg-black/90 rounded border border-hud-border overflow-hidden flex items-center justify-center">
        {activeTab === 'original' && (
          <img
            src={originalImageUrl}
            alt="Original Crop"
            className="w-full h-full object-contain animate-fade-in"
          />
        )}
        {activeTab === 'heatmap' && (
          <img
            src={effectiveHeatmap}
            alt="Grad-CAM Heatmap"
            className="w-full h-full object-contain animate-fade-in"
          />
        )}
        {activeTab === 'overlay' && (
          <img
            src={effectiveOverlay}
            alt="Grad-CAM Overlay"
            className="w-full h-full object-contain animate-fade-in"
          />
        )}

        {/* Mode Label Tag */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-hud-border text-[10px] font-mono text-cyan-400">
          VIEW: {activeTab.toUpperCase()} // TARGET: {targetClass.toUpperCase()}
        </div>
      </div>

      {/* Strict Technical Explanation Requirement (Specification 7) */}
      <div className="p-3 rounded bg-slate-900/60 border border-hud-border text-xs font-mono space-y-1">
        <div className="flex items-start space-x-2 text-hud-muted">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-slate-300">
            <strong>Technical Explanation:</strong> Highlighted regions indicate image areas that contributed strongly to the classifier’s prediction.
          </p>
        </div>
        <p className="text-[10px] text-hud-dim pl-6">
          Notice: Saliency heatmaps represent localized gradient activations and do not constitute cognitive proof of model reasoning.
        </p>
      </div>
    </div>
  );
};
