import React, { useState } from "react";
import axios from "axios";
// Import Particles and its Context Provider directly
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

  //const API_URL =
    //process.env.REACT_APP_API_URL || "http://98.93.30.243:8000/predict";
  const API_URL = process.env.REACT_APP_API_URL || "/predict";
    //const API_URL = process.env.REACT_APP_API_URL || "https://croprecommendor.work.gd/predict";

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
        err.response?.data?.detail || "Error while calling the API."
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
        value: "#0b0f19",
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
        value: "#10b981",
      },
      links: {
        color: "#1e40af",
        distance: 160,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: false,
        speed: 1.0, 
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 90, 
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
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
    <div className="app">
      {/* Particles component inside the provider hierarchy */}
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="particle-background visible"
      />

      <header className="header">
        <h1>Crop Recommendation Platform</h1>
        <p>React Frontend · FastAPI Backend</p>
      </header>

      <main className="main">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Input Parameters</h2>
          <div className="grid">
            <div className="field">
              <label>Nitrogen (N)</label>
              <input
                type="number"
                name="N"
                value={form.N}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 90"
              />
            </div>
            <div className="field">
              <label>Phosphorus (P)</label>
              <input
                type="number"
                name="P"
                value={form.P}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 42"
              />
            </div>
            <div className="field">
              <label>Potassium (K)</label>
              <input
                type="number"
                name="K"
                value={form.K}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 43"
              />
            </div>
            <div className="field">
              <label>Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 20.8"
              />
            </div>
            <div className="field">
              <label>Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={form.humidity}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 82.0"
              />
            </div>
            <div className="field">
              <label>pH Level</label>
              <input
                type="number"
                name="ph"
                value={form.ph}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 6.5"
              />
            </div>
            <div className="field full-width-field">
              <label>Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={form.rainfall}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 200.0"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing Recommendation..." : "Recommend Crop"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <section className="card result-card">
          <h2>Prediction Result</h2>
          
          {loading && (
            <div className="status-message loading-state">
              <div className="spinner"></div>
              <p>Querying Machine Learning Model...</p>
            </div>
          )}
          
          {!loading && result && (
            <div className="result-wrapper">
              <div className="visual-display-box">
                <p className="result-label">Optimal Crop Match</p>
                <h3 className="crop-name">
                  {result.recommended_crop} {getCropEmoji(result.recommended_crop)}
                </h3>
              </div>
              
              <details className="json-details">
                <summary>View Raw API JSON Metadata</summary>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </details>
            </div>
          )}
          
          {!loading && !result && !error && (
            <div className="status-message empty-state">
              <p>Provide ecosystem metrics and click "Recommend Crop" to evaluate optimal soil conditions.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Production UI Dashboard for Crop Intelligence Developed by Kosala Nayanajith Deshapriya ❤️  </p>
      </footer>
    </div>
  );
}

// 3. Export the main App wrapper wrapped with the library context builder
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