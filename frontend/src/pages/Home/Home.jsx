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
    loading 
  } = useContent();
  
  const smoothScrollRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP smooth scroll
    smoothScrollRef.current = initSmoothScroll();

    return () => {
      if (smoothScrollRef.current) {
        smoothScrollRef.current.kill();
      }
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <Navbar />
        
        <main className={styles.main}>
          <HeroSection data={hero} />
          <JourneySection data={journey} />
          <TimelineSection data={timeline} />
          <SkillsSection data={skills} />
          <ServicesSection data={services} />
          <ProjectsSection data={projects} />
          <CertificationsSection data={certifications} />
          {blogs && blogs.length > 0 && <BlogSection data={blogs} />}
          <ContactSection />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Home;