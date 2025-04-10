import subprocess
import os

spotify = subprocess.Popen(["python", "scripts/spotify_downloader.py"])
youtube = subprocess.Popen(["python", "scripts/youtube_downloader.py"])

print("🚀 Both Spotify and YouTube backends are running... (Press CTRL+C to stop)")

try:
    spotify.wait()
    youtube.wait()
except KeyboardInterrupt:
    print("🛑 Stopping servers...")
    spotify.terminate()
    youtube.terminate()
