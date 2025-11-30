// frontend/src/pages/Admin/AdminDashboard.jsx
import { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav/AdminNav';
import HeroEditor from '../../components/admin/HeroEditor/HeroEditor';
import JourneyEditor from '../../components/admin/JourneyEditor/JourneyEditor';
import TimelineEditor from '../../components/admin/TimelineEditor/TimelineEditor';
import SkillsEditor from '../../components/admin/SkillsEditor/SkillsEditor';
import ProjectsEditor from '../../components/admin/ProjectsEditor/ProjectsEditor';
import CertificationsEditor from '../../components/admin/CertificationsEditor/CertificationsEditor';
import BlogEditor from '../../components/admin/BlogEditor/BlogEditor';
import ThemeEditor from '../../components/admin/ThemeEditor/ThemeEditor';
import styles from './Admin.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroEditor />;
      case 'journey':
        return <JourneyEditor />;
      case 'timeline':
        return <TimelineEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'certifications':
        return <CertificationsEditor />;
      case 'blog':
        return <BlogEditor />;
      case 'theme':
        return <ThemeEditor />;
      default:
        return <HeroEditor />;
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className={styles.adminContent}>
        <div className={styles.contentWrapper}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;