// frontend/src/components/admin/SkillsEditor/SkillsEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

// Expanded categories for any skill domain
const SKILL_CATEGORIES = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'database', label: 'Database & Data Storage' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'programming', label: 'Programming Languages' },
  { value: 'framework', label: 'Frameworks & Libraries' },
  { value: 'tools', label: 'Development Tools' },
  { value: 'design', label: 'Design & UI/UX' },
  { value: 'testing', label: 'Testing & QA' },
  { value: 'ai-ml', label: 'AI & Machine Learning' },
  { value: 'data-science', label: 'Data Science & Analytics' },
  { value: 'blockchain', label: 'Blockchain & Web3' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'game-dev', label: 'Game Development' },
  { value: 'embedded', label: 'Embedded Systems & IoT' },
  { value: 'version-control', label: 'Version Control' },
  { value: 'soft-skills', label: 'Soft Skills' },
  { value: 'languages', label: 'Spoken Languages' },
  { value: 'other', label: 'Other Skills' },
];

const SkillsEditor = () => {
  const { skills, refreshContent } = useContent();
  const [skillsList, setSkillsList] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'programming',
    proficiency: 80,
    displayInMarquee: true,
    fontAwesomeIcon: '',
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
      category: skill.category || 'programming',
      proficiency: skill.proficiency || 80,
      displayInMarquee: skill.displayInMarquee !== false,
      fontAwesomeIcon: skill.fontAwesomeIcon || '',
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
        // Order will be auto-assigned by backend
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

  const handleMoveUp = async (skill, categorySkills) => {
    const currentIndex = categorySkills.findIndex(s => s._id === skill._id);
    if (currentIndex === 0) return; // Already at top

    const prevSkill = categorySkills[currentIndex - 1];
    
    try {
      // Swap orders
      await api.put(`/skills/${skill._id}`, { order: prevSkill.order });
      await api.put(`/skills/${prevSkill._id}`, { order: skill.order });
      await refreshContent();
      setMessage({ type: 'success', text: 'Order updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update order' });
    }
  };

  const handleMoveDown = async (skill, categorySkills) => {
    const currentIndex = categorySkills.findIndex(s => s._id === skill._id);
    if (currentIndex === categorySkills.length - 1) return; // Already at bottom

    const nextSkill = categorySkills[currentIndex + 1];
    
    try {
      // Swap orders
      await api.put(`/skills/${skill._id}`, { order: nextSkill.order });
      await api.put(`/skills/${nextSkill._id}`, { order: skill.order });
      await refreshContent();
      setMessage({ type: 'success', text: 'Order updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update order' });
    }
  };

  const resetForm = () => {
    setEditingSkill(null);
    setShowForm(false);
    setFormData({
      name: '',
      category: 'programming',
      proficiency: 80,
      displayInMarquee: true,
      fontAwesomeIcon: '',
    });
    setLogo(null);
  };

  const getCategorySkills = (category) => {
    return skillsList.filter(s => s.category === category).sort((a, b) => a.order - b.order);
  };

  const getCategoryLabel = (value) => {
    return SKILL_CATEGORIES.find(cat => cat.value === value)?.label || value;
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Skills Management</h2>
        <p>Manage all your skills across any domain - order is automatically managed</p>
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
                placeholder="e.g., React, Python, Leadership, Spanish"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="proficiency">Proficiency (%) *</label>
                <input
                  type="number"
                  id="proficiency"
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
                <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                  0-100 scale representing your skill level
                </small>
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
                <span>Display in Animated Marquee</span>
              </label>
              <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem', marginLeft: '26px' }}>
                Show this skill in the scrolling banner
              </small>
            </div>
          </div>

          {/* Font Awesome Icon Section */}
          <div className={styles.formSection}>
            <h3>Icon (Font Awesome - For Marquee)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              This icon will be used in the <strong>marquee section</strong>. If not provided, uploaded image will be used instead.
              <br />
              <a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                🔍 Search Font Awesome Icons →
              </a>
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="fontAwesomeIcon">Font Awesome Class (Optional)</label>
              <input
                type="text"
                id="fontAwesomeIcon"
                name="fontAwesomeIcon"
                value={formData.fontAwesomeIcon}
                onChange={handleChange}
                placeholder="fab fa-react"
              />
            </div>

            {/* Preview Icon */}
            {formData.fontAwesomeIcon && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Icon Preview (Marquee):</p>
                <i 
                  className={formData.fontAwesomeIcon}
                  style={{ 
                    fontSize: '4rem',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                ></i>
              </div>
            )}
          </div>

          {/* Logo Upload Section */}
          <div className={styles.formSection}>
            <h3>Skill Image (For Skills Grid Display)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Upload an image to display in the <strong>skills grid section</strong> with percentages.
              <br />
              • Will also be used in <strong>marquee if no Font Awesome icon</strong> is provided above
              <br />
              <em>Recommended: Square images (PNG/SVG) with transparent backgrounds</em>
            </p>
            <FileUploader
              key={editingSkill?._id || 'new'}
              folder="skills"
              onUploadSuccess={(result) => setLogo(result)}
              currentImage={logo}
            />
            
            {!formData.fontAwesomeIcon && !logo && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(255, 200, 0, 0.1)',
                border: '1px solid rgba(255, 200, 0, 0.3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                color: '#fbbf24'
              }}>
                ⚠️ No icon or image provided. A letter placeholder will be used.
              </div>
            )}
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Use ↑↓ arrows to reorder skills within each category
          </p>

          {SKILL_CATEGORIES.map(category => {
            const categorySkills = getCategorySkills(category.value);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category.value} style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  color: 'var(--primary-color)', 
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  {category.label} ({categorySkills.length})
                </h4>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {categorySkills.map((skill, index) => (
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
                      {/* Show icon for marquee preview, image for grid */}
                      {skill.logo?.url ? (
                        <img
                          src={skill.logo.url}
                          alt={skill.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            marginBottom: '0.5rem',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        />
                      ) : skill.fontAwesomeIcon ? (
                        <i 
                          className={skill.fontAwesomeIcon}
                          style={{
                            fontSize: '3rem',
                            display: 'block',
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        ></i>
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: 'white',
                          margin: '0 auto 0.5rem',
                        }}>
                          {skill.name.charAt(0)}
                        </div>
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

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Order controls */}
                        <button
                          onClick={() => handleMoveUp(skill, categorySkills)}
                          disabled={index === 0}
                          style={{
                            padding: '0.5rem',
                            background: index === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.2)',
                            color: index === 0 ? 'var(--text-secondary)' : 'var(--primary-color)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            flex: '0 0 auto',
                          }}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(skill, categorySkills)}
                          disabled={index === categorySkills.length - 1}
                          style={{
                            padding: '0.5rem',
                            background: index === categorySkills.length - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.2)',
                            color: index === categorySkills.length - 1 ? 'var(--text-secondary)' : 'var(--primary-color)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: index === categorySkills.length - 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            flex: '0 0 auto',
                          }}
                          title="Move down"
                        >
                          ↓
                        </button>
                        
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