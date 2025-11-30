// frontend/src/components/admin/HeroEditor/HeroEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from './HeroEditor.module.css';

const HeroEditor = () => {
  const { hero, refreshContent } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    model3D: {
      type: 'cube',
      rotationSpeed: 0.01,
    },
    animations: {
      titleAnimation: 'fadeInUp',
      imageAnimation: 'fadeIn',
    },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        ctaText: hero.ctaText || '',
        ctaLink: hero.ctaLink || '',
        model3D: hero.model3D || { type: 'cube', rotationSpeed: 0.01 },
        animations: hero.animations || {
          titleAnimation: 'fadeInUp',
          imageAnimation: 'fadeIn',
        },
      });
      setProfileImage(hero.profileImage);
      setBackgroundImage(hero.backgroundImage);
    }
  }, [hero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        profileImage,
        backgroundImage,
      };

      await api.put('/hero', payload);
      await refreshContent();
      
      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update hero section',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Edit Hero Section</h2>
        <p>Customize the hero section of your portfolio</p>
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
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Your Name"
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
              placeholder="Full Stack Developer"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Brief introduction about yourself..."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="ctaText">CTA Button Text</label>
              <input
                type="text"
                id="ctaText"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
                placeholder="Get In Touch"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ctaLink">CTA Button Link</label>
              <input
                type="text"
                id="ctaLink"
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="#contact"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Images</h3>
          
          <div className={styles.formGroup}>
            <label>Profile Image</label>
            <FileUploader
              folder="hero"
              onUploadSuccess={(result) => setProfileImage(result)}
              currentImage={profileImage}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Background Image</label>
            <FileUploader
              folder="hero"
              onUploadSuccess={(result) => setBackgroundImage(result)}
              currentImage={backgroundImage}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>3D Model Settings</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="model3D.type">Model Type</label>
              <select
                id="model3D.type"
                name="model3D.type"
                value={formData.model3D.type}
                onChange={handleChange}
              >
                <option value="cube">Cube</option>
                <option value="sphere">Sphere</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="model3D.rotationSpeed">Rotation Speed</label>
              <input
                type="number"
                id="model3D.rotationSpeed"
                name="model3D.rotationSpeed"
                value={formData.model3D.rotationSpeed}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="0.1"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Animation Settings</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="animations.titleAnimation">Title Animation</label>
              <select
                id="animations.titleAnimation"
                name="animations.titleAnimation"
                value={formData.animations.titleAnimation}
                onChange={handleChange}
              >
                <option value="fadeInUp">Fade In Up</option>
                <option value="fadeInLeft">Fade In Left</option>
                <option value="fadeInRight">Fade In Right</option>
                <option value="scaleIn">Scale In</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="animations.imageAnimation">Image Animation</label>
              <select
                id="animations.imageAnimation"
                name="animations.imageAnimation"
                value={formData.animations.imageAnimation}
                onChange={handleChange}
              >
                <option value="fadeIn">Fade In</option>
                <option value="fadeInLeft">Fade In Left</option>
                <option value="fadeInRight">Fade In Right</option>
                <option value="scaleIn">Scale In</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default HeroEditor;