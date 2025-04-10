import threading
from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory,
    make_response,
    after_this_request,
)
from flask_cors import CORS
import os
import shutil
import time
import subprocess
from uuid import uuid4

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOWNLOAD_FOLDER = os.path.join(PROJECT_ROOT, "temp")
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/api/download/youtube", methods=["POST", "OPTIONS"])
def download_youtube():
    if request.method == "OPTIONS":
        print("🔁 Preflight OPTIONS received")
        return make_response("", 204)

    print("📩 Incoming POST /api/download/youtube")
    data = request.get_json()
    url = data.get("url")
    print(f"🎯 YouTube URL: {url}")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    unique_id = uuid4().hex
    output_dir = os.path.join(DOWNLOAD_FOLDER, unique_id)
    os.makedirs(output_dir, exist_ok=True)

    output_template = os.path.join(output_dir, "%(title)s.%(ext)s")
    command = [
        "yt-dlp",
        url,
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "-o",
        output_template,
    ]

    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"▶️ Running yt-dlp (attempt {attempt+1})...")
            subprocess.run(command, check=True)

            files = os.listdir(output_dir)
            print("📁 Output contents:", files)

            for filename in files:
                if filename.lower().endswith((".mp3", ".m4a", ".webm", ".opus")):
                    print(f"✅ Found file: {filename}")
                    return jsonify(
                        {"status": "success", "filename": f"{unique_id}/{filename}"}
                    )

            print("⚠️ Download completed but file not found")
            return jsonify({"error": "Download completed but file not found"}), 500

        except subprocess.CalledProcessError as e:
            print(f"❌ yt-dlp failed (attempt {attempt+1}): {e}")
            time.sleep(2)

    return (
        jsonify(
            {"status": "fail", "error": "YouTube download failed. Try again later."}
        ),
        429,
    )


@app.route("/api/files/<path:filename>", methods=["GET"])
def serve_file(filename):
    full_path = os.path.join(DOWNLOAD_FOLDER, filename)
    directory = os.path.dirname(full_path)
    filename_only = os.path.basename(full_path)

    print(f"📤 Serving file: {filename_only} from {directory}")

    # ✅ Run cleanup after short delay in background
    def cleanup():
        try:
            print(f"🧹 Cleaning up: {directory}")
            time.sleep(2)  # Optional: wait to ensure download finishes
            shutil.rmtree(directory)
        except Exception as e:
            print(f"⚠️ Cleanup error: {e}")

    # ✅ Trigger delayed cleanup after response starts
    threading.Timer(5.0, cleanup).start()

    return send_from_directory(directory, filename_only, as_attachment=True)


if __name__ == "__main__":
    print("🚀 yt-dlp YouTube Downloader running on http://localhost:5001")
    app.run(debug=True, port=5001)
