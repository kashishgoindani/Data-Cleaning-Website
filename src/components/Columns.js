import { useRef, useState } from "react";
import axios from "axios";
import ColumnItem from "./ColumnItem";

export default function Columns({ cols, fName, token }) {
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);


  const itemRefs = useRef({});

  const registerRef = (colName, getValue) => {
    itemRefs.current[colName] = getValue;
  };

  const handleClean = async () => {
    const payload = {};
    let hasError = false;

    for (const col of cols.map((c) => c.name)) {
      const val = itemRefs.current[col]?.();
      if (!val || val.type === "ignore") continue;

      if (val.type === "numeric") {
        if (val.min === "" || val.max === "") {
          alert(`"${col}": Please enter Min and Max values.`);
          hasError = true; break;
        }
        if (parseFloat(val.min) > parseFloat(val.max)) {
          alert(`"${col}": Min cannot be greater than Max.`);
          hasError = true; break;
        }
      }
      if (val.type === "categorical" && !val.cats.trim()) {
        alert(`"${col}": Please enter valid categories.`);
        hasError = true; break;
      }

      payload[col] = val;
    }

    if (hasError) return;
    if (Object.keys(payload).length === 0) {
      alert("Please configure at least one column (not all Ignored).");
      return;
    }

    setLoading(true);
    setUrl("");
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/inputs",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const dlUrl = window.URL.createObjectURL(new Blob([res.data]));
      setUrl(dlUrl);
      alert("✅ File cleaned successfully! Click Download to save it.");
    } catch (err) {
      try {
        const text = await err.response?.data?.text();
        const json = JSON.parse(text);
        alert("Error: " + (json.error || "Cleaning failed"));
      } catch {
        alert("Cleaning failed. Check console for details.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cols.length === 0) return null;

  return (
    <div className="columns-section">
      <div className="section-header">
        <h2>Configure Columns</h2>
        <p>Set data type and missing-value strategy for each column</p>
      </div>

      <div className="columns-grid">
        {cols.map((colObj, i) => (
          <ColumnItem
            key={i}
            col={colObj.name}
            suggested={colObj.suggested}
            onRegister={registerRef}
          />
        ))}
      </div>

      <div className="action-row">
        <button className="clean-btn" disabled={loading} onClick={handleClean}>
          {loading ? "⏳ Cleaning..." : " Clean Data"}
        </button>

        {url && (
          <a href={url} download={`cleaned_${fName}`} className="download-btn">
            Download Cleaned File
          </a>
        )}
      </div>
    </div>
  );
}