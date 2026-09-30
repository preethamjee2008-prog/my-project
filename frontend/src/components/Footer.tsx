/**
 * ASTRA VISION Minimal Footer
 * Built by Preetham Alawandimath
 */

import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-hud-border bg-hud-bg/80 backdrop-blur-md mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Core Attribution */}
        <div>
          <h3 className="font-mono text-sm tracking-widest font-bold text-white">
            ASTRA VISION
          </h3>
          <p className="font-mono text-xs tracking-wider text-hud-muted mt-1">
            AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
          </p>
          <p className="font-mono text-xs text-cyan-400 font-medium mt-1">
            Built by Preetham Alawandimath
          </p>
        </div>

        {/* Technical Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-hud-dim pt-2">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>YOLO + ResNeSt50</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Grad-CAM Explainability</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Code2 className="w-3.5 h-3.5 text-lime-500" />
            <span>FastAPI & React 18</span>
          </span>
        </div>

        <div className="pt-2 text-[10px] font-mono text-slate-600">
          Source package budget compliant (&lt;50 MB) • Academic Computer Vision Research
        </div>
      </div>
    </footer>
  );
};
