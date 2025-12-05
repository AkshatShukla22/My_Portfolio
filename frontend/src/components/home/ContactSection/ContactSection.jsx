// frontend/src/components/home/ContactSection/ContactSection.jsx
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import styles from './ContactSection.module.css';

const ContactSection = () => {
  const { contact } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact/submit', formData);

      setStatus({
        type: 'success',
        message: 'Message sent successfully! I will get back to you soon.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const primaryEmail = contact?.emails?.find(e => e.isPrimary) || contact?.emails?.[0];
  const primaryPhone = contact?.phoneNumbers?.find(p => p.isPrimary) || contact?.phoneNumbers?.[0];
  
  const sortedSocialLinks = contact?.socialLinks 
    ? [...contact.socialLinks].sort((a, b) => a.order - b.order)
    : [];

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (!contact) return null;

  return (
    <section ref={sectionRef} className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <div className={styles.contactHeader}>
          <h2 className={styles.title}>{contact.title || 'Get In Touch'}</h2>
          <p className={styles.subtitle}>
            {contact.subtitle || "Have a project in mind? Let's discuss how I can help you."}
          </p>
        </div>

        <div className={styles.contactContent}>
          {contact.formEnabled && (
            <form ref={formRef} onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Project Inquiry"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status.message && (
                <div className={`${styles.statusMessage} ${status.type === 'success' ? styles.success : styles.error}`}>
                  {status.message}
                </div>
              )}

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}

          <div className={styles.contactInfo}>
            {contact.emails && contact.emails.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className={styles.infoContent}>
                  <h3>Email</h3>
                  {contact.emails.sort((a, b) => a.order - b.order).map((email) => (
                    <p 
                      key={email._id}
                      onClick={() => handleEmailClick(email.email)}
                      className={styles.clickable}
                    >
                      {email.email}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className={styles.infoContent}>
                  <h3>Phone</h3>
                  {contact.phoneNumbers.sort((a, b) => a.order - b.order).map((phone) => (
                    <div key={phone._id} className={styles.phoneItem}>
                      <p 
                        onClick={() => handlePhoneClick(phone.number)}
                        className={styles.clickable}
                      >
                        {phone.number}
                      </p>
                      {phone.showWhatsApp && (
                        <button
                          onClick={() => handleWhatsAppClick(phone.number)}
                          className={styles.whatsappBtn}
                          aria-label="Contact via WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contact.location && (contact.location.city || contact.location.country) && (
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <i className={`fa-solid ${contact.location.icon || 'fa-location-dot'}`}></i>
                </div>
                <div className={styles.infoContent}>
                  <h3>Location</h3>
                  <p>{contact.location.city}{contact.location.city && contact.location.country && ', '}{contact.location.country}</p>
                </div>
              </div>
            )}

            {sortedSocialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                <h3>Connect With Me</h3>
                <div className={styles.socialIcons}>
                  {sortedSocialLinks.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className={styles.socialIcon}
                      title={link.platform}
                    >
                      <i className={`fa-brands ${link.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;