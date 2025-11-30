// frontend/src/components/home/ProjectsSection/ProjectCard.jsx
import { forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './ProjectsSection.module.css';

const ProjectCard = forwardRef(({ project }, ref) => {
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
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

  return (
    <Link
      to={`/projects/${project._id}`}
      ref={ref}
      className={styles.projectCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.projectImage}>
        <img
          ref={imageRef}
          src={project.thumbnail?.url}
          alt={project.title}
        />
        <div ref={overlayRef} className={styles.projectOverlay}>
          <span className={styles.viewProject}>View Project →</span>
        </div>
      </div>

      <div className={styles.projectContent}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className={styles.techStack}>
            {project.techStack.map((tech, index) => (
              <span key={index} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className={styles.projectLinks}>
          {project.githubLink && (
            
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.projectLink}
            >
              GitHub
            </a>
          )}
          {project.liveLink && (
            
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.projectLink}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </Link>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;