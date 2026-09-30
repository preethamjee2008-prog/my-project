/**
 * ASTRA VISION TypeScript Interfaces
 * Built by Preetham Alawandimath
 */

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  box_pixels?: number[];
}

export interface Top3Prediction {
  rank: number;
  class_name: string;
  confidence: number;
  percentage: number;
  description?: string;
}

export interface GradCamResponse {
  available: boolean;
  heatmap_base64?: string | null;
  overlay_base64?: string | null;
  target_class: string;
  target_class_idx: number;
  explanation: string;
  status_message?: string | null;
}

export interface ModelInfo {
  detector_architecture: string;
  classifier_architecture: string;
  inference_mode: string;
  confidence_threshold: number;
  iou_threshold: number;
  device: string;
  explainability_status: string;
  is_demo: boolean;
}

export interface TimingProfile {
  validation_ms: number;
  preprocessing_ms: number;
  detection_ms: number;
  classification_ms: number;
  gradcam_ms: number;
  total_ms: number;
}

export interface AnalyzeResponse {
  success: boolean;
  processing_status: 'completed' | 'no_detection' | 'failed';
  is_demo: boolean;
  demo_badge?: string | null;
  message: string;
  primary_prediction?: string | null;
  confidence?: number | null;
  confidence_tier?: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE' | 'NONE' | string | null;
  top3: Top3Prediction[];
  detections: BoundingBox[];
  gradcam?: GradCamResponse | null;
  model: ModelInfo;
  timing: TimingProfile;
  image_metadata?: {
    width?: number;
    height?: number;
    filename?: string;
    detection_count?: number;
  };
}

export interface HealthResponse {
  status: string;
  app_name: string;
  tagline: string;
  creator: string;
  version: string;
  inference_mode: string;
  is_demo: boolean;
  timestamp: string;
}

export interface PerClassMetric {
  class_name: string;
  test_samples: number;
  precision: number;
  recall: number;
  f1_score: number;
  top3_accuracy: number;
  sample_aircraft: string;
}

export interface OverallMetrics {
  accuracy: number;
  top3_accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  detector_map50: number;
  detector_map50_95: number;
  detector_precision: number;
  detector_recall: number;
  mean_inference_time_ms: number;
  detector_time_ms: number;
  classifier_time_ms: number;
  gradcam_time_ms: number;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][];
}

export interface BenchmarkMetadata {
  title: string;
  dataset: string;
  evaluation_date: string;
  test_samples: number;
  hardware: string;
  lead_evaluator: string;
}

export interface EvaluationResponse {
  benchmark_metadata: BenchmarkMetadata;
  overall_metrics: OverallMetrics;
  classes: string[];
  per_class_metrics: PerClassMetric[];
  confusion_matrix: ConfusionMatrixData;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  primary_prediction: string;
  confidence: number;
  confidence_tier: string;
  detection_count: number;
  is_demo: boolean;
  thumbnail_base64: string;
  inference_time_ms: number;
}

export type NavTab = 'dashboard' | 'analyze' | 'evaluation' | 'history' | 'about';
