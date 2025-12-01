// frontend/src/components/admin/CertificationsEditor/CertificationsEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const CertificationsEditor = () => {
  const { certifications, refreshContent } = useContent();
  const [certList, setCertList] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    credentialUrl: '',
    order: 0,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (certifications) {
      setCertList(certifications);
    }
  }, [certifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (cert) => {
    setEditingCert(cert);
    setShowForm(true);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date ? new Date(cert.date).toISOString().split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      order: cert.order || 0,
    });
    setImage(cert.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        image,
      };

      if (editingCert) {
        await api.put(`/certifications/${editingCert._id}`, payload);
        setMessage({ type: 'success', text: 'Certification updated successfully!' });
      } else {
        await api.post('/certifications', payload);
        setMessage({ type: 'success', text: 'Certification created successfully!' });
      }

      await refreshContent();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save certification',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      await api.delete(`/certifications/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Certification deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete certification',
      });
    }
  };

  const resetForm = () => {
    setEditingCert(null);
    setShowForm(false);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      credentialId: '',
      credentialUrl: '',
      order: 0,
    });
    setImage(null);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Certifications Management</h2>
        <p>Manage your certifications and achievements</p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.submitButton}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            + Add New Certification
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
            <h3>Certification Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="title">Certification Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="issuer">Issuing Organization *</label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  placeholder="Amazon Web Services"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="date">Issue Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="credentialId">Credential ID</label>
                <input
                  type="text"
                  id="credentialId"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  placeholder="ABC123XYZ"
                />
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
              <label htmlFor="credentialUrl">Credential URL</label>
              <input
                type="url"
                id="credentialUrl"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleChange}
                placeholder="https://www.credly.com/badges/..."
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Certificate Image</h3>
            <FileUploader
              folder="certifications"
              onUploadSuccess={(result) => setImage(result)}
              currentImage={image}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingCert ? 'Update Certification' : 'Create Certification'}
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
          <h3>Certifications ({certList.length})</h3>

          {certList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No certifications yet. Click "Add New Certification" to create one.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {certList.map((cert) => (
                <div
                  key={cert._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                  }}
                >
                  {cert.image?.url && (
                    <img
                      src={cert.image.url}
                      alt={cert.title}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                      }}
                    />
                  )}

                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    {cert.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {cert.issuer}
                  </p>
                  {cert.date && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(cert.date).toLocaleDateString()}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleEdit(cert)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
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
                      onClick={() => handleDelete(cert._id)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsEditor;