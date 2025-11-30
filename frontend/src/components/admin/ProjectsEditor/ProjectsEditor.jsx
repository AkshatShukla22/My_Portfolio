// frontend/src/components/admin/ProjectsEditor/ProjectsEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const ProjectsEditor = () => {
  const { projects, refreshContent } = useContent();
  const [projectsList, setProjectsList] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    techStack: '',
    features: '',
    githubLink: '',
    liveLink: '',
    category: 'web',
    featured: false,
    order: 0,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (projects) {
      setProjectsList(projects);
    }
  }, [projects]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      techStack: project.techStack?.join(', ') || '',
      features: project.features?.join('\n') || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      category: project.category || 'web',
      featured: project.featured || false,
      order: project.order || 0,
    });
    setThumbnail(project.thumbnail);
    setImages(project.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        features: formData.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        thumbnail,
        images: images.filter(Boolean),
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
        setMessage({ type: 'success', text: 'Project updated successfully!' });
      } else {
        await api.post('/projects', payload);
        setMessage({ type: 'success', text: 'Project created successfully!' });
      }

      await refreshContent();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save project',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete project',
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      techStack: '',
      features: '',
      githubLink: '',
      liveLink: '',
      category: 'web',
      featured: false,
      order: 0,
    });
    setThumbnail(null);
    setImages([]);
  };

  const addImageSlot = () => {
    setImages([...images, null]);
  };

  const updateImage = (index, imageData) => {
    const newImages = [...images];
    newImages[index] = imageData;
    setImages(newImages);
  };

  const removeImageSlot = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Projects Management</h2>
        <p>Manage your portfolio projects</p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.submitButton}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            + Add New Project
          </button>
        )}
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.editorForm}>
          <div className={styles.formSection}>
            <h3>Basic Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="My Awesome Project"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Short Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Brief description for project card..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="longDescription">Long Description</label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows="6"
                placeholder="Detailed description for project detail page..."
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="api">API/Backend</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>Featured Project</span>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Technical Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="techStack">Tech Stack (comma-separated)</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Express"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="features">Features (one per line)</label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="5"
                placeholder="User authentication&#10;Real-time updates&#10;Responsive design"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Links</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="githubLink">GitHub Repository</label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="liveLink">Live Demo</label>
                <input
                  type="url"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Images</h3>

            <div className={styles.formGroup}>
              <label>Thumbnail Image *</label>
              <FileUploader
                folder="projects"
                onUploadSuccess={(result) => setThumbnail(result)}
                currentImage={thumbnail}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Additional Images</label>
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '1rem',
                    position: 'relative',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Image {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImageSlot(index)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <FileUploader
                    folder="projects"
                    onUploadSuccess={(result) => updateImage(index, result)}
                    currentImage={img}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addImageSlot}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary-color)',
                  border: '1px solid var(--primary-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                + Add Image
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.formSection}>
          <h3>Existing Projects ({projectsList.length})</h3>

          {projectsList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No projects yet. Click "Add New Project" to create one.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projectsList.map((project) => (
                <div
                  key={project._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  {project.thumbnail?.url && (
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        color: 'var(--text-color)',
                        marginBottom: '0.5rem',
                        fontSize: '1.2rem',
                      }}
                    >
                      {project.title}
                      {project.featured && (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            background: 'rgba(236, 72, 153, 0.2)',
                            color: 'var(--accent-color)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          FEATURED
                        </span>
                      )}
                    </h4>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {project.description}
                    </p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {project.techStack.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'rgba(99, 102, 241, 0.1)',
                              color: 'var(--primary-color)',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(project)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsEditor;