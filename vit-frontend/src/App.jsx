import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return alert("Please select an image first.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "instruction",
      "You are an expert radiographer. Describe accurately what you see in this image."
    );

    try {
      setLoading(true);
      const res = await axios.post(
        "https://705b-34-58-14-166.ngrok-free.app/predict",
        formData
      );

      const raw = res.data.report || "";
      const parts = raw.split("assistant\n\n");
      const text = parts.length > 1 ? parts[1].trim() : raw.trim();
      setReportText(text);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Insight Scan</h2>
        </div>
        <div className="card-content">
          {/* Image Preview */}
          <div className="preview-box">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              "Preview"
            )}
          </div>

          {/* File Input */}
          <div className="file-input-wrapper">
            <label className="label" htmlFor="file-input">
              Select Radiology Scan
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {/* Submit Button */}
          <button
            className="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <div className="spinner" />}
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {/* Report Box */}
          {reportText && (
            <div className="report-box">{reportText}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
