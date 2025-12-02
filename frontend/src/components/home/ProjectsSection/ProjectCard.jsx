// frontend/src/components/home/ProjectsSection/ProjectCard.jsx
import { forwardRef, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './ProjectsSection.module.css';

const ProjectCard = forwardRef(({ project }, ref) => {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
    });
  };

  const handleCardClick = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <div
      ref={ref}
      className={styles.projectCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className={styles.projectImage}>
        <img
          ref={imageRef}
          src={project.thumbnail?.url}
          alt={project.title}
        />
        <div ref={overlayRef} className={styles.projectOverlay}>
          <span className={styles.viewProject}>View Details</span>
        </div>
      </div>

      <div className={styles.projectContent}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className={styles.techStack}>
            {project.techStack.slice(0, 4).map((tech, index) => (
              <span key={index} className={styles.techBadge}>
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className={styles.techBadge}>
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        <div className={styles.projectLinks}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.projectLink}
              title="View Source Code"
            >
              <i className="fab fa-github"></i>
              <span>Code</span>
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.projectLink}
              title="View Live Demo"
            >
              <i className="fas fa-external-link-alt"></i>
              <span>Live</span>
            </a>
          )}
          {!project.githubLink && !project.liveLink && (
            <div
              className={styles.projectLink}
              style={{ opacity: 0.5, cursor: 'default' }}
            >
              <i className="fas fa-info-circle"></i>
              <span>Details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;