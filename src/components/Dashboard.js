import { useState } from "react";
import axios from "axios";
import UploadBox from "./UploadBox";
import Columns from "./Columns";

export default function Dashboard({ token, userName, onLogout }) {
  const [fName, setFName] = useState("");
  const [cols, setCols]   = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const uploadFile = async (file) => {
    setFName(file.name);
    setCols([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/file`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCols(res.data.cols);
      setRowCount(res.data.rows);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="dashboard">
      {/* ── TOP NAV ── */}
      <nav className="top-nav">
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-user-avatar">{userName.charAt(0)}</div>
            {userName}
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <h2>Welcome {userName.split(" ")[0]}</h2>
        <p>Upload a CSV or Excel file to start cleaning your data</p>
      </div>

      <UploadBox fName={fName} onUpload={uploadFile} rowCount={rowCount} />

      <Columns cols={cols} fName={fName} token={token} />
    </div>
  );
}