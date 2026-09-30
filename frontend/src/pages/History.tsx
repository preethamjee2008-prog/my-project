/**
 * ASTRA VISION Analysis History & Test Audit Logs
 * Built by Preetham Alawandimath
 */

import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import {
  loadHistoryItems,
  removeHistoryItem,
  clearHistoryStorage,
} from '../services/history';
import {
  Clock,
  Search,
  Filter,
  Trash2,
  AlertCircle,
  FileImage,
  ArrowUpDown,
  CheckCircle,
} from 'lucide-react';

const CLASSES = [
  'ALL',
  'Fighter Aircraft',
  'Military Transport',
  'Attack Helicopter',
  'Stealth Bomber',
  'Surveillance UAV',
  'Commercial Airliner',
  'Trainer Aircraft',
];

export const History: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence'>('newest');

  useEffect(() => {
    setItems(loadHistoryItems());
  }, []);

  const handleDelete = (id: string) => {
    const updated = removeHistoryItem(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all analysis history records?')) {
      clearHistoryStorage();
      setItems([]);
    }
  };

  // Filter & Sort
  const filtered = items.filter((item) => {
    const matchSearch =
      item.primary_prediction.toLowerCase().includes(search.toLowerCase()) ||
      item.filename.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'ALL' || item.primary_prediction === filterClass;
    return matchSearch && matchClass;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'confidence') return b.confidence - a.confidence;
    if (sortBy === 'oldest') return a.timestamp.localeCompare(b.timestamp);
    return b.timestamp.localeCompare(a.timestamp);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-hud-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold tracking-wider text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span>ANALYSIS AUDIT HISTORY</span>
          </h2>
          <p className="font-mono text-xs text-hud-muted mt-1">
            Local lightweight inspection log &bull; {items.length} Records Stored
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR ALL</span>
          </button>
        )}
      </div>

      {/* Search, Filter, and Sort Controls (Specification 29) */}
      <div className="hud-box p-4 rounded-lg bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-hud-dim absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search airframe or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-hud-border rounded text-xs font-mono text-white placeholder-hud-dim focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter by Category */}
        <div className="relative">
          <Filter className="w-4 h-4 text-hud-dim absolute left-3 top-3 pointer-events-none" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-hud-border rounded text-xs font-mono text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                CLASS: {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-hud-dim absolute left-3 top-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-hud-border rounded text-xs font-mono text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
          >
            <option value="newest">SORT: NEWEST FIRST</option>
            <option value="oldest">SORT: OLDEST FIRST</option>
            <option value="confidence">SORT: HIGHEST CONFIDENCE</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="hud-box p-12 text-center rounded-lg space-y-3 bg-hud-card/40 border-hud-border/50">
          <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-hud-border flex items-center justify-center mx-auto text-hud-dim">
            <FileImage className="w-6 h-6" />
          </div>
          <p className="font-mono text-sm text-hud-muted">
            {items.length === 0
              ? 'No analysis history recorded yet. Run an analysis on the Analyze tab to generate log entries.'
              : 'No historical records matching the active search/filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="hud-box p-4 rounded-lg bg-slate-900/60 border-hud-border hover:border-cyan-500/40 transition-all flex items-start gap-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded bg-slate-950 border border-hud-border shrink-0 overflow-hidden flex items-center justify-center">
                {entry.thumbnail_base64 ? (
                  <img
                    src={entry.thumbnail_base64}
                    alt={entry.primary_prediction}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileImage className="w-8 h-8 text-hud-dim" />
                )}
              </div>

              {/* Metadata */}
              <div className="flex-1 min-w-0 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm truncate">
                    {entry.primary_prediction}
                  </h4>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 rounded text-hud-dim hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">
                    {(entry.confidence * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {entry.confidence_tier}
                  </span>
                  {entry.is_demo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      DEMO
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-hud-muted truncate">
                  FILE: {entry.filename}
                </div>

                <div className="flex items-center justify-between text-[10px] text-hud-dim pt-1 border-t border-hud-border/40">
                  <span>{entry.timestamp}</span>
                  <span>LATENCY: {entry.inference_time_ms} ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
