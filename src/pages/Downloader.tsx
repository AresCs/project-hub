import ProjectCard from "../components/ProjectCard/ProjectCard";
import { useNavigate } from "react-router-dom";
import spotifyLogo from "../assets/logos/Spotify.png";
import youtubeLogo from "../assets/logos/YouTube.png";

const Downloader = () => {
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <div className="container">
        <h1>🎧 Media Downloader</h1>
        <p style={{ marginBottom: '2rem', color: '#aaa' }}>
          Choose a platform to download from:
        </p>

        <div className="project-grid">
          <ProjectCard
            title="Spotify"
            description="Download tracks from your Spotify library"
            icon={<img src={spotifyLogo} alt="Spotify Logo" style={{ width: 32, height: 32 }} />}
            onClick={() => navigate("/downloader/spotify")}
          />
          <ProjectCard
            title="YouTube"
            description="Grab audio or video from YouTube"
            icon={<img src={youtubeLogo} alt="Youtube Logo" style={{ width: 32, height: 32 }} />}
            onClick={() => navigate("/downloader/youtube")}
          />
        </div>
      </div>
    </div>
  );
};

export default Downloader;
