// frontend/src/components/admin/ExperienceEditor/ExperienceEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const ExperienceEditor = () => {
  const { experiences, refreshContent } = useContent();
  const [expList, setExpList] = useState([]);
  const [editingExp, setEditingExp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: '',
    technologies: '',
    order: 0,
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (experiences) {
      setExpList(experiences);
    }
  }, [experiences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setShowForm(true);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      type: exp.type || 'Full-time',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      current: exp.current || false,
      description: exp.description || '',
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
      order: exp.order || 0,
    });
    setCompanyLogo(exp.companyLogo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          .split('\n')
          .map(r => r.trim())
          .filter(r => r),
        technologies: formData.technologies
          .split(',')
          .map(t => t.trim())
          .filter(t => t),
        companyLogo,
      };

      if (editingExp) {
        await api.put(`/experiences/${editingExp._id}`, payload);
        setMessage({ type: 'success', text: 'Experience updated successfully!' });
      } else {
        await api.post('/experiences', payload);
        setMessage({ type: 'success', text: 'Experience created successfully!' });
      }

      await refreshContent();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save experience',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await api.delete(`/experiences/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Experience deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete experience',
      });
    }
  };

  const resetForm = () => {
    setEditingExp(null);
    setShowForm(false);
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: '',
      technologies: '',
      order: 0,
    });
    setCompanyLogo(null);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Experience Management</h2>
        <p>Manage your work experience, internships, and jobs</p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.submitButton}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            + Add New Experience
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
            <h3>Experience Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Employment Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
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

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                />
                I currently work here
              </label>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of your role..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="responsibilities">Responsibilities (one per line)</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="5"
                placeholder="Developed new features&#10;Led team meetings&#10;Managed deployments"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="technologies">Technologies (comma-separated)</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Company Logo</h3>
            <FileUploader
              folder="experiences"
              onUploadSuccess={(result) => setCompanyLogo(result)}
              currentImage={companyLogo}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingExp ? 'Update Experience' : 'Create Experience'}
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
          <h3>Experiences ({expList.length})</h3>

          {expList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No experiences yet. Click "Add New Experience" to create one.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {expList.map((exp) => (
                <div
                  key={exp._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {exp.companyLogo?.url && (
                      <img
                        src={exp.companyLogo.url}
                        alt={exp.company}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                          borderRadius: 'var(--radius-sm)',
                          background: 'white',
                          padding: '0.5rem',
                        }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                        {exp.title}
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        {exp.company} • {exp.type}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(exp)}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
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

export default ExperienceEditor;