# 🎧 Project Hub – Media Downloader

A full-stack media downloader that supports downloading audio from **Spotify** and **YouTube** using a sleek React frontend and separate Flask-powered backends.

---

## 📦 Features

- 🎵 **Spotify Downloader**
  - Download tracks by URL
  - MP3 conversion
  - Auto cleanup after download

- 📺 **YouTube Downloader**
  - Download audio from YouTube videos
  - Uses `yt-dlp` under the hood
  - Smart error handling and cleanup

- 💻 **React Frontend**
  - Modern UI with real-time feedback
  - Logo branding per platform
  - Shared design system between platforms

- ⚙️ **Flask Backends (2 servers)**
  - `spotify_downloader.py` runs on **port 5000**
  - `youtube_downloader.py` runs on **port 5001**
  - CORS configured for frontend at `http://localhost:5173`

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/project-hub.git
cd project-hub
```

### 2. Install dependencies

#### Frontend

```bash
cd src
npm install
```

#### Backend

```bash
pip install -r requirements.txt
```

Make sure `yt-dlp` is installed and available globally:

```bash
pip install yt-dlp
```

---

## 🔧 Run the App

### Start the Frontend (Vite)

```bash
cd src
npm run dev
```

This starts the React frontend on:  
📍 `http://localhost:5173`

### Start Spotify Backend

```bash
python scripts/spotify_downloader.py
```

Runs on: `http://localhost:5000`

### Start YouTube Backend

```bash
python scripts/youtube_downloader.py
```

Runs on: `http://localhost:5001`

✅ Both servers support CORS and respond to `/api/download/...` routes.

---

## 📁 Folder Structure

```
├── scripts/
│   ├── spotify_downloader.py       # Flask app for Spotify
│   ├── youtube_downloader.py       # Flask app for YouTube
│
├── src/
│   ├── pages/
│   │   ├── Spotify.tsx             # Spotify UI logic
│   │   ├── Youtube.tsx             # YouTube UI logic
│   │
│   ├── assets/logos/               # Platform logos
│   ├── components/                 # Reusable components (e.g. ProjectCard)
│   ├── App.tsx / main.tsx
│   └── ...
│
├── temp/                           # Downloaded files (auto cleaned)
```

---

## 🧼 File Cleanup

Both backends automatically delete downloaded files after:

- Successful download delivery
- 5-second delay to ensure download completes
- Prevents storage bloat

---

## 💡 Future Ideas

- 🎶 Playlist support
- 🧠 Auto URL detection (YouTube vs Spotify)
- 🔐 OAuth for private playlists
- ☁️ Cloud deployment with one unified backend

---

## 📜 License

MIT – Use freely, modify with flair.

---

## 🙌 Contributing

Pull requests are welcome. Let’s build more tools like this!