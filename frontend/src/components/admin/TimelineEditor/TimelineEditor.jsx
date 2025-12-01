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
        icon: '',
        order: items.length + 1,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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
        <h2>Edit Timeline</h2>
        <p>Customize your tech journey timeline</p>
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
              placeholder="Tech Journey Timeline"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Timeline Items</h3>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem' 
              }}>
                <h4 style={{ color: 'var(--text-color)' }}>Item {index + 1}</h4>
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
                  }}
                >
                  Remove
                </button>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Year *</label>
                  <input
                    type="text"
                    value={item.year || ''}
                    onChange={(e) => handleItemChange(index, 'year', e.target.value)}
                    placeholder="2023"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Order</label>
                  <input
                    type="number"
                    value={item.order || index + 1}
                    onChange={(e) => handleItemChange(index, 'order', parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Icon (emoji)</label>
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                    placeholder="🎓"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  placeholder="Started Learning React"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Subtitle</label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => handleItemChange(index, 'subtitle', e.target.value)}
                  placeholder="Frontend Development"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows="3"
                  placeholder="Brief description of this milestone..."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary-color)',
              border: '1px solid var(--primary-color)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            + Add Timeline Item
          </button>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default TimelineEditor;