// frontend/src/components/admin/ThemeEditor/ThemeEditor.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from '../HeroEditor/HeroEditor.module.css';

const ThemeEditor = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [formData, setFormData] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '12px',
    transitionSpeed: '0.3s',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (theme) {
      setFormData({
        primaryColor: theme.primaryColor || '#6366f1',
        secondaryColor: theme.secondaryColor || '#8b5cf6',
        accentColor: theme.accentColor || '#ec4899',
        backgroundColor: theme.backgroundColor || '#0f172a',
        textColor: theme.textColor || '#f1f5f9',
        fontFamily: theme.fontFamily || "'Inter', sans-serif",
        borderRadius: theme.borderRadius || '12px',
        transitionSpeed: theme.transitionSpeed || '0.3s',
      });
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateTheme(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Theme updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to update theme' });
    }

    setLoading(false);
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the theme to default?')) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await resetTheme();

    if (result.success) {
      setMessage({ type: 'success', text: 'Theme reset to default successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to reset theme' });
    }

    setLoading(false);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Theme Customization</h2>
        <p>Customize the colors and styles of your portfolio</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formSection}>
          <h3>Colors</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="primaryColor">Primary Color</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="secondaryColor">Secondary Color</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryColor: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="accentColor">Accent Color</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  id="accentColor"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, accentColor: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="backgroundColor">Background Color</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  id="backgroundColor"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    setFormData({ ...formData, backgroundColor: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="textColor">Text Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="color"
                id="textColor"
                name="textColor"
                value={formData.textColor}
                onChange={handleChange}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Typography & Styling</h3>

          <div className={styles.formGroup}>
            <label htmlFor="fontFamily">Font Family</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={formData.fontFamily}
              onChange={handleChange}
            >
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Poppins', sans-serif">Poppins</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Lato', sans-serif">Lato</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="borderRadius">Border Radius</label>
              <input
                type="text"
                id="borderRadius"
                name="borderRadius"
                value={formData.borderRadius}
                onChange={handleChange}
                placeholder="12px"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="transitionSpeed">Transition Speed</label>
              <input
                type="text"
                id="transitionSpeed"
                name="transitionSpeed"
                value={formData.transitionSpeed}
                onChange={handleChange}
                placeholder="0.3s"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Preview</h3>
          <div
            style={{
              background: formData.backgroundColor,
              color: formData.textColor,
              padding: '2rem',
              borderRadius: formData.borderRadius,
              fontFamily: formData.fontFamily,
            }}
          >
            <h3
              style={{
                background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              Preview Heading
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              This is how your text will look with the current theme settings.
            </p>
            <button
              type="button"
              style={{
                padding: '0.75rem 1.5rem',
                background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`,
                color: 'white',
                border: 'none',
                borderRadius: formData.borderRadius,
                fontWeight: 600,
                cursor: 'pointer',
                transition: `all ${formData.transitionSpeed}`,
              }}
            >
              Sample Button
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Saving...' : 'Save Theme'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Reset to Default
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThemeEditor;