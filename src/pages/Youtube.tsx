import { useState } from "react";
import youtubeLogo from "../assets/logos/YouTube.png";

const Youtube = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "searching" | "retrying" | "success" | "error" | "downloaded"
  >("idle");
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleStart = async () => {
    console.log("▶️ Start button clicked with URL:", url);
    if (!url.trim()) return;

    setStatus("searching");
    setError("");
    setFileUrl("");

    try {
      console.log("📡 Sending request to /api/download/youtube");
      const res = await fetch("http://localhost:5001/api/download/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        credentials: "include",
      });

      console.log("📬 Response received:", res.status);
      const data = await res.json();
      console.log("📦 Response data:", data);

      if (res.ok && data.filename) {
        const fullUrl = `http://localhost:5001/api/files/${encodeURI(data.filename)}`;
        console.log("✅ File available at:", fullUrl);
        setFileUrl(fullUrl);
        setStatus("success");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err: unknown) {
      console.error("❌ Error occurred in fetch", err);
      if (err instanceof Error) {
        setError(err.message);
        setStatus(err.message.includes("rate limit") ? "retrying" : "error");
      } else {
        setError("Unknown error occurred");
        setStatus("error");
      }
    }
  };

  const handleDownload = () => {
    console.log("⬇️ File download triggered:", fileUrl);
    setTimeout(() => {
      setStatus("downloaded");
    }, 1000);
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1>
          <img
            src={youtubeLogo}
            alt="YouTube Logo"
            style={{ width: 32, height: 32, verticalAlign: "middle", marginRight: 10 }}
          />
          YouTube Downloader
        </h1>

        <input
          type="text"
          placeholder="Enter YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleStart}
          disabled={status === "searching" || !url.trim()}
          style={buttonStyle}
        >
          {status === "searching" ? "Processing..." : "Start"}
        </button>

        {status === "searching" && <p style={{ color: "#facc15" }}>🔎 Searching and downloading...</p>}
        {status === "retrying" && <p style={{ color: "#fbbf24" }}>🔁 Retrying download...</p>}
        {status === "error" && (
          <p style={{ color: "red", marginTop: "1rem" }}>
            ❌ {error || "Something went wrong. Try again soon."}
          </p>
        )}

        {status === "success" && fileUrl && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                <p style={{ margin: 0 }}>Download ready</p>
              </div>
              <a href={fileUrl} download onClick={handleDownload} style={{ alignSelf: "center" }}>
                <button style={{ ...buttonStyle, marginTop: "1rem" }}>Download MP3</button>
              </a>
            </div>
          </div>
        )}

        {status === "downloaded" && (
          <div style={{ ...cardStyle, backgroundColor: "#1f2937", border: "1px solid #4ade80", marginTop: "1rem" }}>
            <p style={{ color: "#4ade80", fontWeight: 500 }}>
              ✅ File has been downloaded and removed from the server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "0.75rem",
  width: "100%",
  maxWidth: "500px",
  marginBottom: "1rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  marginBottom: "2rem",
  fontSize: "1rem",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  backgroundColor: "#1a1a1a",
  padding: "1.5rem",
  borderRadius: "12px",
  marginTop: "1rem",
  color: "#eee",
};

export default Youtube;
