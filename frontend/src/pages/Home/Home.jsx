// frontend/src/pages/Home/Home.jsx
import { useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { refreshScrollTrigger } from '../../utils/animations';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import JourneySection from '../../components/home/JourneySection/JourneySection';
import TimelineSection from '../../components/home/TimelineSection/TimelineSection';
import ExperienceSection from '../../components/home/ExperienceSection/ExperienceSection';
import SkillsSection from '../../components/home/SkillsSection/SkillsSection';
import ServicesSection from '../../components/home/ServicesSection/ServicesSection';
import ProjectsSection from '../../components/home/ProjectsSection/ProjectsSection';
import CertificationsSection from '../../components/home/CertificationsSection/CertificationsSection';
import BlogSection from '../../components/home/BlogSection/BlogSection';
import ContactSection from '../../components/home/ContactSection/ContactSection';
import Loader from '../../components/common/Loader/Loader';
import styles from './Home.module.css';

const Home = () => {
  const { 
    hero, 
    journey, 
    timeline, 
    experiences,
    skills, 
    services, 
    projects, 
    certifications, 
    blogs, 
    loading,
    isInitialized
  } = useContent();

  // Refresh ScrollTrigger after content loads
  useEffect(() => {
    if (isInitialized && !loading) {
      // Small delay to ensure all content is rendered
      const timer = setTimeout(() => {
        refreshScrollTrigger();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, loading]);

  // Show loader until content is ready
  if (!isInitialized || loading) {
    return <Loader />;
  }

  return (
    <div className={styles.homeWrapper}>
      <Navbar />
      
      <main className={styles.main}>
        {/* All sections rendered - no conditional hiding */}
        {hero && <HeroSection data={hero} />}
        {journey && <JourneySection data={journey} />}
        {timeline && <TimelineSection data={timeline} />}
        {experiences && experiences.length > 0 && <ExperienceSection data={experiences} />}
        {skills && skills.length > 0 && <SkillsSection data={skills} />}
        {services && services.length > 0 && <ServicesSection data={services} />}
        <ProjectsSection data={projects} />
        {certifications && certifications.length > 0 && <CertificationsSection data={certifications} />}
        {blogs && blogs.length > 0 && <BlogSection data={blogs} />}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;