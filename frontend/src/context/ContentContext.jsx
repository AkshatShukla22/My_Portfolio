// frontend/src/context/ContentContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [hero, setHero] = useState(null);
  const [journey, setJourney] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [
        heroRes,
        journeyRes,
        timelineRes,
        skillsRes,
        servicesRes,
        projectsRes,
        certificationsRes,
        blogsRes,
      ] = await Promise.all([
        api.get('/hero'),
        api.get('/journey'),
        api.get('/timeline'),
        api.get('/skills'),
        api.get('/services'),
        api.get('/projects'),
        api.get('/certifications'),
        api.get('/blogs?published=true'),
      ]);

      setHero(heroRes.data.data);
      setJourney(journeyRes.data.data);
      setTimeline(timelineRes.data.data);
      setSkills(skillsRes.data.data);
      setServices(servicesRes.data.data);
      setProjects(projectsRes.data.data);
      setCertifications(certificationsRes.data.data);
      setBlogs(blogsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    hero,
    journey,
    timeline,
    skills,
    services,
    projects,
    certifications,
    blogs,
    loading,
    refreshContent: fetchAllContent,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};