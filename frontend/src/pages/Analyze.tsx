/**
 * ASTRA VISION Analyze View & Core AI Inference Workflow
 * Built by Preetham Alawandimath
 */

import React, { useState, useRef } from 'react';
import {
  AnalyzeResponse,
  BoundingBox,
  HistoryItem,
} from '../types';
import { analyzeImage } from '../services/api';
import { saveHistoryItem } from '../services/history';
import { ImageUploader } from '../components/ImageUploader';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { DetectionCanvas } from '../components/DetectionCanvas';
import { Top3Rankings } from '../components/Top3Rankings';
import { GradCamViewer } from '../components/GradCamViewer';
import {
  Crosshair,
  AlertOctagon,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle,
} from 'lucide-react';

interface AnalyzePageProps {
  isDemo?: boolean;
}

export const Analyze: React.FC<AnalyzePageProps> = ({ isDemo = true }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Specification 15: resultsRef for automatic smooth scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleImageSelected = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setAnalysisResult(null);
    setSelectedBox(null);
    setErrorMessage(null);
    setIsCompleted(false);
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setIsCompleted(false);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      // Real API request to backend (with graceful demo fallback if offline)
      const response = await analyzeImage(selectedFile);

      if (!response.success && response.processing_status === 'failed') {
        setIsProcessing(false);
        setIsCompleted(false);
        setErrorMessage(response.message || 'Image processing failed.');
        return;
      }

      // Successful API response received!
      setAnalysisResult(response);
      if (response.detections.length > 0) {
        setSelectedBox(response.detections[0]);
      }

      // Save lightweight entry into local history
      if (response.primary_prediction) {
        const historyEntry: HistoryItem = {
          id: 'hist-' + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleString(),
          filename: selectedFile.name,
          primary_prediction: response.primary_prediction,
          confidence: response.confidence || 0.0,
          confidence_tier: response.confidence_tier || 'UNKNOWN',
          detection_count: response.detections.length,
          is_demo: response.is_demo,
          thumbnail_base64: previewUrl || '',
          inference_time_ms: response.timing.total_ms,
        };
        saveHistoryItem(historyEntry);
      }

      // Trigger Processing Completed state
      setIsProcessing(false);
      setIsCompleted(true);
    } catch (err: any) {
      setIsProcessing(false);
      setIsCompleted(false);
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
    }
  };

  // Specification 15: Scroll only after real results exist
  const triggerAutoScroll = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setSelectedBox(null);
    setIsProcessing(false);
    setIsCompleted(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hud-border pb-4">
        <div>
          <h2 className="font-mono text-2xl font-bold tracking-wider text-white flex items-center space-x-2">
            <Crosshair className="w-6 h-6 text-cyan-400" />
            <span>AI INFERENCE CONSOLE</span>
          </h2>
          <p className="font-mono text-xs text-hud-muted mt-1">
            YOLO Object Detection &bull; ResNeSt-50 Classification &bull; Grad-CAM Explainability
          </p>
        </div>

        {/* Demo Mode Badge */}
        {isDemo && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>DEMO MODE:</strong> External weights unconfigured. Using verified benchmark telemetry.
            </span>
          </div>
        )}
      </div>

      {/* STEP 1: Image Upload & Validation */}
      <div className="space-y-4">
        <ImageUploader
          onImageSelected={handleImageSelected}
          disabled={isProcessing}
        />

        {/* Action Trigger Button */}
        {selectedFile && !isProcessing && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-hud-muted">
              <span>READY FOR PIPELINE INGESTION:</span>
              <span className="text-white font-semibold">{selectedFile.name}</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-hud-muted hover:text-white border border-hud-border font-mono text-xs tracking-wider uppercase transition-colors"
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={handleStartAnalysis}
                className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-widest uppercase flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)]"
              >
                <Crosshair className="w-4 h-4" />
                <span>ANALYZE IMAGE</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error state alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-mono flex items-center space-x-3 animate-fade-in">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <div className="font-bold">INFERENCE PIPELINE ERROR</div>
            <div className="text-red-300 mt-0.5">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* STEP 2: Processing Overlay with 6 Stages & Completion Banner (Specifications 13 & 14) */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        isCompleted={isCompleted}
        onScrollTrigger={triggerAutoScroll}
      />

      {/* STEP 3: Results Section (Specifications 15, 16, 22, 23, 24, 26, 27) */}
      <div ref={resultsRef} className="scroll-mt-20">
        {analysisResult && (
          <div className="space-y-8 animate-fade-in pt-4">
            {/* Results Header (Specification 16) */}
            <div className="hud-box p-4 rounded-lg bg-slate-900/80 border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                  ANALYSIS RESULTS
                </span>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">
                  AI VISION INFERENCE COMPLETE
                </h3>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                {analysisResult.is_demo && (
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    DEMO RESULT
                  </span>
                )}
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-950 border border-hud-border text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>TOTAL LATENCY: {analysisResult.timing.total_ms} ms</span>
                </div>
              </div>
            </div>

            {/* Case A: NO OBJECT DETECTED (Specification 26) */}
            {analysisResult.processing_status === 'no_detection' ? (
              <div className="hud-box p-12 rounded-lg text-center space-y-4 border-amber-500/40 bg-amber-950/20">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <h4 className="font-mono text-xl font-bold text-white tracking-wide">
                  NO OBJECT DETECTED
                </h4>
                <p className="font-mono text-xs text-hud-muted max-w-md mx-auto leading-relaxed">
                  No supported aircraft or aerial object was detected in this image. 
                  YOLO spatial scan returned zero bounding proposals above the 0.45 confidence threshold.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow"
                  >
                    TRY ANOTHER IMAGE
                  </button>
                </div>
              </div>
            ) : (
              /* Case B: OBJECTS DETECTED — Full Visualizer */
              <div className="space-y-8">
                {/* Visualizer Grid: Detection Canvas on Left, Top-3 & Grad-CAM on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column (7 cols): Detection Viewport */}
                  <div className="lg:col-span-7 space-y-6">
                    <DetectionCanvas
                      imageUrl={previewUrl || ''}
                      detections={analysisResult.detections}
                      selectedDetectionId={selectedBox?.id}
                      onSelectDetection={(box) => setSelectedBox(box)}
                      isDemo={analysisResult.is_demo}
                    />

                    {/* Telemetry Profile */}
                    <div className="hud-box p-4 rounded-lg bg-hud-surface/80 space-y-3">
                      <div className="flex items-center justify-between border-b border-hud-border pb-2 text-xs font-mono">
                        <span className="text-white font-semibold flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>PIPELINE TIMING BREAKDOWN</span>
                        </span>
                        <span className="text-cyan-400 font-bold">
                          {analysisResult.timing.total_ms} ms
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-hud-dim">VALIDATION</div>
                          <div className="text-xs font-bold text-slate-300">
                            {analysisResult.timing.validation_ms} ms
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-hud-dim">PREPROCESSING</div>
                          <div className="text-xs font-bold text-slate-300">
                            {analysisResult.timing.preprocessing_ms} ms
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-hud-dim">YOLO DETECT</div>
                          <div className="text-xs font-bold text-cyan-400">
                            {analysisResult.timing.detection_ms} ms
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-hud-dim">RESNEST CLS</div>
                          <div className="text-xs font-bold text-cyan-400">
                            {analysisResult.timing.classification_ms} ms
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-hud-dim">GRAD-CAM</div>
                          <div className="text-xs font-bold text-lime-400">
                            {analysisResult.timing.gradcam_ms} ms
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Classification Top-3 & Grad-CAM */}
                  <div className="lg:col-span-5 space-y-6">
                    <Top3Rankings
                      primaryClass={selectedBox?.label || analysisResult.primary_prediction || 'Aircraft'}
                      confidence={selectedBox?.confidence || analysisResult.confidence || 0.0}
                      confidenceTier={analysisResult.confidence_tier || 'HIGH CONFIDENCE'}
                      top3={analysisResult.top3}
                      isDemo={analysisResult.is_demo}
                    />

                    <GradCamViewer
                      originalImageUrl={previewUrl || ''}
                      gradcam={analysisResult.gradcam}
                      targetClass={selectedBox?.label || analysisResult.primary_prediction || 'Fighter Aircraft'}
                      isDemo={analysisResult.is_demo}
                    />
                  </div>
                </div>

                {/* Model & Architecture Specifications Footer */}
                <div className="hud-box p-4 rounded-lg bg-slate-900/60 border-hud-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-hud-muted">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>DETECTOR: <strong className="text-white">{analysisResult.model.detector_architecture}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-lime-400" />
                    <span>CLASSIFIER: <strong className="text-white">{analysisResult.model.classifier_architecture}</strong></span>
                  </div>
                  <div>
                    <span>MODE: <strong className="text-cyan-300">{analysisResult.model.inference_mode}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
