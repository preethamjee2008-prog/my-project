/**
 * ASTRA VISION Aerospace HUD Navigation
 * Built by Preetham Alawandimath
 */

import React, { useState } from 'react';
import { NavTab } from '../types';
import { Crosshair, Menu, X, Shield, Activity, BarChart2, Clock, Info, Disc } from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  systemStatus: string;
  inferenceMode: string;
  isDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  systemStatus,
  inferenceMode,
  isDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'analyze', label: 'Analyze', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'evaluation', label: 'Evaluation', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-hud-bg/90 backdrop-blur-md border-b border-hud-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded bg-cyan-950/60 border border-cyan-500/40 group-hover:border-cyan-400 transition-colors">
              <Disc className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-lg font-bold tracking-widest text-white group-hover:text-cyan-300 transition-colors">
                  ASTRA<span className="text-cyan-400">VISION</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-hud-muted hidden sm:block">
                AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-hud-muted hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Status Badge */}
          <div className="hidden md:flex items-center space-x-3">
            {isDemo && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>DEMO MODE</span>
              </span>
            )}
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-slate-900/80 border border-hud-border text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 tracking-wider font-semibold">● SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-hud-muted hover:text-white hover:bg-slate-800 border border-hud-border"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-hud-surface/95 border-b border-hud-border px-4 pt-2 pb-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center justify-between py-2 border-b border-hud-border/50">
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>● SYSTEM ONLINE</span>
            </span>
            {isDemo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                DEMO MODE
              </span>
            )}
          </div>
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-sm font-mono tracking-wider transition-colors ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-hud-muted hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
