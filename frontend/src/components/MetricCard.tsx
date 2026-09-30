/**
 * ASTRA VISION Aerospace HUD Metric Card
 * Built by Preetham Alawandimath
 */

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  variant?: 'cyan' | 'emerald' | 'amber' | 'lime';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  variant = 'cyan',
  icon,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'emerald':
        return {
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
        };
      case 'lime':
        return {
          text: 'text-lime-400',
          border: 'border-lime-500/30',
          badge: 'bg-lime-950/60 text-lime-300 border-lime-500/40',
        };
      case 'amber':
        return {
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
        };
      default:
        return {
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`hud-box p-4 rounded-lg bg-hud-card/60 ${colors.border} flex flex-col justify-between space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider text-hud-muted uppercase">
          {label}
        </span>
        {icon && <span className={colors.text}>{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between">
        <span className={`font-mono text-2xl font-bold tracking-tight ${colors.text}`}>
          {value}
        </span>
        {badge && (
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${colors.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[10px] font-mono text-hud-dim truncate">
          {subtext}
        </p>
      )}
    </div>
  );
};
