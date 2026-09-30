/**
 * ASTRA VISION Top-3 Predictions & Confidence Calibrator
 * Built by Preetham Alawandimath
 */

import React, { useEffect, useState } from 'react';
import { Top3Prediction } from '../types';
import { Award, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Top3RankingsProps {
  primaryClass: string;
  confidence: number;
  confidenceTier: string;
  top3: Top3Prediction[];
  isDemo?: boolean;
}

export const Top3Rankings: React.FC<Top3RankingsProps> = ({
  primaryClass,
  confidence,
  confidenceTier,
  top3,
  isDemo = false,
}) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([0, 0, 0]);

  // Animate bars from 0 to real values
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(top3.map((p) => p.percentage));
    }, 150);
    return () => clearTimeout(timer);
  }, [top3]);

  const getTierBadge = () => {
    if (confidenceTier === 'HIGH CONFIDENCE') {
      return {
        bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
        text: 'HIGH CONFIDENCE',
        note: 'Calibrated certainty index exceeds 0.85 threshold.',
      };
    }
    if (confidenceTier === 'MEDIUM CONFIDENCE') {
      return {
        bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
        icon: <Award className="w-3.5 h-3.5 text-cyan-400" />,
        text: 'MEDIUM CONFIDENCE',
        note: 'Moderate certainty. Secondary validation recommended.',
      };
    }
    return {
      bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
      text: 'LOW CONFIDENCE',
      note: 'The model is uncertain about this prediction. Try a clearer image.',
    };
  };

  const tier = getTierBadge();

  return (
    <div className="hud-box p-5 rounded-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hud-border pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold tracking-wider text-white">
            TOP-3 PREDICTIONS
          </h3>
          <p className="font-mono text-[11px] text-hud-muted">
            ResNeSt-50 Split-Attention Calibrated Distribution
          </p>
        </div>
        <div className={`px-2.5 py-1 rounded text-xs font-mono border flex items-center space-x-1.5 ${tier.bg}`}>
          {tier.icon}
          <span className="font-semibold">{tier.text}</span>
        </div>
      </div>

      {/* Primary Classification Callout */}
      <div className="p-3.5 rounded bg-slate-900/60 border border-hud-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            PRIMARY IDENTIFICATION
          </span>
          <h4 className="font-mono text-lg font-bold text-white tracking-wide">
            {primaryClass}
          </h4>
          <p className="text-xs font-mono text-hud-muted mt-0.5">
            {top3[0]?.description || 'Aerospace classification profile matching.'}
          </p>
        </div>
        <div className="text-right sm:border-l sm:border-hud-border sm:pl-4">
          <div className="font-mono text-2xl font-bold text-cyan-400">
            {(confidence * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] font-mono text-hud-dim">CALIBRATED SCORE</span>
        </div>
      </div>

      {/* Low Confidence Warning Note (Specification 25) */}
      {confidence < 0.60 && (
        <div className="p-3 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>LOW CONFIDENCE:</strong> The model is uncertain about this prediction. Try a clearer image.
          </span>
        </div>
      )}

      {/* Ranked Prediction Bars */}
      <div className="space-y-3 pt-1">
        {top3.map((pred, idx) => {
          const width = animatedWidths[idx] || 0;
          return (
            <div key={pred.rank} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">0{pred.rank}</span>
                  <span className="text-white font-medium">{pred.class_name}</span>
                </span>
                <span className="text-cyan-300 font-bold">
                  {pred.percentage.toFixed(1)}%
                </span>
              </div>

              {/* Meter Bar */}
              <div className="w-full h-2 rounded bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-700 ease-out rounded ${
                    idx === 0
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                      : idx === 1
                      ? 'bg-gradient-to-r from-lime-600 to-lime-400'
                      : 'bg-gradient-to-r from-slate-600 to-slate-400'
                  }`}
                  style={{ width: `${width}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Note */}
      <div className="text-[10px] font-mono text-hud-dim pt-1 border-t border-hud-border/40 flex items-center justify-between">
        <span>TEMPERATURE SCALING: T=1.12</span>
        <span>SOFTMAX NORMALIZED</span>
      </div>
    </div>
  );
};
