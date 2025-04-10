import ProjectCard from "../components/ProjectCard/ProjectCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <div className="container">
        <h1>🎛️ Project Hub</h1>
        <div className="project-grid">
          <ProjectCard
            title="Media Downloader"
            description="Download songs or videos from Spotify or YouTube"
            icon="🎧"
            onClick={() => navigate("/downloader")}
          />
          <ProjectCard
            title="Placeholder"
            description="Placeholder"
            icon="✅"
          />
          <ProjectCard
            title="Placeholder"
            description="Placeholder"
            icon="✅"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
