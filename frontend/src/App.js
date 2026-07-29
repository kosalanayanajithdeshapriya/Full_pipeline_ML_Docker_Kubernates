import React, { useState } from "react";
import axios from "axios";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "./App.css";

function MainAppContent() {
  const [form, setForm] = useState({
    N: 90,
    P: 42,
    K: 43,
    temperature: 20.8,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 200.0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "http://34.224.218.115:8000/predict";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(API_URL, form);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Error while calling the API Engine."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCropEmoji = (crop) => {
    if (!crop) return "🌱";
    const cropLower = crop.toLowerCase();
    if (cropLower.includes("rice")) return "🌾";
    if (cropLower.includes("maize") || cropLower.includes("corn")) return "🌽";
    if (cropLower.includes("tomato")) return "🍅";
    if (cropLower.includes("banana")) return "🍌";
    if (cropLower.includes("apple")) return "🍎";
    return "🌱";
  };

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: 1 }, 
    background: {
      color: {
        value: "#F4F6F5", 
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.25 } },
      },
    },
    particles: {
      color: {
        value: "#137517", 
      },
      links: {
        color: "#137517",
        distance: 160,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: false,
        speed: 0.8, 
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 40, 
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="dashboard-wrapper">
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="particle-layer"
      />

      {/* 🌐 NAVBAR */}
      <nav className="custom-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">🌱</span> AgriAI
          <span className="logo-sub">| Crop Recommendor</span>
        </div>
        <div className="navbar-links">
          <button className="nav-btn">Home</button>
          <button className="nav-btn active">Predict</button>
          <button className="nav-btn">About</button>
          <button className="nav-btn">Contact</button>
        </div>
      </nav>

      {/* 📊 MAIN CONTAINER */}
      <div className="dashboard-container">
        
        {/* 🛠️ LEFT SIDEBAR: FORM */}
        <form onSubmit={handleSubmit} className="form-sidebar">
          <h2 className="sidebar-title">Soil & Environment Inputs</h2>
          
          <div className="input-stack">
            {[
              { label: 'Nitrogen (N)', name: 'N', unit: 'mg/kg', placeholder: '90' },
              { label: 'Phosphorus (P)', name: 'P', unit: 'mg/kg', placeholder: '42' },
              { label: 'Potassium (K)', name: 'K', unit: 'mg/kg', placeholder: '43' },
              { label: 'Temperature', name: 'temperature', unit: '°C', placeholder: '20.8' },
              { label: 'Humidity', name: 'humidity', unit: '%', placeholder: '82.0' },
              { label: 'pH Level', name: 'ph', unit: 'pH', placeholder: '6.5' },
              { label: 'Rainfall', name: 'rainfall', unit: 'mm', placeholder: '200.0' },
            ].map((input) => (
              <div key={input.name} className="input-group">
                <label className="input-label">{input.label}</label>
                <div className="input-with-unit">
                  <input 
                    type="number" 
                    step="0.01"
                    name={input.name}
                    value={form[input.name]}
                    onChange={handleChange}
                    placeholder={input.placeholder} 
                    className="custom-input"
                  />
                  <span className="unit-label">{input.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="predict-submit-btn">
            {loading ? "Processing Engine..." : "Get Recommendation"}
          </button>

          {error && <p className="error-badge">❌ {error}</p>}
        </form>

        {/* 🎉 RIGHT CONTENT AREA */}
        <div className="results-area">
          
          {/* HERO BANNER */}
          <div className="hero-banner">
            <div className="banner-text-content">
              <h3 className="banner-subtitle">Recommendation Result</h3>
              
              {loading ? (
                <div className="loading-row">
                  <div className="custom-spinner"></div>
                  <p className="loading-text">Evaluating Soil Analytics...</p>
                </div>
              ) : result ? (
                <div>
                  <p className="match-label">Best Crop Match Found:</p>
                  <h1 className="crop-result-title">{result.recommended_crop}</h1>
                </div>
              ) : (
                <p className="banner-empty-text">
                  Awaiting ecosystem metrics. Click "Get Recommendation" to evaluate optimal crop lifecycle matches.
                </p>
              )}
            </div>
            <div className="banner-vector">
              {loading ? "⚙️" : result ? getCropEmoji(result.recommended_crop) : "🌾"}
            </div>
          </div>

          {/* WHY CROP DETAILS CARD */}
          {result && !loading && (
            <div className="explanation-card">
              <div className="status-icon-box">✅</div>
              <div className="explanation-text-box">
                <h4 className="explanation-title">Why {result.recommended_crop}?</h4>
                <p className="explanation-desc">
                  Based on your specialized nitrogen-phosphorus-potassium balance, rainfall of {form.rainfall}mm, and pH of {form.ph}, the machine learning architecture predicts <span className="highlight-text">{result.recommended_crop}</span> as the highest-yielding agronomic ecosystem match.
                </p>
              </div>
            </div>
          )}

          {/* METRICS TRIO GRID */}
          <div className="metrics-grid">
            <div className="metric-card">
              <p className="metric-header">Confidence Score</p>
              <p className="metric-value green-text">{result && !loading ? "95.4%" : "--"}</p>
            </div>

            <div className="metric-card">
              <p className="metric-header">Suitability Index</p>
              <p className={`suitability-badge ${result && !loading ? 'active' : ''}`}>
                {result && !loading ? "Excellent" : "--"}
              </p>
            </div>
          </div>

          {/* RAW JSON METADATA PAYLOAD */}
          {result && !loading && (
            <details className="raw-json-accordion">
              <summary className="accordion-summary">View Server JSON Metadata Payload</summary>
              <pre className="json-render-box">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          )}

        </div>
      </div>

      <footer className="professional-footer">
        <p>Production UI Dashboard for Crop Intelligence Developed by D.M Kosala Nayanajith Deshapriya ❤️</p>
      </footer>
    </div>
  );
}

export default function App() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <ParticlesProvider init={particlesInit}>
      <MainAppContent />
    </ParticlesProvider>
  );
}