import { useRef } from "react";

export default function UploadBox({ fName, onUpload, rowCount }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith(".csv") && !name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      alert("Only CSV and Excel (.xlsx/.xls) files allowed");
      return;
    }
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const name = file.name.toLowerCase();
      if (!name.endsWith(".csv") && !name.endsWith(".xlsx") && !name.endsWith(".xls")) {
        alert("Only CSV and Excel files allowed");
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="upload-section">
      <div
        className={`upload-zone ${fName ? "uploaded" : ""}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="upload-icon">{fName ? "✅" : "📂"}</div>
        {fName ? (
          <>
            <p className="upload-title">{fName}</p>
            <p className="upload-sub">{rowCount.toLocaleString()} rows detected · Click to replace</p>
          </>
        ) : (
          <>
            <p className="upload-title">Click to upload or drag & drop</p>
            <p className="upload-sub">Supports CSV and Excel files Only (Max 20MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}