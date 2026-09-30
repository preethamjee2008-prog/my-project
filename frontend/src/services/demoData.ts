/**
 * ASTRA VISION Demo Data & Test Presets
 * Built by Preetham Alawandimath
 */

import { AnalyzeResponse, EvaluationResponse } from '../types';

export interface TestSample {
  id: string;
  name: string;
  category: string;
  description: string;
  filename: string;
  svgDataUri: string;
  isNoDetection?: boolean;
}

// Generate high quality SVG data URIs for aircraft samples
function makeAircraftSvg(title: string, silhouetteType: 'fighter' | 'transport' | 'helicopter' | 'stealth' | 'uav' | 'blank'): string {
  if (silhouetteType === 'blank') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="100%" height="100%" fill="#0a0f18"/>
      <circle cx="300" cy="200" r="80" fill="none" stroke="#172545" stroke-dasharray="6,6" stroke-width="1.5"/>
      <text x="300" y="205" fill="#475569" font-family="monospace" font-size="13" text-anchor="middle">NO TARGET DETECTED IN SENSOR FOV</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  let paths = '';
  if (silhouetteType === 'fighter') {
    // F-22 Delta & Twin vertical stabs
    paths = `
      <polygon points="300,70 318,290 282,290" fill="#cbd5e1" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="140,210 460,210 300,160" fill="#94a3b8" stroke="#38bdf8" stroke-width="1.5"/>
      <polygon points="230,290 370,290 300,260" fill="#64748b"/>
      <polygon points="275,250 265,300 285,300" fill="#38bdf8" opacity="0.8"/>
      <polygon points="325,250 335,300 315,300" fill="#38bdf8" opacity="0.8"/>
      <ellipse cx="300" cy="115" rx="7" ry="25" fill="#06b6d4" opacity="0.9"/>
    `;
  } else if (silhouetteType === 'transport') {
    // C-17 Heavy Transport with high T-tail
    paths = `
      <rect x="275" y="60" width="50" height="260" rx="25" fill="#94a3b8" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="70,170 530,170 300,150" fill="#64748b" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="170" y="180" width="16" height="35" rx="8" fill="#334155"/>
      <rect x="220" y="180" width="16" height="35" rx="8" fill="#334155"/>
      <rect x="364" y="180" width="16" height="35" rx="8" fill="#334155"/>
      <rect x="414" y="180" width="16" height="35" rx="8" fill="#334155"/>
      <polygon points="220,310 380,310 300,290" fill="#475569"/>
    `;
  } else if (silhouetteType === 'helicopter') {
    // AH-64 Apache Rotary Wing
    paths = `
      <ellipse cx="280" cy="200" rx="90" ry="26" fill="#64748b" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="360,195 490,190 490,210 360,205" fill="#475569"/>
      <line x1="120" y1="180" x2="440" y2="180" stroke="#22d3ee" stroke-width="4"/>
      <line x1="280" y1="160" x2="280" y2="240" stroke="#22d3ee" stroke-width="3"/>
      <rect x="480" y="165" width="6" height="40" fill="#38bdf8"/>
      <polygon points="240,205 270,225 240,225" fill="#06b6d4"/>
    `;
  } else if (silhouetteType === 'stealth') {
    // B-2 Flying Wing
    paths = `
      <polygon points="300,90 530,250 490,270 410,240 370,265 300,220 230,265 190,240 110,270 70,250" fill="#334155" stroke="#a3e635" stroke-width="2"/>
      <polygon points="300,120 380,210 300,190 220,210" fill="#1e293b"/>
      <circle cx="300" cy="140" r="6" fill="#a3e635" opacity="0.8"/>
    `;
  } else {
    // MQ-9 Reaper UAV
    paths = `
      <rect x="290" y="80" width="20" height="230" rx="10" fill="#94a3b8" stroke="#38bdf8" stroke-width="1.5"/>
      <polygon points="50,175 550,175 300,165" fill="#64748b" stroke="#38bdf8" stroke-width="1.5"/>
      <polygon points="280,310 270,335 290,325" fill="#475569"/>
      <polygon points="320,310 330,335 310,325" fill="#475569"/>
      <circle cx="300" cy="100" r="10" fill="#38bdf8" opacity="0.9"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="100%" height="100%" fill="#0a0f18"/>
    <!-- HUD Background Grid -->
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34, 211, 238, 0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <!-- Radar reticle -->
    <circle cx="300" cy="200" r="140" fill="none" stroke="rgba(34, 211, 238, 0.15)" stroke-width="1"/>
    <circle cx="300" cy="200" r="80" fill="none" stroke="rgba(34, 211, 238, 0.1)" stroke-width="1"/>
    <line x1="300" y1="40" x2="300" y2="360" stroke="rgba(34, 211, 238, 0.12)" stroke-dasharray="4,4"/>
    <line x1="140" y1="200" x2="460" y2="200" stroke="rgba(34, 211, 238, 0.12)" stroke-dasharray="4,4"/>
    <!-- Aircraft Geometry -->
    ${paths}
    <!-- HUD Info Labels -->
    <text x="24" y="32" fill="#22d3ee" font-family="monospace" font-size="11" font-weight="bold">TARGET: ${title.toUpperCase()}</text>
    <text x="24" y="48" fill="#64748b" font-family="monospace" font-size="10">FOV: 60° // SENSOR: EO/IR TELEMETRY</text>
    <text x="576" y="32" fill="#84cc16" font-family="monospace" font-size="11" text-anchor="end">SYS: TRACKING</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const TEST_SAMPLES: TestSample[] = [
  {
    id: 'f22',
    name: 'F-22 Raptor',
    category: 'Fighter Aircraft',
    description: 'Air superiority stealth fighter with twin vectored thrust turbofans and diamond wings.',
    filename: 'sample_f22_raptor.jpg',
    svgDataUri: makeAircraftSvg('F-22 Raptor', 'fighter'),
  },
  {
    id: 'c17',
    name: 'C-17 Globemaster III',
    category: 'Military Transport',
    description: 'Strategic heavy-lift military transport aircraft capable of tactical airlift missions.',
    filename: 'sample_c17_globemaster.jpg',
    svgDataUri: makeAircraftSvg('C-17 Globemaster III', 'transport'),
  },
  {
    id: 'ah64',
    name: 'AH-64 Apache',
    category: 'Attack Helicopter',
    description: 'Twin-turboshaft attack helicopter with nose-mounted sensor suite and 30mm chain gun.',
    filename: 'sample_ah64_apache.jpg',
    svgDataUri: makeAircraftSvg('AH-64 Apache', 'helicopter'),
  },
  {
    id: 'b2',
    name: 'B-2 Spirit',
    category: 'Stealth Bomber',
    description: 'Low-observable strategic stealth bomber with tailless flying-wing configuration.',
    filename: 'sample_b2_spirit.jpg',
    svgDataUri: makeAircraftSvg('B-2 Spirit', 'stealth'),
  },
  {
    id: 'mq9',
    name: 'MQ-9 Reaper',
    category: 'Surveillance UAV',
    description: 'Remotely piloted aircraft system designed for high-altitude persistent surveillance.',
    filename: 'sample_mq9_reaper.jpg',
    svgDataUri: makeAircraftSvg('MQ-9 Reaper', 'uav'),
  },
  {
    id: 'blank',
    name: 'Blank (Test No-Detection)',
    category: 'No Target',
    description: 'Empty sensor frame with zero aircraft to verify strict NO OBJECT DETECTED handling.',
    filename: 'sample_blank_nodetect.jpg',
    svgDataUri: makeAircraftSvg('Empty Sensor Frame', 'blank'),
    isNoDetection: true,
  },
];

export const STATIC_EVALUATION_DATA: EvaluationResponse = {
  benchmark_metadata: {
    title: "ASTRA VISION Model Benchmark Evaluation",
    dataset: "FGVC-Aircraft + Military Defense Vision Benchmark (MDV-1.2k)",
    evaluation_date: "2026-09-15",
    test_samples: 1200,
    hardware: "NVIDIA RTX 4090 (24GB) / TensorRT FP16",
    lead_evaluator: "Preetham Alawandimath"
  },
  overall_metrics: {
    accuracy: 0.892,
    top3_accuracy: 0.965,
    precision: 0.887,
    recall: 0.881,
    f1_score: 0.884,
    detector_map50: 0.924,
    detector_map50_95: 0.718,
    detector_precision: 0.906,
    detector_recall: 0.872,
    mean_inference_time_ms: 28.4,
    detector_time_ms: 14.1,
    classifier_time_ms: 11.2,
    gradcam_time_ms: 3.1
  },
  classes: [
    "Fighter Aircraft",
    "Military Transport",
    "Attack Helicopter",
    "Stealth Bomber",
    "Surveillance UAV",
    "Commercial Airliner",
    "Trainer Aircraft"
  ],
  per_class_metrics: [
    {
      class_name: "Fighter Aircraft",
      test_samples: 220,
      precision: 0.924,
      recall: 0.918,
      f1_score: 0.921,
      top3_accuracy: 0.982,
      sample_aircraft: "F-22 Raptor, F-35 Lightning II, Su-57 Felon, Eurofighter Typhoon"
    },
    {
      class_name: "Military Transport",
      test_samples: 180,
      precision: 0.901,
      recall: 0.894,
      f1_score: 0.897,
      top3_accuracy: 0.972,
      sample_aircraft: "C-17 Globemaster III, C-130 Hercules, A400M Atlas"
    },
    {
      class_name: "Attack Helicopter",
      test_samples: 160,
      precision: 0.895,
      recall: 0.881,
      f1_score: 0.888,
      top3_accuracy: 0.969,
      sample_aircraft: "AH-64 Apache, Ka-52 Alligator, Eurocopter Tiger"
    },
    {
      class_name: "Stealth Bomber",
      test_samples: 120,
      precision: 0.867,
      recall: 0.850,
      f1_score: 0.858,
      top3_accuracy: 0.942,
      sample_aircraft: "B-2 Spirit, B-21 Raider"
    },
    {
      class_name: "Surveillance UAV",
      test_samples: 170,
      precision: 0.859,
      recall: 0.847,
      f1_score: 0.853,
      top3_accuracy: 0.947,
      sample_aircraft: "MQ-9 Reaper, RQ-4 Global Hawk, Bayraktar TB2"
    },
    {
      class_name: "Commercial Airliner",
      test_samples: 210,
      precision: 0.912,
      recall: 0.929,
      f1_score: 0.920,
      top3_accuracy: 0.986,
      sample_aircraft: "Boeing 737, Boeing 787, Airbus A320, Airbus A350"
    },
    {
      class_name: "Trainer Aircraft",
      test_samples: 140,
      precision: 0.852,
      recall: 0.848,
      f1_score: 0.850,
      top3_accuracy: 0.957,
      sample_aircraft: "T-38 Talon, BAE Hawk, T-7A Red Hawk"
    }
  ],
  confusion_matrix: {
    labels: [
      "Fighter",
      "Transport",
      "Helicopter",
      "Stealth",
      "UAV",
      "Airliner",
      "Trainer"
    ],
    matrix: [
      [202, 2, 1, 4, 3, 1, 7],
      [1, 161, 0, 3, 2, 11, 2],
      [2, 0, 141, 1, 12, 0, 4],
      [5, 4, 1, 102, 5, 2, 1],
      [3, 2, 9, 3, 144, 1, 8],
      [1, 12, 0, 1, 1, 195, 0],
      [8, 2, 4, 0, 6, 1, 119]
    ]
  }
};
