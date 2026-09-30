/**
 * ASTRA VISION Detection Viewport & Multi-Object Visualizer
 * Built by Preetham Alawandimath
 */

import React, { useState } from 'react';
import { BoundingBox } from '../types';
import { Crosshair, Eye, Target } from 'lucide-react';

interface DetectionCanvasProps {
  imageUrl: string;
  detections: BoundingBox[];
  selectedDetectionId?: string | null;
  onSelectDetection?: (box: BoundingBox) => void;
  isDemo?: boolean;
}

export const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageUrl,
  detections,
  selectedDetectionId,
  onSelectDetection,
  isDemo = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = selectedDetectionId || (detections.length > 0 ? detections[0].id : null);

  return (
    <div className="space-y-4">
      {/* Main Viewport Container */}
      <div className="hud-box rounded-lg overflow-hidden border-cyan-500/30 bg-black/90 relative group">
        {/* Aerospace HUD Grid & Coordinates Overlay */}
        <div className="absolute top-2 left-2 z-20 flex items-center space-x-2 font-mono text-[10px] text-cyan-400 bg-black/70 px-2 py-0.5 rounded border border-cyan-500/20">
          <Crosshair className="w-3 h-3 text-cyan-400" />
          <span>VIEWPORT: SENSOR FOV // 1080P</span>
          {isDemo && (
            <span className="text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-500/40">
              DEMO RESULT
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 z-20 font-mono text-[10px] text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/20">
          DETECTIONS: {detections.length}
        </div>

        {/* Viewport Image Area */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center bg-slate-950 select-none">
          <img
            src={imageUrl}
            alt="Aircraft Detection Viewport"
            className="w-full h-full object-contain max-h-[500px]"
          />

          {/* Real Animated Bounding Boxes */}
          {detections.map((det, index) => {
            const isSelected = activeId === det.id;
            const isHovered = hoveredId === det.id;

            // Normalized coordinates to percentages
            const left = `${det.x_min * 100}%`;
            const top = `${det.y_min * 100}%`;
            const width = `${(det.x_max - det.x_min) * 100}%`;
            const height = `${(det.y_max - det.y_min) * 100}%`;

            return (
              <div
                key={det.id}
                onClick={() => onSelectDetection && onSelectDetection(det)}
                onMouseEnter={() => setHoveredId(det.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ left, top, width, height }}
                className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                  isSelected
                    ? 'border-2 border-cyan-400 bg-cyan-400/15 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : isHovered
                    ? 'border-2 border-lime-400 bg-lime-400/10'
                    : 'border-2 border-cyan-500/70 bg-cyan-500/5'
                }`}
              >
                {/* HUD Tactical Box Corners */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white pointer-events-none"></div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white pointer-events-none"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white pointer-events-none"></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white pointer-events-none"></div>

                {/* Floating Tag with Label and Percentage */}
                <div
                  className={`absolute -top-7 left-0 whitespace-nowrap px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-md ${
                    isSelected
                      ? 'bg-cyan-500 text-black'
                      : 'bg-black/90 text-cyan-300 border border-cyan-500/50'
                  }`}
                >
                  <Target className="w-3 h-3" />
                  <span>{det.label}</span>
                  <span className="opacity-80">{(det.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Viewport Bottom Status Bar */}
        <div className="px-4 py-2 bg-hud-surface/90 border-t border-hud-border flex flex-wrap items-center justify-between text-[11px] font-mono text-hud-muted">
          <div className="flex items-center space-x-3">
            <span>ZOOM: 1.0X</span>
            <span>•</span>
            <span>RETICLE: AUTO-TRACK</span>
          </div>
          <div className="text-cyan-400">
            {detections.length > 0 ? 'TARGET ACQUIRED' : 'NO TARGET IN SENSOR FOV'}
          </div>
        </div>
      </div>

      {/* Multi-Object Mode Selector (Specification 27) */}
      {detections.length > 1 && (
        <div className="hud-box p-3 rounded-lg bg-hud-surface/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-hud-muted">
            <span className="font-semibold text-white">MULTI-OBJECT TARGET DISCRIMINATION</span>
            <span>{detections.length} TARGETS IDENTIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {detections.map((det, idx) => {
              const isSelected = activeId === det.id;
              return (
                <button
                  key={det.id}
                  onClick={() => onSelectDetection && onSelectDetection(det)}
                  className={`p-2.5 rounded border text-left font-mono transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'border-hud-border/70 bg-slate-900/40 text-hud-muted hover:border-cyan-500/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">DETECTION 0{idx + 1}</span>
                    <span className="text-cyan-400 font-semibold">
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-hud-muted mt-0.5 truncate">{det.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
