// frontend/src/components/common/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
          {/* Brand Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.brandName}>Portfolio</h3>
            <p className={styles.tagline}>
              Crafting digital experiences with passion and precision.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <button onClick={scrollToTop}>Home</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('journey')}>Journey</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('projects')}>Projects</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')}>Contact</button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h4>Services</h4>
            <ul className={styles.linkList}>
              <li>Web Development</li>
              <li>UI/UX Design</li>
              <li>API Development</li>
              <li>Consulting</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4>Get In Touch</h4>
            <ul className={styles.contactList}>
              <li>
                <span>📧</span>
                <span>your.email@example.com</span>
              </li>
              <li>
                <span>📱</span>
                <span>+1 (234) 567-8900</span>
              </li>
              <li>
                <span>📍</span>
                <span>City, Country</span>
              </li>
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

      {/* Scroll to Top Button */}
      <button
        className={styles.scrollTopBtn}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;