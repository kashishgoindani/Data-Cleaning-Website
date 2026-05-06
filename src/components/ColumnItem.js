import { useState, useEffect } from "react";

function smartSuggest(colName, suggested) {
  const name = colName.toLowerCase();

  const dateKeywords = ["date", "time", "day", "month", "year", "dob", "birthday", "created", "updated"];
  if (dateKeywords.some(k => name.includes(k))) return "date";

  const numericKeywords = ["price", "amount", "cost", "qty", "quantity", "age",
    "count", "total", "salary", "weight", "height", "score",
    "rating", "number", "num", "id", "income", "revenue"];
  if (numericKeywords.some(k => name.includes(k))) return "numeric";

  return suggested || "categorical";
}

export default function ColumnItem({ col, suggested, onRegister }) {
  const [type,   setType]   = useState(() => smartSuggest(col, suggested));
  const [min,    setMin]    = useState("");
  const [max,    setMax]    = useState("");
  const [cats,   setCats]   = useState("");
  const [handle, setHandle] = useState("remove");

  useEffect(() => {
    onRegister(col, () => ({ type, min, max, cats, handle }));
  }, [col, type, min, max, cats, handle, onRegister]);

  return (
    <div className={`col-card ${type === "ignore" ? "ignored" : "active"}`}>
      <div className="col-header">
        <span className="col-name" title={col}>{col}</span>
        <span className={`col-badge badge-${type}`}>{type.toUpperCase()}</span>
      </div>

      <div className="col-body">
        <div className="field-row">
          <label>DATA TYPE</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ignore">Ignore</option>
            <option value="numeric">Numeric</option>
            <option value="categorical">Categorical</option>
            <option value="date">Date</option>
          </select>
        </div>

        {type === "numeric" && (
          <div className="field-row two-col">
            <div>
              <label>MIN VALUE</label>
              <input type="number" placeholder="e.g. 0" step="any"
                value={min} onChange={(e) => setMin(e.target.value)} />
            </div>
            <div>
              <label>MAX VALUE</label>
              <input type="number" placeholder="e.g. 9999" step="any"
                value={max} onChange={(e) => setMax(e.target.value)} />
            </div>
          </div>
        )}

        {type === "categorical" && (
          <div className="field-row">
            <label>VALID CATEGORIES <span className="hint">(comma separated)</span></label>
            <input type="text" placeholder="e.g. North, South, East, West"
              value={cats} onChange={(e) => setCats(e.target.value)} />
          </div>
        )}

        {type === "date" && (
          <div className="field-row">
            <label>DATE FORMAT <span className="hint">(auto-detected)</span></label>
            <input type="text" placeholder="auto" defaultValue="auto" readOnly />
          </div>
        )}

        {type !== "ignore" && (
          <div className="field-row">
            <label>HANDLE MISSING / INVALID</label>
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