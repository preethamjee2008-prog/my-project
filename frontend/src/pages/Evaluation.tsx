/**
 * ASTRA VISION Academic Model Evaluation & Benchmarking
 * Built by Preetham Alawandimath
 */

import React, { useEffect, useState } from 'react';
import { EvaluationResponse } from '../types';
import { getEvaluationMetrics } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import {
  BarChart2,
  CheckCircle,
  Database,
  Cpu,
  Layers,
  Table,
  HelpCircle,
} from 'lucide-react';

export const Evaluation: React.FC = () => {
  const [evalData, setEvalData] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluationMetrics()
      .then((data) => {
        setEvalData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching evaluation data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !evalData) {
    return (
      <div className="hud-box p-12 text-center rounded-lg font-mono text-cyan-400 animate-pulse">
        LOADING VERIFIED BENCHMARK TELEMETRY...
      </div>
    );
  }

  const { benchmark_metadata, overall_metrics, per_class_metrics, confusion_matrix } = evalData;

  // Max value in confusion matrix for proportional heatmap intensity
  const maxMatrixVal = Math.max(...confusion_matrix.matrix.flat());

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
      {/* Header & Academic Benchmark Citation */}
      <div className="border-b border-hud-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold tracking-wider text-white flex items-center space-x-2">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <span>MODEL EVALUATION</span>
          </h2>
          <p className="font-mono text-xs text-hud-muted mt-1">
            Empirical Validation Metrics &bull; Test Set: {benchmark_metadata.test_samples} Samples &bull; Evaluator: {benchmark_metadata.lead_evaluator}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-hud-muted">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-hud-border flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>{benchmark_metadata.dataset}</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-hud-border flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            <span>{benchmark_metadata.hardware}</span>
          </span>
        </div>
      </div>

      {/* 8 Primary Measured Metric Cards (Specification 8 & 28) */}
      <section className="space-y-4">
        <h3 className="font-mono text-sm font-bold tracking-wider text-white">
          CORE PERFORMANCE INDICATORS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="ACCURACY"
            value={`${(overall_metrics.accuracy * 100).toFixed(1)}%`}
            subtext="Primary classification accuracy"
            variant="cyan"
            badge="MEASURED"
          />
          <MetricCard
            label="PRECISION"
            value={`${(overall_metrics.precision * 100).toFixed(1)}%`}
            subtext="Macro-averaged precision"
            variant="cyan"
            badge="MACRO"
          />
          <MetricCard
            label="RECALL"
            value={`${(overall_metrics.recall * 100).toFixed(1)}%`}
            subtext="Macro-averaged true positive rate"
            variant="emerald"
            badge="MACRO"
          />
          <MetricCard
            label="F1 SCORE"
            value={`${(overall_metrics.f1_score * 100).toFixed(1)}%`}
            subtext="Harmonic mean of precision & recall"
            variant="emerald"
            badge="BALANCED"
          />

          <MetricCard
            label="TOP-3 ACCURACY"
            value={`${(overall_metrics.top3_accuracy * 100).toFixed(1)}%`}
            subtext="Target in top 3 ranked proposals"
            variant="lime"
            badge="RECALL@3"
          />
          <MetricCard
            label="mAP @ 50"
            value={`${(overall_metrics.detector_map50 * 100).toFixed(1)}%`}
            subtext="YOLO detector mean average precision"
            variant="lime"
            badge="IOU 0.50"
          />
          <MetricCard
            label="mAP @ 50-95"
            value={`${(overall_metrics.detector_map50_95 * 100).toFixed(1)}%`}
            subtext="Stringent multi-threshold precision"
            variant="amber"
            badge="COCO METRIC"
          />
          <MetricCard
            label="INFERENCE TIME"
            value={`${overall_metrics.mean_inference_time_ms} ms`}
            subtext={`Det: ${overall_metrics.detector_time_ms}ms • Cls: ${overall_metrics.classifier_time_ms}ms`}
            variant="cyan"
            badge="END-TO-END"
          />
        </div>
      </section>

      {/* CONFUSION MATRIX (Specification 28) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-2">
          <div>
            <h3 className="font-mono text-base font-bold tracking-wider text-white">
              CONFUSION MATRIX
            </h3>
            <p className="font-mono text-xs text-hud-muted">
              Actual vs Predicted class distribution across test set images
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            TOTAL SAMPLES: {benchmark_metadata.test_samples}
          </span>
        </div>

        <div className="hud-box p-4 rounded-lg bg-slate-900/60 overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Table Matrix */}
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-hud-dim font-normal border-b border-r border-hud-border">
                    ACTUAL \ PRED
                  </th>
                  {confusion_matrix.labels.map((lbl) => (
                    <th key={lbl} className="p-2 text-cyan-300 font-semibold border-b border-hud-border">
                      {lbl}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {confusion_matrix.matrix.map((row, rowIdx) => {
                  const actualLabel = confusion_matrix.labels[rowIdx];
                  return (
                    <tr key={actualLabel}>
                      <td className="p-2 text-left text-white font-medium border-r border-hud-border">
                        {actualLabel}
                      </td>
                      {row.map((val, colIdx) => {
                        const isDiagonal = rowIdx === colIdx;
                        const intensity = val / maxMatrixVal;
                        return (
                          <td
                            key={colIdx}
                            className={`p-2 transition-colors ${
                              isDiagonal
                                ? 'text-black font-bold'
                                : val > 0
                                ? 'text-slate-300'
                                : 'text-slate-700'
                            }`}
                            style={{
                              backgroundColor: isDiagonal
                                ? `rgba(6, 182, 212, ${Math.max(0.4, intensity)})`
                                : val > 0
                                ? `rgba(239, 68, 68, ${Math.min(0.6, (val / 20) * 0.5)})`
                                : 'transparent',
                            }}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center justify-between text-[10px] font-mono text-hud-dim pt-3">
              <span>DIAGONAL (CYAN): CORRECT PREDICTIONS</span>
              <span>OFF-DIAGONAL (RED TINT): MISCLASSIFICATIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* PER-CLASS PERFORMANCE TABLE (Specification 28) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-2">
          <h3 className="font-mono text-base font-bold tracking-wider text-white">
            PER-CLASS PERFORMANCE
          </h3>
          <span className="font-mono text-xs text-hud-dim">7 DISCRIMINATED CATEGORIES</span>
        </div>

        <div className="hud-box rounded-lg overflow-x-auto bg-slate-900/60">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-hud-border bg-slate-950/80 text-hud-muted">
                <th className="p-3">CLASS NAME</th>
                <th className="p-3 text-right">SAMPLES</th>
                <th className="p-3 text-right">PRECISION</th>
                <th className="p-3 text-right">RECALL</th>
                <th className="p-3 text-right">F1 SCORE</th>
                <th className="p-3 text-right">TOP-3 ACC</th>
                <th className="p-3">REPRESENTATIVE PLATFORMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hud-border/40">
              {per_class_metrics.map((row) => (
                <tr key={row.class_name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-white font-semibold">{row.class_name}</td>
                  <td className="p-3 text-right text-slate-300">{row.test_samples}</td>
                  <td className="p-3 text-right text-cyan-400 font-bold">
                    {(row.precision * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-bold">
                    {(row.recall * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-right text-lime-400 font-bold">
                    {(row.f1_score * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-right text-white font-bold">
                    {(row.top3_accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-hud-dim text-[11px] truncate max-w-xs">
                    {row.sample_aircraft}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
