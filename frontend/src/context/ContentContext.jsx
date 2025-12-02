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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchAllContent = async () => {
      console.log('🔄 [ContentContext] Starting initial fetch...');
      setLoading(true);
      
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

        // Process and validate data
        const heroData = heroRes.data.data || null;
        const journeyData = journeyRes.data.data || null;
        const timelineData = timelineRes.data.data || null;
        const skillsData = Array.isArray(skillsRes.data.data) ? skillsRes.data.data : [];
        const servicesData = Array.isArray(servicesRes.data.data) ? servicesRes.data.data : [];
        const projectsData = Array.isArray(projectsRes.data.data) ? projectsRes.data.data : [];
        const certificationsData = Array.isArray(certificationsRes.data.data) ? certificationsRes.data.data : [];
        const blogsData = Array.isArray(blogsRes.data.data) ? blogsRes.data.data : [];

        console.log('✅ [ContentContext] Content fetched:', {
          hero: !!heroData,
          journey: !!journeyData,
          timeline: !!timelineData,
          skills: skillsData.length,
          services: servicesData.length,
          projects: projectsData.length,
          certifications: certificationsData.length,
          blogs: blogsData.length
        });

        // Update all state
        setHero(heroData);
        setJourney(journeyData);
        setTimeline(timelineData);
        setSkills(skillsData);
        setServices(servicesData);
        setProjects(projectsData);
        setCertifications(certificationsData);
        setBlogs(blogsData);
        
        console.log('✅ [ContentContext] State updated successfully');
        
      } catch (error) {
        console.error('❌ [ContentContext] Failed to fetch content:', error);
        // Set empty arrays on error
        setSkills([]);
        setServices([]);
        setProjects([]);
        setCertifications([]);
        setBlogs([]);
      } finally {
        // CRITICAL: Set these AFTER state updates
        setLoading(false);
        setIsInitialized(true);
        console.log('✅ [ContentContext] Initialization complete');
      }
    };

    fetchAllContent();
  }, []); // Only run once on mount

  const refreshContent = async () => {
    console.log('🔄 [ContentContext] Refreshing content...');
    setLoading(true);
    
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
        api.get('/hero').catch(() => ({ data: { data: null } })),
        api.get('/journey').catch(() => ({ data: { data: null } })),
        api.get('/timeline').catch(() => ({ data: { data: null } })),
        api.get('/skills').catch(() => ({ data: { data: [] } })),
        api.get('/services').catch(() => ({ data: { data: [] } })),
        api.get('/projects').catch(() => ({ data: { data: [] } })),
        api.get('/certifications').catch(() => ({ data: { data: [] } })),
        api.get('/blogs?published=true').catch(() => ({ data: { data: [] } })),
      ]);

      const projectsData = Array.isArray(projectsRes.data.data) ? projectsRes.data.data : [];
      
      console.log('✅ [ContentContext] Refresh complete - Projects:', projectsData.length);

      setHero(heroRes.data.data || null);
      setJourney(journeyRes.data.data || null);
      setTimeline(timelineRes.data.data || null);
      setSkills(Array.isArray(skillsRes.data.data) ? skillsRes.data.data : []);
      setServices(Array.isArray(servicesRes.data.data) ? servicesRes.data.data : []);
      setProjects(projectsData);
      setCertifications(Array.isArray(certificationsRes.data.data) ? certificationsRes.data.data : []);
      setBlogs(Array.isArray(blogsRes.data.data) ? blogsRes.data.data : []);
      
    } catch (error) {
      console.error('❌ [ContentContext] Refresh failed:', error);
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
    isInitialized,
    refreshContent,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};