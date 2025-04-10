from flask import Flask, request, send_from_directory, jsonify, after_this_request
from flask_cors import CORS
from uuid import uuid4
from pathlib import Path
import subprocess
import shutil
import time
import os
from threading import Timer

app = Flask(__name__)
CORS(app)

# Define the temp download folder at the root level
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DOWNLOAD_FOLDER = PROJECT_ROOT / "temp"
DOWNLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

@app.route('/api/download', methods=['POST'])
def download_song():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    unique_id = uuid4().hex
    output_dir = DOWNLOAD_FOLDER / unique_id
    output_dir.mkdir(parents=True, exist_ok=True)

    output_template = str(output_dir / "%(title)s.%(ext)s")
    command = ['spotdl', url, '--output', output_template, '--bitrate', '192k']

    max_retries = 3
    attempt = 0
    while attempt < max_retries:
        try:
            print(f"[Attempt {attempt + 1}] Running spotdl for URL: {url}")
            subprocess.run(command, check=True)

            print("Checking output folder:", output_dir)
            print("Files:", list(output_dir.rglob("*")))

            for root, _, files in os.walk(output_dir):
                for filename in files:
                    if filename.lower().endswith(('.mp3', '.m4a', '.webm', '.opus')):
                        full_path = Path(root) / filename
                        flat_path = output_dir / filename

                        if full_path != flat_path:
                            full_path.replace(flat_path)

                        return jsonify({
                            'status': 'success',
                            'filename': f"{unique_id}/{filename}"
                        })

            print("No valid audio file found in output folder.")
            return jsonify({'error': 'Download completed but file not found'}), 500

        except subprocess.CalledProcessError as e:
            print(f"❌ spotdl failed on attempt {attempt + 1}: {e}")
            attempt += 1
            if attempt < max_retries:
                print("🔁 Retrying download...")
                time.sleep(2)

    return jsonify({
        'status': 'fail',
        'error': 'Spotify API limited, try again soon'
    }), 429

@app.route('/api/files/<path:filename>', methods=['GET'])
def serve_file(filename):
    full_path = DOWNLOAD_FOLDER / filename
    uuid_folder = full_path.parent

    @after_this_request
    def schedule_cleanup(response):
        def delayed_delete():
            try:
                print(f"🧹 Delayed cleanup of: {uuid_folder}")
                shutil.rmtree(uuid_folder)
            except Exception as e:
                print(f"❌ Delayed cleanup failed: {e}")

        # ⏳ Wait 5 seconds before deleting the folder to avoid file lock
        Timer(5.0, delayed_delete).start()
        return response

    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
