// frontend/src/components/admin/AdminNav/AdminNav.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './AdminNav.module.css';

const AdminNav = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'hero', label: 'Hero Section', icon: 'fa-house' },
    { id: 'journey', label: 'Journey', icon: 'fa-person-biking' },
    { id: 'timeline', label: 'Timeline', icon: 'fa-calendar-days' },
    { id: 'skills', label: 'Skills', icon: 'fa-code' },
    { id: 'services', label: 'Services', icon: 'fa-gears' }, // ADDED
    { id: 'projects', label: 'Projects', icon: 'fa-folder-open' },
    { id: 'certifications', label: 'Certifications', icon: 'fa-certificate' },
    { id: 'contact', label: 'Contact', icon: 'fa-address-book' },
    { id: 'blog', label: 'Blog', icon: 'fa-pen-to-square' },
    { id: 'theme', label: 'Theme', icon: 'fa-palette' },
  ];

  return (
    <nav className={styles.adminNav}>
      <div className={styles.navHeader}>
        <h2 className={styles.navTitle}>Admin Panel</h2>
        <Link to="/" className={styles.viewSiteLink}>
          <i className="fa-solid fa-arrow-up-right-from-square"></i> View Site
        </Link>
      </div>

      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`${styles.navItem} ${
                activeTab === item.id ? styles.active : ''
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.navIcon}>
                <i className={`fa-solid ${item.icon}`}></i>
              </span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <button className={styles.logoutButton} onClick={logout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default AdminNav;