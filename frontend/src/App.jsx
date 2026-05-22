import React, { useState, useEffect } from "react";
import PartSelector from "./components/PartSelector.jsx";
import PriceBreakdown from "./components/PriceBreakdown.jsx";
import { fetchParts, calculatePrice } from "./api.js";

function App() {
  const [groupedParts, setGroupedParts] = useState({});
  const [selectedParts, setSelectedParts] = useState([]);
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partsLoading, setPartsLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchParts()
      .then((data) => setGroupedParts(data))
      .catch(() => setError("Could not load parts. Is the backend running?"))
      .finally(() => setPartsLoading(false));
  }, []);

  function handleTogglePart(partId) {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
    setResult(null);
    setError("");
    setValidationError("");
  }

  function getCompatibilityWarning() {
    const hasTubeless = selectedParts.includes("tubeless_tyre");
    const hasRim = selectedParts.includes("standard_rim");
    if (hasTubeless && !hasRim) {
      return "⚠️ Tubeless Tyre requires a Standard Rim. Please add the rim to your configuration.";
    }
    return "";
  }

  async function handleCalculate() {
    setValidationError("");
    setError("");
    setResult(null);

    if (!date) {
      setValidationError("Please select a pricing date before calculating.");
      return;
    }
    if (selectedParts.length === 0) {
      setValidationError("Please select at least one part before calculating.");
      return;
    }

    setLoading(true);
    try {
      const data = await calculatePrice(selectedParts, date);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const compatibilityWarning = getCompatibilityWarning();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">🚲</div>
          <div>
            <h1 className="header-title">Cycle Price Configurator</h1>
            <p className="header-subtitle">Hero Cycles — Sales Tool</p>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="section card">
          <h2 className="section-title">1. Choose Pricing Date</h2>
          <p className="section-hint">
            Prices may vary by date. Select the date the sale is being quoted for.
          </p>
          <input
            id="pricing-date"
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setResult(null);
              setValidationError("");
            }}
          />
        </section>

        <section className="section card">
          <h2 className="section-title">2. Select Parts</h2>
          <p className="section-hint">
            Tick all the parts that go into this cycle configuration.
          </p>

          {partsLoading ? (
            <p className="status-msg">Loading parts…</p>
          ) : (
            <PartSelector
              groupedParts={groupedParts}
              selectedParts={selectedParts}
              onToggle={handleTogglePart}
            />
          )}

          {compatibilityWarning && (
            <div className="warning-banner">{compatibilityWarning}</div>
          )}

          {selectedParts.length > 0 && (
            <p className="selection-count">
              {selectedParts.length} part{selectedParts.length > 1 ? "s" : ""} selected
            </p>
          )}
        </section>

        {validationError && (
          <div className="error-banner">{validationError}</div>
        )}

        {error && (
          <div className="error-banner">{error}</div>
        )}

        <button
          id="calculate-btn"
          className="calculate-btn"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "Calculating…" : "Calculate Price"}
        </button>

        {result && (
          <section className="section">
            <PriceBreakdown breakdown={result.breakdown} total={result.total} />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Hero Cycles Internal Tool · Prices are indicative and date-dependent</p>
      </footer>
    </div>
  );
}

export default App;