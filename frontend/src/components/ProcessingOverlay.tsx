/**
 * ASTRA VISION Processing HUD Overlay & Completion Notification
 * Built by Preetham Alawandimath
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Radio, ScanLine } from 'lucide-react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
  isCompleted: boolean;
  onScrollTrigger?: () => void;
}

const STAGES = [
  { id: '01', title: 'IMAGE PREPROCESSING', desc: 'Resolution normalization & contrast equalization' },
  { id: '02', title: 'OBJECT DETECTION', desc: 'YOLO-compatible spatial bounding scan' },
  { id: '03', title: 'AIRCRAFT CLASSIFICATION', desc: 'ResNeSt-50 split-attention network evaluation' },
  { id: '04', title: 'CONFIDENCE ANALYSIS', desc: 'Calibrated temperature scaling & Top-3 distribution' },
  { id: '05', title: 'GRAD-CAM EXPLANATION', desc: 'Gradient activation & visual saliency synthesis' },
  { id: '06', title: 'FINALIZING RESULTS', desc: 'Result fusion & telemetry serialization' },
];

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isProcessing,
  isCompleted,
  onScrollTrigger,
}) => {
  const [activeStage, setActiveStage] = useState(0);

  // Advance stages visually while backend request is in-flight
  useEffect(() => {
    if (!isProcessing) {
      if (isCompleted) {
        setActiveStage(5);
      }
      return;
    }

    setActiveStage(0);
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing, isCompleted]);

  // When completed, trigger scroll after brief celebratory checkmark animation
  useEffect(() => {
    if (isCompleted && onScrollTrigger) {
      const timer = setTimeout(() => {
        onScrollTrigger();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onScrollTrigger]);

  if (!isProcessing && !isCompleted) return null;

  return (
    <div className="w-full my-6 animate-fade-in">
      {/* PROCESSING IN PROGRESS STATE */}
      {isProcessing && !isCompleted && (
        <div className="hud-box p-6 rounded-lg bg-hud-card/90 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
          {/* Scanning line animation */}
          <div className="scan-line pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Radar Reticle with Sweeper */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-500/30"></div>
              <div className="absolute inset-3 rounded-full border border-cyan-500/20 border-dashed"></div>
              <div className="absolute inset-8 rounded-full border border-cyan-500/10"></div>
              {/* Radar sweep arm */}
              <div
                className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 270deg, rgba(34, 211, 238, 0.4) 360deg)',
                }}
              ></div>
              {/* Center blip */}
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-white absolute"></div>
              <div className="absolute bottom-1 font-mono text-[9px] text-cyan-400">SCAN: ACTIVE</div>
            </div>

            {/* Stages List */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between border-b border-hud-border pb-2">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-mono text-sm font-bold tracking-widest text-white">
                    AI ANALYSIS IN PROGRESS
                  </span>
                </div>
                <span className="font-mono text-xs text-cyan-400 animate-pulse">
                  STAGE 0{activeStage + 1} / 06
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {STAGES.map((stage, idx) => {
                  const isCurrent = idx === activeStage;
                  const isDone = idx < activeStage;
                  return (
                    <div
                      key={stage.id}
                      className={`p-2 rounded border transition-all ${
                        isCurrent
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                          : isDone
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                          : 'border-slate-800/80 bg-slate-900/30 text-hud-dim'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {stage.id} — {stage.title}
                        </span>
                        {isDone && <span className="text-emerald-400 text-[10px]">DONE</span>}
                        {isCurrent && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
                      </div>
                      <div className="text-[10px] text-hud-muted truncate mt-0.5">{stage.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROCESSING COMPLETED NOTIFICATION */}
      {isCompleted && (
        <div className="hud-box p-5 rounded-lg bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.25)] animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-mono text-base font-bold tracking-wider text-emerald-300">
                  ✓ PROCESSING COMPLETED
                </h4>
                <p className="font-mono text-xs text-emerald-400/80">
                  AI analysis successfully completed. Scrolling to results...
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-900/40 px-3 py-1.5 rounded border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>INFERENCE COMPLETE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
