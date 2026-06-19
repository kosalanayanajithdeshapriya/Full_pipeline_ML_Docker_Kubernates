import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
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

  // For local development: FastAPI on localhost:8000
  // top of file

  // Local dev: call FastAPI directly
const API_URL =
  process.env.REACT_APP_API_URL || "http://98.93.30.243:8000/predict";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseFloat(value),
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

  return (
    <div className="app">
      <header className="header">
        <h1>Crop Recommendation Platform</h1>
        <p>React frontend · FastAPI backend</p>
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
              />
            </div>
            <div className="field">
              <label>pH</label>
              <input
                type="number"
                name="ph"
                value={form.ph}
                onChange={handleChange}
                step="0.1"
              />
            </div>
            <div className="field">
              <label>Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={form.rainfall}
                onChange={handleChange}
                step="0.1"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Recommend Crop"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <section className="card result-card">
          <h2>Result</h2>
          {loading && <p>Waiting for API response...</p>}
          {!loading && result && (
            <>
              <p className="highlight">
                Recommended crop: <strong>{result.recommended_crop}</strong>
              </p>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </>
          )}
          {!loading && !result && !error && (
            <p>Fill the form and click “Recommend Crop”.</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Professional UI for Crop Recommendation</p>
      </footer>
    </div>
  );
}

export default App;