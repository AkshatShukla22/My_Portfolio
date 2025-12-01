// frontend/src/components/admin/SkillsEditor/SkillsEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const SkillsEditor = () => {
  const { skills, refreshContent } = useContent();
  const [skillsList, setSkillsList] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 80,
    displayInMarquee: true,
    order: 0,
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (skills) {
      setSkillsList(skills);
    }
  }, [skills]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
    setFormData({
      name: skill.name,
      category: skill.category || 'frontend',
      proficiency: skill.proficiency || 80,
      displayInMarquee: skill.displayInMarquee !== false,
      order: skill.order || 0,
    });
    setLogo(skill.logo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        logo,
      };

      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, payload);
        setMessage({ type: 'success', text: 'Skill updated successfully!' });
      } else {
        await api.post('/skills', payload);
        setMessage({ type: 'success', text: 'Skill created successfully!' });
      }

      await refreshContent();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save skill',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await api.delete(`/skills/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete skill',
      });
    }
  };

  const resetForm = () => {
    setEditingSkill(null);
    setShowForm(false);
    setFormData({
      name: '',
      category: 'frontend',
      proficiency: 80,
      displayInMarquee: true,
      order: 0,
    });
    setLogo(null);
  };

  const getCategorySkills = (category) => {
    return skillsList.filter(s => s.category === category);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Skills Management</h2>
        <p>Manage your technical skills and tools</p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.submitButton}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            + Add New Skill
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
            <h3>Skill Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="name">Skill Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="React"
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
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="proficiency">Proficiency (%)</label>
                <input
                  type="number"
                  id="proficiency"
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleChange}
                  min="0"
                  max="100"
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="displayInMarquee"
                  name="displayInMarquee"
                  checked={formData.displayInMarquee}
                  onChange={handleChange}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>Display in Auto-Scrolling Marquee</span>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Skill Logo</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Upload SVG or PNG logo for best quality
            </p>
            <FileUploader
              folder="skills"
              onUploadSuccess={(result) => setLogo(result)}
              currentImage={logo}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
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
          <h3>Skills by Category</h3>

          {['frontend', 'backend', 'database', 'tools', 'other'].map(category => {
            const categorySkills = getCategorySkills(category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  color: 'var(--primary-color)', 
                  textTransform: 'capitalize',
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  {category} ({categorySkills.length})
                </h4>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        textAlign: 'center',
                      }}
                    >
                      {skill.logo?.url && (
                        <img
                          src={skill.logo.url}
                          alt={skill.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            marginBottom: '0.5rem',
                          }}
                        />
                      )}

                      <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                        {skill.name}
                      </h5>

                      {skill.proficiency && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${skill.proficiency}%`,
                              height: '100%',
                              background: 'var(--primary-color)',
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-secondary)' 
                          }}>
                            {skill.proficiency}%
                          </span>
                        </div>
                      )}

                      {skill.displayInMarquee && (
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: 'var(--primary-color)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          marginBottom: '0.5rem',
                        }}>
                          In Marquee
                        </span>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(skill)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {skillsList.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No skills yet. Click "Add New Skill" to create one.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsEditor;