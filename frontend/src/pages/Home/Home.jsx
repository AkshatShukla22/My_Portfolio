// frontend/src/pages/Home/Home.jsx
import { useEffect, useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import { initSmoothScroll } from '../../utils/animations';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import JourneySection from '../../components/home/JourneySection/JourneySection';
import TimelineSection from '../../components/home/TimelineSection/TimelineSection';
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
    skills, 
    services, 
    projects, 
    certifications, 
    blogs, 
    loading,
    isInitialized
  } = useContent();
  
  const smoothScrollRef = useRef(null);

  // Initialize smooth scroll ONLY after content is loaded
  useEffect(() => {
    if (!isInitialized || loading) return;

    // Wait a bit for all content to render
    const timer = setTimeout(() => {
      smoothScrollRef.current = initSmoothScroll();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (smoothScrollRef.current) {
        smoothScrollRef.current.kill();
      }
    };
  }, [isInitialized, loading]);

  // Show loader until content is ready
  if (!isInitialized || loading) {
    return <Loader />;
  }

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <Navbar />
        
        <main className={styles.main}>
          {hero && <HeroSection data={hero} />}
          {journey && <JourneySection data={journey} />}
          {timeline && <TimelineSection data={timeline} />}
          {skills && skills.length > 0 && <SkillsSection data={skills} />}
          {services && services.length > 0 && <ServicesSection data={services} />}
          
          {/* Always render ProjectsSection */}
          <ProjectsSection data={projects} />
          
          {certifications && certifications.length > 0 && <CertificationsSection data={certifications} />}
          {blogs && blogs.length > 0 && <BlogSection data={blogs} />}
          <ContactSection />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Home;