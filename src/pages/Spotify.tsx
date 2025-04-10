import { useState } from "react";
import spotifyLogo from "../assets/logos/Spotify.png";


const Spotify = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "retrying" | "success" | "error" | "downloaded">("idle");
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleStart = async () => {
    if (!url.trim()) return;

    setStatus("searching");
    setError("");
    setFileUrl("");

    try {
      const res = await fetch("http://localhost:5000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok && data.filename) {
        const fullUrl = `http://localhost:5000/api/files/${encodeURI(data.filename)}`;
        setFileUrl(fullUrl);
        setStatus("success");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  const handleDownload = () => {
    // Add artificial delay to simulate download cleanup visibility
    setTimeout(() => {
      setStatus("downloaded");
    }, 1000);
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1>{<img src={spotifyLogo} alt="Spotify Logo" style={{ width: 32, height: 32 }} />} Spotify Downloader</h1>

        <input
          type="text"
          placeholder="Enter Spotify URL..."
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

export default Spotify;
