// frontend/src/components/admin/TimelineEditor/TimelineEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import styles from '../HeroEditor/HeroEditor.module.css';

const TimelineEditor = () => {
  const { timeline, refreshContent } = useContent();
  const [formData, setFormData] = useState({
    title: '',
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (timeline) {
      setFormData({
        title: timeline.title || '',
      });
      setItems(timeline.items || []);
    }
  }, [timeline]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        year: '',
        title: '',
        subtitle: '',
        description: '',
        icon: 'fas fa-star', // Default Font Awesome icon
        order: items.length + 1,
      },
    ]);
  };

  const removeItem = (index) => {
    if (!window.confirm('Delete this timeline item?')) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    // Update orders
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setItems(newItems);
  };

  const moveItemDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    // Update orders
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        items,
      };

      await api.put('/timeline', payload);
      await refreshContent();

      setMessage({ type: 'success', text: 'Timeline updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update timeline',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Timeline Editor</h2>
        <p>Create your professional journey timeline with modern alternating design</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formSection}>
          <h3>Timeline Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="title">Timeline Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Professional Journey"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Timeline Items</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Items will alternate: 1st → Right, 2nd → Left, 3rd → Right, and so on...
          </p>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                background: index % 2 === 0 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))' 
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(236, 72, 153, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
                position: 'relative',
              }}
            >
              {/* Position indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: index % 2 === 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                color: index % 2 === 0 ? 'var(--primary-color)' : 'var(--accent-color)',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                {index % 2 === 0 ? '→ Right' : '← Left'}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem' 
              }}>
                <h4 style={{ color: 'var(--text-color)' }}>
                  Timeline Item #{index + 1}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    style={{
                      background: index === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.2)',
                      color: index === 0 ? 'var(--text-secondary)' : 'var(--primary-color)',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === items.length - 1}
                    style={{
                      background: index === items.length - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.2)',
                      color: index === items.length - 1 ? 'var(--text-secondary)' : 'var(--primary-color)',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: index === items.length - 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Year / Date *</label>
                  <input
                    type="text"
                    value={item.year || ''}
                    onChange={(e) => handleItemChange(index, 'year', e.target.value)}
                    placeholder="2024"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Font Awesome Icon *</label>
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                    placeholder="fas fa-graduation-cap"
                    required
                  />
                  <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                    <a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                      Search icons →
                    </a>
                  </small>
                </div>
              </div>

              {/* Icon Preview */}
              {item.icon && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    Icon Preview:
                  </p>
                  <i 
                    className={item.icon}
                    style={{
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  ></i>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  placeholder="Started as Full Stack Developer"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Subtitle (Optional)</label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => handleItemChange(index, 'subtitle', e.target.value)}
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows="3"
                  placeholder="Brief description of this milestone in your journey..."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              width: '100%',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            + Add Timeline Item
          </button>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Timeline'}
        </button>
      </form>
    </div>
  );
};

export default TimelineEditor;