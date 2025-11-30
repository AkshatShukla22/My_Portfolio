// frontend/src/components/common/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Portfolio</span>
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
        </button>

        <ul
          className={`${styles.navLinks} ${
            isMobileMenuOpen ? styles.mobileOpen : ''
          }`}
        >
          <li>
            <button onClick={() => scrollToSection('hero')}>Home</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('journey')}>Journey</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('timeline')}>Timeline</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('services')}>Services</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;