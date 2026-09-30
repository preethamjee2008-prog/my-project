/**
 * ASTRA VISION Main Application
 * Built by Preetham Alawandimath
 */

import React, { useState, useEffect } from 'react';
import { NavTab, HealthResponse, ModelInfo } from './types';
import { getHealth, getModelInfo } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Evaluation } from './pages/Evaluation';
import { History } from './pages/History';
import { About } from './pages/About';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    // Initial telemetry check
    getHealth()
      .then(setHealth)
      .catch((err) => console.warn('Health check fallback:', err));

    getModelInfo()
      .then(setModelInfo)
      .catch((err) => console.warn('Model info fallback:', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-hud-bg text-hud-text selection:bg-cyan-500 selection:text-black">
      {/* HUD Background Grid Elements */}
      <div className="fixed inset-0 hud-grid pointer-events-none z-0 opacity-40"></div>

      {/* Aerospace Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        systemStatus={health?.status || 'ONLINE'}
        inferenceMode={health?.inference_mode || 'MODE C — DEMO MODE'}
        isDemo={health?.is_demo ?? true}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={setCurrentTab}
            health={health}
            modelInfo={modelInfo}
          />
        )}

        {currentTab === 'analyze' && (
          <Analyze isDemo={health?.is_demo ?? true} />
        )}

        {currentTab === 'evaluation' && <Evaluation />}

        {currentTab === 'history' && <History />}

        {currentTab === 'about' && <About />}
      </main>

      {/* Minimal Creator Footer */}
      <Footer />
    </div>
  );
};

export default App;
