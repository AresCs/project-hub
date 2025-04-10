import React from 'react';

type ProjectCardProps = {
  title: string;
  description: string;
  icon: string | React.ReactNode; 
  onClick?: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="project-card"
      onClick={onClick}
      role="button"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </div>
      <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
      <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.95rem' }}>
        {description}
      </p>
    </div>
  );
};

export default ProjectCard;
