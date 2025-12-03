// frontend/src/components/admin/ContactEditor/ContactEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import styles from './ContactEditor.module.css';

const PLATFORM_ICONS = {
  github: 'fa-github',
  linkedin: 'fa-linkedin',
  twitter: 'fa-x-twitter',
  leetcode: 'fa-code',
  geeksforgeeks: 'fa-code',
  instagram: 'fa-instagram',
  facebook: 'fa-facebook',
  youtube: 'fa-youtube',
  medium: 'fa-medium',
  dev: 'fa-dev',
  stackoverflow: 'fa-stack-overflow',
  codepen: 'fa-codepen',
  dribbble: 'fa-dribbble',
  behance: 'fa-behance'
};

const ContactEditor = () => {
  const { contact, refreshContent } = useContent();
  const [formData, setFormData] = useState({
    title: 'Get In Touch',
    subtitle: "Have a project in mind? Let's discuss how I can help you.",
    location: {
      city: '',
      country: '',
      icon: 'fa-location-dot'
    },
    formEnabled: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Social Link Form
  const [socialForm, setSocialForm] = useState({
    platform: 'github',
    url: '',
    icon: 'fa-github',
    order: 0
  });
  const [editingSocial, setEditingSocial] = useState(null);

  // Email Form
  const [emailForm, setEmailForm] = useState({
    label: '',
    email: '',
    isPrimary: false,
    order: 0
  });
  const [editingEmail, setEditingEmail] = useState(null);

  // Phone Form
  const [phoneForm, setPhoneForm] = useState({
    label: '',
    number: '',
    isPrimary: false,
    showWhatsApp: false,
    order: 0
  });
  const [editingPhone, setEditingPhone] = useState(null);

  useEffect(() => {
    if (contact) {
      setFormData({
        title: contact.title || 'Get In Touch',
        subtitle: contact.subtitle || "Have a project in mind? Let's discuss how I can help you.",
        location: contact.location || { city: '', country: '', icon: 'fa-location-dot' },
        formEnabled: contact.formEnabled !== undefined ? contact.formEnabled : true
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/contact', formData);
      await refreshContent();
      setMessage({ type: 'success', text: 'Contact information updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update contact information'
      });
    } finally {
      setLoading(false);
    }
  };

  // Social Link Handlers
  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingSocial) {
        await api.put(`/contact/social/${editingSocial}`, socialForm);
        setMessage({ type: 'success', text: 'Social link updated!' });
      } else {
        await api.post('/contact/social', socialForm);
        setMessage({ type: 'success', text: 'Social link added!' });
      }
      await refreshContent();
      setSocialForm({ platform: 'github', url: '', icon: 'fa-github', order: 0 });
      setEditingSocial(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save social link' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocial = async (id) => {
    if (!window.confirm('Delete this social link?')) return;
    
    try {
      await api.delete(`/contact/social/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Social link deleted!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete social link' });
    }
  };

  const handleEditSocial = (link) => {
    setEditingSocial(link._id);
    setSocialForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      order: link.order
    });
  };

  // Email Handlers
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingEmail) {
        await api.put(`/contact/email/${editingEmail}`, emailForm);
        setMessage({ type: 'success', text: 'Email updated!' });
      } else {
        await api.post('/contact/email', emailForm);
        setMessage({ type: 'success', text: 'Email added!' });
      }
      await refreshContent();
      setEmailForm({ label: '', email: '', isPrimary: false, order: 0 });
      setEditingEmail(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save email' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async (id) => {
    if (!window.confirm('Delete this email?')) return;
    
    try {
      await api.delete(`/contact/email/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Email deleted!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete email' });
    }
  };

  const handleEditEmail = (email) => {
    setEditingEmail(email._id);
    setEmailForm({
      label: email.label,
      email: email.email,
      isPrimary: email.isPrimary,
      order: email.order
    });
  };

  // Phone Handlers
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingPhone) {
        await api.put(`/contact/phone/${editingPhone}`, phoneForm);
        setMessage({ type: 'success', text: 'Phone updated!' });
      } else {
        await api.post('/contact/phone', phoneForm);
        setMessage({ type: 'success', text: 'Phone added!' });
      }
      await refreshContent();
      setPhoneForm({ label: '', number: '', isPrimary: false, showWhatsApp: false, order: 0 });
      setEditingPhone(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save phone' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhone = async (id) => {
    if (!window.confirm('Delete this phone number?')) return;
    
    try {
      await api.delete(`/contact/phone/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Phone deleted!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete phone' });
    }
  };

  const handleEditPhone = (phone) => {
    setEditingPhone(phone._id);
    setPhoneForm({
      label: phone.label,
      number: phone.number,
      isPrimary: phone.isPrimary,
      showWhatsApp: phone.showWhatsApp,
      order: phone.order
    });
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Contact Management</h2>
        <p>Manage your contact information and social links</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Main Contact Info */}
      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formSection}>
          <h3>Contact Section Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="title">Section Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subtitle">Subtitle</label>
            <textarea
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="location.city">City</label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="Your City"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location.country">Country</label>
              <input
                type="text"
                id="location.country"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Your Country"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="formEnabled"
                checked={formData.formEnabled}
                onChange={handleChange}
              />
              <span>Enable Contact Form</span>
            </label>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Saving...' : 'Update Contact Info'}
          </button>
        </div>
      </form>

      {/* Emails Section */}
      <div className={styles.formSection}>
        <h3>Email Addresses</h3>
        <form onSubmit={handleEmailSubmit} className={styles.miniForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Label (e.g., Work, Personal)"
                value={emailForm.label}
                onChange={(e) => setEmailForm({...emailForm, label: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="email@example.com"
                value={emailForm.email}
                onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={emailForm.isPrimary}
                  onChange={(e) => setEmailForm({...emailForm, isPrimary: e.target.checked})}
                />
                <span>Primary Email</span>
              </label>
            </div>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="Order"
                value={emailForm.order}
                onChange={(e) => setEmailForm({...emailForm, order: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            {editingEmail ? 'Update' : 'Add'} Email
          </button>
          {editingEmail && (
            <button
              type="button"
              onClick={() => { setEditingEmail(null); setEmailForm({ label: '', email: '', isPrimary: false, order: 0 }); }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </form>

        <div className={styles.itemsList}>
          {contact?.emails?.map((email) => (
            <div key={email._id} className={styles.listItem}>
              <div>
                <strong>{email.label}</strong>: {email.email}
                {email.isPrimary && <span className={styles.badge}>Primary</span>}
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => handleEditEmail(email)} className={styles.editBtn}>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button onClick={() => handleDeleteEmail(email._id)} className={styles.deleteBtn}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone Numbers Section */}
      <div className={styles.formSection}>
        <h3>Phone Numbers</h3>
        <form onSubmit={handlePhoneSubmit} className={styles.miniForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Label (e.g., Mobile, Office)"
                value={phoneForm.label}
                onChange={(e) => setPhoneForm({...phoneForm, label: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="tel"
                placeholder="+1234567890"
                value={phoneForm.number}
                onChange={(e) => setPhoneForm({...phoneForm, number: e.target.value})}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={phoneForm.isPrimary}
                  onChange={(e) => setPhoneForm({...phoneForm, isPrimary: e.target.checked})}
                />
                <span>Primary</span>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={phoneForm.showWhatsApp}
                  onChange={(e) => setPhoneForm({...phoneForm, showWhatsApp: e.target.checked})}
                />
                <span>Show WhatsApp</span>
              </label>
            </div>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="Order"
                value={phoneForm.order}
                onChange={(e) => setPhoneForm({...phoneForm, order: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            {editingPhone ? 'Update' : 'Add'} Phone
          </button>
          {editingPhone && (
            <button
              type="button"
              onClick={() => { setEditingPhone(null); setPhoneForm({ label: '', number: '', isPrimary: false, showWhatsApp: false, order: 0 }); }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </form>

        <div className={styles.itemsList}>
          {contact?.phoneNumbers?.map((phone) => (
            <div key={phone._id} className={styles.listItem}>
              <div>
                <strong>{phone.label}</strong>: {phone.number}
                {phone.isPrimary && <span className={styles.badge}>Primary</span>}
                {phone.showWhatsApp && <span className={styles.badge}>WhatsApp</span>}
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => handleEditPhone(phone)} className={styles.editBtn}>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button onClick={() => handleDeletePhone(phone._id)} className={styles.deleteBtn}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Section */}
      <div className={styles.formSection}>
        <h3>Social Links</h3>
        <form onSubmit={handleSocialSubmit} className={styles.miniForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <select
                value={socialForm.platform}
                onChange={(e) => setSocialForm({
                  ...socialForm,
                  platform: e.target.value,
                  icon: PLATFORM_ICONS[e.target.value]
                })}
              >
                {Object.keys(PLATFORM_ICONS).map(platform => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <input
                type="url"
                placeholder="https://..."
                value={socialForm.url}
                onChange={(e) => setSocialForm({...socialForm, url: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="Order"
                value={socialForm.order}
                onChange={(e) => setSocialForm({...socialForm, order: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            {editingSocial ? 'Update' : 'Add'} Link
          </button>
          {editingSocial && (
            <button
              type="button"
              onClick={() => { setEditingSocial(null); setSocialForm({ platform: 'github', url: '', icon: 'fa-github', order: 0 }); }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </form>

        <div className={styles.itemsList}>
          {contact?.socialLinks?.sort((a, b) => a.order - b.order).map((link) => (
            <div key={link._id} className={styles.listItem}>
              <div>
                <i className={`fa-brands ${link.icon}`}></i>
                <strong>{link.platform}</strong>: {link.url}
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => handleEditSocial(link)} className={styles.editBtn}>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button onClick={() => handleDeleteSocial(link._id)} className={styles.deleteBtn}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactEditor;