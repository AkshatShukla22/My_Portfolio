// frontend/src/components/common/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import { useContent } from '../../../context/ContentContext';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { contact } = useContent();

  const primaryEmail = contact?.emails?.find(e => e.isPrimary) || contact?.emails?.[0];
  const primaryPhone = contact?.phoneNumbers?.find(p => p.isPrimary) || contact?.phoneNumbers?.[0];
  
  const sortedSocialLinks = contact?.socialLinks 
    ? [...contact.socialLinks].sort((a, b) => a.order - b.order)
    : [];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.brandName}>Portfolio</h3>
            <p className={styles.tagline}>
              Crafting digital experiences with passion and precision.
            </p>
            {sortedSocialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                {sortedSocialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                  >
                    <i className={`fa-brands ${link.icon}`}></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <button onClick={scrollToTop}>
                  <i className="fa-solid fa-house"></i> Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('journey')}>
                  <i className="fa-solid fa-person-biking"></i> Journey
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('projects')}>
                  <i className="fa-solid fa-folder-open"></i> Projects
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')}>
                  <i className="fa-solid fa-address-book"></i> Contact
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Services</h4>
            <ul className={styles.linkList}>
              <li>
                <i className="fa-solid fa-code"></i> Web Development
              </li>
              <li>
                <i className="fa-solid fa-pen-ruler"></i> UI/UX Design
              </li>
              <li>
                <i className="fa-solid fa-gears"></i> API Development
              </li>
              <li>
                <i className="fa-solid fa-user-tie"></i> Consulting
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Get In Touch</h4>
            <ul className={styles.contactList}>
              {primaryEmail && (
                <li>
                  <i className="fa-solid fa-envelope"></i>
                  <a href={`mailto:${primaryEmail.email}`}>{primaryEmail.email}</a>
                </li>
              )}
              {primaryPhone && (
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <a href={`tel:${primaryPhone.number}`}>{primaryPhone.number}</a>
                </li>
              )}
              {contact?.location && (contact.location.city || contact.location.country) && (
                <li>
                  <i className={`fa-solid ${contact.location.icon || 'fa-location-dot'}`}></i>
                  <span>
                    {contact.location.city}
                    {contact.location.city && contact.location.country && ', '}
                    {contact.location.country}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <button
        className={styles.scrollTopBtn}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;