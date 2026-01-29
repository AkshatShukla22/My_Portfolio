import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { scrollToElement, scrollToTop } from '../../../utils/animations';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate navbar on mount
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = async (sectionId) => {
    // Prevent multiple clicks while navigating
    if (isNavigating) {
      console.log('Navigation in progress, please wait...');
      return;
    }

    setIsNavigating(true);
    setIsMobileMenuOpen(false);

    try {
      // If not on home page, navigate first
      if (location.pathname !== '/') {
        navigate('/');
        
        // Wait for navigation and render
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Now scroll to the section
      const success = await scrollToElement(sectionId, 80, 1.2);
      
      if (!success) {
        console.warn(`Failed to scroll to ${sectionId}, trying fallback...`);
        
        // Fallback: native scroll
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset navigating state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1500);
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToTop(1);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link 
          to="/" 
          className={styles.logo}
          onClick={handleLogoClick}
        >
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
            <button 
              onClick={() => handleNavClick('hero')}
              disabled={isNavigating}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('journey')}
              disabled={isNavigating}
            >
              Journey
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('timeline')}
              disabled={isNavigating}
            >
              Timeline
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('experience')}
              disabled={isNavigating}
            >
              Experience
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('projects')}
              disabled={isNavigating}
            >
              Projects
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('services')}
              disabled={isNavigating}
            >
              Services
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('certifications')}
              disabled={isNavigating}
            >
              Certifications
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('contact')}
              disabled={isNavigating}
            >
              Contact
            </button>
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

      {/* Loading indicator when navigating */}
      {isNavigating && (
        <div className={styles.navigationIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;