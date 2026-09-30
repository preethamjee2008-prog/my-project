/**
 * ASTRA VISION About & Technical Documentation
 * Built by Preetham Alawandimath
 */

import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Code2,
  FileText,
  User,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-hud-border pb-4 space-y-2">
        <h2 className="font-mono text-3xl font-bold tracking-wider text-white">
          ASTRA VISION
        </h2>
        <p className="font-mono text-sm text-cyan-400 font-semibold tracking-wide">
          AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
        </p>
        <p className="text-xs font-mono text-hud-muted">
          AI-powered academic computer-vision research project engineered for high-precision 
          aircraft detection, multi-class classification, and transparent model explainability.
        </p>
      </div>

      {/* Creator Attribution Section (Specification 30 & 31) */}
      <section className="hud-box p-6 rounded-lg bg-gradient-to-r from-slate-900 to-hud-card border-cyan-500/30 space-y-4">
        <div className="flex items-center space-x-3 text-cyan-400">
          <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-hud-dim uppercase">
              CREATOR & LEAD ARCHITECT
            </span>
            <h3 className="font-mono text-lg font-bold text-white tracking-wider">
              PREETHAM ALAWANDIMATH
            </h3>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-300 leading-relaxed">
          Designed & Developed by <strong className="text-cyan-400">Preetham Alawandimath</strong> as an 
          end-to-end computer-vision research platform uniting cutting-edge deep learning 
          architectures with responsive aerospace command-center user experience.
        </p>
      </section>

      {/* Technology Stack Grid (Specification 30) */}
      <section className="space-y-4">
        <h3 className="font-mono text-sm font-bold tracking-wider text-white flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>CORE TECHNOLOGY STACK</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="hud-box p-4 rounded bg-slate-900/60 border-hud-border space-y-2">
            <div className="text-cyan-400 font-bold">COMPUTER VISION & DETECTION</div>
            <p className="text-hud-muted text-[11px] leading-relaxed">
              <strong>YOLO Architecture:</strong> Modern anchor-free spatial object detection 
              adapter capable of proposal generation, bounding box extraction, and multi-object 
              clustering across diverse aerial aspect ratios.
            </p>
          </div>

          <div className="hud-box p-4 rounded bg-slate-900/60 border-hud-border space-y-2">
            <div className="text-cyan-400 font-bold">CLASSIFICATION NETWORK</div>
            <p className="text-hud-muted text-[11px] leading-relaxed">
              <strong>ResNeSt-50:</strong> Split-Attention deep convolutional neural network 
              combining channel-wise attention across split feature groups for fine-grained 
              aerospace discrimination.
            </p>
          </div>

          <div className="hud-box p-4 rounded bg-slate-900/60 border-hud-border space-y-2">
            <div className="text-lime-400 font-bold">MODEL EXPLAINABILITY</div>
            <p className="text-hud-muted text-[11px] leading-relaxed">
              <strong>Grad-CAM:</strong> Gradient-weighted Class Activation Mapping computes 
              gradients of the score for target class w.r.t final convolutional layer 
              features, generating honest spatial attribution overlays.
            </p>
          </div>

          <div className="hud-box p-4 rounded bg-slate-900/60 border-hud-border space-y-2">
            <div className="text-lime-400 font-bold">FULL-STACK FRAMEWORKS</div>
            <p className="text-hud-muted text-[11px] leading-relaxed">
              <strong>FastAPI & React 18:</strong> Strongly-typed asynchronous Python REST API 
              with Pydantic v2 validation paired with a high-performance TypeScript + Vite + 
              Tailwind CSS client application.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Scope & Ethical Standards (Specification 46) */}
      <section className="hud-box p-6 rounded-lg bg-slate-950/80 border-hud-border space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>ACADEMIC SCOPE & ETHICAL SAFETY NOTICE</span>
        </div>
        <p className="text-xs font-mono text-hud-muted leading-relaxed">
          This system is an academic computer-vision research project intended solely for image 
          analysis, airframe type classification, and explainable AI evaluation. It does NOT 
          incorporate weapon targeting, weapon control, automated attack mechanisms, person 
          identification, facial recognition, surveillance of individuals, or autonomous military 
          decision-making.
        </p>
      </section>

      {/* Third-Party Attribution & Licenses (Specification 31) */}
      <section className="space-y-3 font-mono text-xs">
        <h3 className="font-mono text-sm font-bold tracking-wider text-white flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>OPEN SOURCE ATTRIBUTION & CITATIONS</span>
        </h3>
        <div className="p-4 rounded bg-slate-900/40 border border-hud-border text-[11px] text-hud-dim space-y-2">
          <p>
            &bull; <strong>ResNeSt:</strong> Zhang et al., <em>ResNeSt: Split-Attention Networks</em>, arXiv:2004.08955.
          </p>
          <p>
            &bull; <strong>Grad-CAM:</strong> Selvaraju et al., <em>Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization</em>, ICCV 2017.
          </p>
          <p>
            &bull; <strong>FGVC-Aircraft Benchmark:</strong> Maji et al., <em>Fine-Grained Visual Classification of Aircraft</em>, arXiv:1306.5151.
          </p>
          <p>
            &bull; <strong>PyTorch, FastAPI, React, Vite, Tailwind CSS:</strong> Subject to their respective MIT and Apache 2.0 open-source licenses.
          </p>
        </div>
      </section>
    </div>
  );
};
