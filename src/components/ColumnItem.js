import { useState, useEffect } from "react";

export default function ColumnItem({ col, suggested, onRegister }) {
  const [type,   setType]   = useState(suggested || "ignore");
  const [min,    setMin]    = useState("");
  const [max,    setMax]    = useState("");
  const [cats,   setCats]   = useState("");
  const [handle, setHandle] = useState("remove");

  // Register a getValue function so parent can collect state without form
  useEffect(() => {
    onRegister(col, () => ({ type, min, max, cats, handle }));
  }, [col, type, min, max, cats, handle, onRegister]);

  return (
    <div className={`col-card ${type === "ignore" ? "ignored" : "active"}`}>
      <div className="col-header">
        <span className="col-name" title={col}>{col}</span>
        <span className={`col-badge badge-${type}`}>{type}</span>
      </div>

      <div className="col-body">
        {/* Data Type */}
        <div className="field-row">
          <label>Data Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ignore">Ignore</option>
            <option value="numeric">Numeric</option>
            <option value="categorical">Categorical</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Numeric: min / max */}
        {type === "numeric" && (
          <div className="field-row two-col">
            <div>
              <label>Min Value</label>
              <input
                type="number"
                placeholder="e.g. 0"
                step="any"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>
            <div>
              <label>Max Value</label>
              <input
                type="number"
                placeholder="e.g. 999"
                step="any"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Categorical */}
        {type === "categorical" && (
          <div className="field-row">
            <label>Valid Categories <span className="hint">(comma separated)</span></label>
            <input
              type="text"
              placeholder="e.g. male, female, other"
              value={cats}
              onChange={(e) => setCats(e.target.value)}
            />
          </div>
        )}

        {/* Handle missing */}
        {type !== "ignore" && (
          <div className="field-row">
            <label>Handle Missing / Invalid</label>
            <select value={handle} onChange={(e) => setHandle(e.target.value)}>
              <option value="remove">Remove Row</option>
              {type === "numeric" && <option value="mean">Replace with Mean</option>}
              {type === "numeric" && <option value="median">Replace with Median</option>}
              <option value="mode">Replace with Mode</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}