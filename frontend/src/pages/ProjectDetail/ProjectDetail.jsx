// frontend/src/pages/ProjectDetail/ProjectDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import Loader from '../../components/common/Loader/Loader';
import styles from './ProjectDetail.module.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Navbar />
        <div className={styles.error}>
          <h1>😕 Oops!</h1>
          <p>{error}</p>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className={styles.projectDetailPage}>
      <Navbar />

      <div className={styles.projectContent}>
        <div className={styles.container}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>

          <div className={styles.projectHeader}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.description}>{project.description}</p>

            <div className={styles.projectLinks}>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectButton}
                >
                  <span>GitHub</span>
                  <span>→</span>
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.projectButton} ${styles.primary}`}
                >
                  <span>Live Demo</span>
                  <span>→</span>
                </a>
              )}
            </div>
          </div>

          {project.thumbnail?.url && (
            <div className={styles.projectImage}>
              <img src={project.thumbnail.url} alt={project.title} />
            </div>
          )}

          {project.longDescription && (
            <div className={styles.projectSection}>
              <h2>About This Project</h2>
              <p>{project.longDescription}</p>
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className={styles.projectSection}>
              <h2>Technologies Used</h2>
              <div className={styles.techStack}>
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.techBadge}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className={styles.projectSection}>
              <h2>Key Features</h2>
              <ul className={styles.featuresList}>
                {project.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className={styles.checkmark}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div className={styles.projectSection}>
              <h2>Project Screenshots</h2>
              <div className={styles.imageGallery}>
                {project.images.map((img, idx) => (
                  <div key={idx} className={styles.galleryImage}>
                    <img src={img.url} alt={`Screenshot ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;