// frontend/src/components/admin/JourneyEditor/JourneyEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const JourneyEditor = () => {
  const { journey, refreshContent } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    autoPosition: true,
    bikeAnimation: {
      speed: 1,
      icon: 'fas fa-bicycle',
    },
  });
  const [steps, setSteps] = useState([]);
  const [bikeImage, setBikeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (journey) {
      setFormData({
        title: journey.title || '',
        subtitle: journey.subtitle || '',
        autoPosition: journey.autoPosition !== false,
        bikeAnimation: journey.bikeAnimation || { speed: 1, icon: 'fas fa-bicycle' },
      });
      setSteps(journey.steps || []);
      setBikeImage(journey.bikeAnimation?.bikeImage);
    }
  }, [journey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value,
    };
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        order: steps.length + 1,
        year: '',
        title: '',
        description: '',
        icon: 'fas fa-graduation-cap',
        position: 0, // Will be auto-calculated
        percentage: null,
      },
    ]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStepImage = (index, imageData) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      image: imageData,
    };
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        steps,
        bikeAnimation: {
          ...formData.bikeAnimation,
          bikeImage,
        },
      };

      await api.put('/journey', payload);
      await refreshContent();

      setMessage({ type: 'success', text: 'Journey section updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update journey section',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Edit Journey Section</h2>
        <p>Customize your journey timeline with bike animation</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formSection}>
          <h3>Basic Information</h3>

          <div className={styles.formGroup}>
            <label htmlFor="title">Section Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Journey"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subtitle">Subtitle</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="The path I've traveled..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="autoPosition"
                checked={formData.autoPosition}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              Auto-distribute steps evenly (recommended)
            </label>
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)' }}>
              When enabled, steps will be automatically positioned evenly along the timeline
            </small>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Bike Animation Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="bikeAnimation.speed">Animation Speed</label>
            <input
              type="number"
              id="bikeAnimation.speed"
              name="bikeAnimation.speed"
              value={formData.bikeAnimation.speed}
              onChange={handleChange}
              step="0.1"
              min="0.1"
              max="5"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bikeAnimation.icon">Bike Icon (Font Awesome class)</label>
            <input
              type="text"
              id="bikeAnimation.icon"
              name="bikeAnimation.icon"
              value={formData.bikeAnimation.icon}
              onChange={handleChange}
              placeholder="fas fa-bicycle"
            />
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)' }}>
              Examples: fas fa-bicycle, fas fa-motorcycle, fas fa-car, fas fa-rocket
            </small>
          </div>

          <div className={styles.formGroup}>
            <label>Bike Image (optional - overrides icon)</label>
            <FileUploader
              folder="journey"
              onUploadSuccess={(result) => setBikeImage(result)}
              currentImage={bikeImage}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Journey Steps</h3>

          {steps.map((step, index) => (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-color)' }}>Step {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
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
                  <label>Year</label>
                  <input
                    type="text"
                    value={step.year || ''}
                    onChange={(e) => handleStepChange(index, 'year', e.target.value)}
                    placeholder="2023"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Order</label>
                  <input
                    type="number"
                    value={step.order || index + 1}
                    onChange={(e) => handleStepChange(index, 'order', parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Percentage Achieved (optional)</label>
                  <input
                    type="number"
                    value={step.percentage || ''}
                    onChange={(e) => handleStepChange(index, 'percentage', e.target.value ? parseFloat(e.target.value) : null)}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="85.5"
                  />
                </div>
              </div>

              {!formData.autoPosition && (
                <div className={styles.formGroup}>
                  <label>Position (%) - Manual Override</label>
                  <input
                    type="number"
                    value={step.position || 0}
                    onChange={(e) => handleStepChange(index, 'position', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  placeholder="Started My Career"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={step.description || ''}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  rows="3"
                  placeholder="Brief description of this milestone..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Icon (Font Awesome class)</label>
                <input
                  type="text"
                  value={step.icon || ''}
                  onChange={(e) => handleStepChange(index, 'icon', e.target.value)}
                  placeholder="fas fa-graduation-cap"
                />
                <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)' }}>
                  Examples: fas fa-graduation-cap, fas fa-briefcase, fas fa-trophy, fas fa-star
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Image (optional)</label>
                <FileUploader
                  folder="journey"
                  onUploadSuccess={(result) => updateStepImage(index, result)}
                  currentImage={step.image}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStep}
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
            + Add Journey Step
          </button>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default JourneyEditor;