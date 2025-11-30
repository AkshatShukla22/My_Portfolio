// frontend/src/components/admin/AdminNav/AdminNav.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './AdminNav.module.css';

const AdminNav = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'journey', label: 'Journey', icon: '🚴' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'skills', label: 'Skills', icon: '💻' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'certifications', label: 'Certifications', icon: '🎓' },
    { id: 'blog', label: 'Blog', icon: '✍️' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
  ];

  return (
    <nav className={styles.adminNav}>
      <div className={styles.navHeader}>
        <h2 className={styles.navTitle}>Admin Panel</h2>
        <Link to="/" className={styles.viewSiteLink}>
          View Site →
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
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <button className={styles.logoutButton} onClick={logout}>
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default AdminNav;