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
    setLoading(true);
    try {
      console.log('🔄 Fetching all content...');
      
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
        api.get('/hero').catch(err => {
          console.error('Hero fetch error:', err);
          return { data: { data: null } };
        }),
        api.get('/journey').catch(err => {
          console.error('Journey fetch error:', err);
          return { data: { data: null } };
        }),
        api.get('/timeline').catch(err => {
          console.error('Timeline fetch error:', err);
          return { data: { data: null } };
        }),
        api.get('/skills').catch(err => {
          console.error('Skills fetch error:', err);
          return { data: { data: [] } };
        }),
        api.get('/services').catch(err => {
          console.error('Services fetch error:', err);
          return { data: { data: [] } };
        }),
        api.get('/projects').catch(err => {
          console.error('Projects fetch error:', err);
          return { data: { data: [] } };
        }),
        api.get('/certifications').catch(err => {
          console.error('Certifications fetch error:', err);
          return { data: { data: [] } };
        }),
        api.get('/blogs?published=true').catch(err => {
          console.error('Blogs fetch error:', err);
          return { data: { data: [] } };
        }),
      ]);

      console.log('✅ Content fetched successfully:');
      console.log('Hero:', heroRes.data.data);
      console.log('Journey:', journeyRes.data.data);
      console.log('Timeline:', timelineRes.data.data);
      console.log('Skills:', skillsRes.data.data);
      console.log('Services:', servicesRes.data.data);
      console.log('Projects:', projectsRes.data.data);
      console.log('Certifications:', certificationsRes.data.data);
      console.log('Blogs:', blogsRes.data.data);

      setHero(heroRes.data.data);
      setJourney(journeyRes.data.data);
      setTimeline(timelineRes.data.data);
      setSkills(skillsRes.data.data);
      setServices(servicesRes.data.data);
      setProjects(projectsRes.data.data);
      setCertifications(certificationsRes.data.data);
      setBlogs(blogsRes.data.data);
      
      console.log('✅ All state updated successfully');
    } catch (error) {
      console.error('❌ Failed to fetch content:', error);
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