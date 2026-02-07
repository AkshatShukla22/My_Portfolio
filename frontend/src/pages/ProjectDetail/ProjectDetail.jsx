// frontend/src/pages/ProjectDetail/ProjectDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import Loader from '../../components/common/Loader/Loader';
import styles from './ProjectDetail.module.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleBackClick = () => {
    navigate('/', { replace: false });
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Navbar />
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <h1>Oops!</h1>
          <p>{error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to Home</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className={styles.projectDetailPage}>
      <Navbar />

      <div className={styles.projectDetail}>
        <div className={styles.container}>
          <button onClick={handleBackClick} className={styles.backLink}>
            <i className="fas fa-arrow-left"></i>
          </button>

          <div className={styles.projectHeader}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.description}>{project.description}</p>
          </div>

          {project.thumbnail?.url && (
            <div className={styles.projectImage}>
              <img src={project.thumbnail.url} alt={project.title} />
              <div className={styles.imageOverlay}></div>
            </div>
          )}

          <div className={styles.projectLinks}>
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                <i className="fab fa-github"></i>
                <span>View on GitHub</span>
                <i className="fas fa-external-link-alt"></i>
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.projectLink} ${styles.primary}`}
              >
                <i className="fas fa-rocket"></i>
                <span>Live Demo</span>
                <i className="fas fa-external-link-alt"></i>
              </a>
            )}
          </div>

          {project.longDescription && (
            <div className={styles.projectSection}>
              <h2>
                <i className="fas fa-info-circle"></i>
                About This Project
              </h2>
              <p>{project.longDescription}</p>
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className={styles.projectSection}>
              <h2>
                <i className="fas fa-code"></i>
                Technologies Used
              </h2>
              <div className={styles.techStack}>
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.techBadge}>
                    <i className="fas fa-check-circle"></i>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className={styles.projectSection}>
              <h2>
                <i className="fas fa-star"></i>
                Key Features
              </h2>
              <ul className={styles.featuresList}>
                {project.features.map((feature, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check-circle"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div className={styles.projectSection}>
              <h2>
                <i className="fas fa-images"></i>
                Project Screenshots
              </h2>
              <div className={styles.imageGallery}>
                {project.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={styles.galleryImage}
                    onClick={() => openImageModal(img.url)}
                  >
                    <img src={img.url} alt={`Screenshot ${idx + 1}`} />
                    <div className={styles.imageOverlay}>
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className={styles.imageModal} onClick={closeImageModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeImageModal}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage} alt="Enlarged view" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetail;