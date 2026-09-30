/**
 * ASTRA VISION Command Center Dashboard
 * Built by Preetham Alawandimath
 */

import React from 'react';
import { NavTab, ModelInfo, HealthResponse } from '../types';
import { MetricCard } from '../components/MetricCard';
import {
  Crosshair,
  Shield,
  Layers,
  Activity,
  ArrowRight,
  Cpu,
  BarChart3,
  Radar,
  Radio,
  Clock,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  health: HealthResponse | null;
  modelInfo: ModelInfo | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  health,
  modelInfo,
}) => {
  const isDemo = health?.is_demo ?? true;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section (Specification 18) */}
      <section className="relative py-12 px-6 sm:px-12 rounded-xl hud-box overflow-hidden border-cyan-500/40 bg-gradient-to-b from-slate-900/80 to-hud-card/90">
        {/* Subtle CSS/SVG aerospace grid & radar scan */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-8 rounded-full border border-cyan-400/30"></div>
          <div className="absolute inset-20 rounded-full border border-cyan-300/20"></div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AEROSPACE COMPUTER-VISION COMMAND CENTER</span>
            <span>•</span>
            <span className="text-emerald-400">STATUS: ONLINE</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              ASTRA <span className="text-cyan-400">VISION</span>
            </h1>
            <p className="font-mono text-lg sm:text-xl text-slate-300 font-semibold tracking-wider">
              AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
            </p>
            <p className="text-sm font-mono text-cyan-300/90 tracking-widest pt-1">
              Detect. Classify. Explain.
            </p>
          </div>

          <p className="text-sm sm:text-base text-hud-muted max-w-2xl leading-relaxed">
            High-precision aerial intelligence fusing YOLO-compatible spatial detection, 
            ResNeSt-50 split-attention deep classification, and authentic Grad-CAM visual 
            attribution into a unified aerospace command dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-sm tracking-wider uppercase flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6)]"
            >
              <Crosshair className="w-4 h-4" />
              <span>ANALYZE IMAGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('evaluation')}
              className="px-6 py-3 rounded bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-sm tracking-wider uppercase flex items-center space-x-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE SYSTEM</span>
            </button>
          </div>

          {/* Creator Attribution */}
          <div className="pt-2 text-xs font-mono text-hud-dim">
            Architected & Built by <span className="text-cyan-400 font-semibold">Preetham Alawandimath</span>
          </div>
        </div>
      </section>

      {/* VISION COMMAND CENTER Telemetry Grid (Specification 20) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="font-mono text-lg font-bold tracking-wider text-white">
              VISION COMMAND CENTER
            </h2>
          </div>
          <span className="font-mono text-xs text-hud-dim">REAL-TIME SUBSYSTEM STATUS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="DETECTOR"
            value="ONLINE"
            subtext={modelInfo?.detector_architecture || 'YOLOv8 Vision Adapter'}
            badge="ACTIVE"
            variant="emerald"
            icon={<Radar className="w-5 h-5" />}
          />
          <MetricCard
            label="CLASSIFIER"
            value="READY"
            subtext={modelInfo?.classifier_architecture || 'ResNeSt-50 Split-Attention'}
            badge="7 CLASSES"
            variant="cyan"
            icon={<Cpu className="w-5 h-5" />}
          />
          <MetricCard
            label="EXPLAINABILITY"
            value="AVAILABLE"
            subtext="Grad-CAM Layer4 Gradient Synthesis"
            badge="GRAD-CAM"
            variant="lime"
            icon={<Layers className="w-5 h-5" />}
          />
          <MetricCard
            label="SYSTEM"
            value="READY"
            subtext={health?.inference_mode || 'MODE C — DEMO MODE'}
            badge={isDemo ? 'DEMO MODE' : 'PRODUCTION'}
            variant={isDemo ? 'amber' : 'emerald'}
            icon={<Shield className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hud-box p-6 rounded-lg bg-hud-card/60 space-y-3">
          <div className="w-10 h-10 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-bold text-white tracking-wide">
            MODULAR DETECTION
          </h3>
          <p className="text-xs text-hud-muted leading-relaxed">
            Pluggable YOLO detection adapter with configurable thresholds, IOU suppression,
            and precise spatial localization of military and civil airframes.
          </p>
        </div>

        <div className="hud-box p-6 rounded-lg bg-hud-card/60 space-y-3">
          <div className="w-10 h-10 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-bold text-white tracking-wide">
            RESNEST-50 CLASSIFIER
          </h3>
          <p className="text-xs text-hud-muted leading-relaxed">
            Split-Attention deep convolutional backbone yielding calibrated probability 
            distributions across Fighter, Transport, Rotary, Stealth, and UAV categories.
          </p>
        </div>

        <div className="hud-box p-6 rounded-lg bg-hud-card/60 space-y-3">
          <div className="w-10 h-10 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-bold text-white tracking-wide">
            TRUE GRAD-CAM EXPLAINABILITY
          </h3>
          <p className="text-xs text-hud-muted leading-relaxed">
            Calculates gradient-weighted feature activations w.r.t the predicted class,
            delivering original, heatmap, and overlay visual attribution without fake telemetry.
          </p>
        </div>
      </section>
    </div>
  );
};
