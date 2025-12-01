// frontend/src/components/home/SkillsSection/SkillsSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoMarquee from './LogoMarquee';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = ({ data }) => {
  const sectionRef = useRef(null);

  // Debug: Log data
  useEffect(() => {
    console.log('Skills Section Data:', data);
    console.log('Skills Data Type:', typeof data);
    console.log('Is Array?', Array.isArray(data));
    console.log('Skills Length:', data?.length);
  }, [data]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  // Group skills by category
  const categories = {
    frontend: data?.filter((s) => s.category === 'frontend') || [],
    backend: data?.filter((s) => s.category === 'backend') || [],
    database: data?.filter((s) => s.category === 'database') || [],
    tools: data?.filter((s) => s.category === 'tools') || [],
    other: data?.filter((s) => s.category === 'other') || [],
  };

  // Always render the section
  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <h2 className={styles.title}>Skills & Technologies</h2>
        <p className={styles.subtitle}>My technical expertise and tools I work with</p>
        
        {!data || data.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            No skills available yet. Check back soon!
          </div>
        ) : (
          <>
            {/* All skills marquee */}
            <LogoMarquee skills={data.filter((s) => s.displayInMarquee !== false)} />

            {/* Categorized skills */}
            <div className={styles.categories}>
              {Object.entries(categories).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} className={styles.category}>
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div className={styles.skillGrid}>
                      {skills.map((skill) => (
                        <div key={skill._id} className={styles.skillCard}>
                          {skill.logo?.url ? (
                            <img src={skill.logo.url} alt={skill.name} />
                          ) : (
                            <div className={styles.placeholderLogo}>
                              {skill.name.charAt(0)}
                            </div>
                          )}
                          <span>{skill.name}</span>
                          {skill.proficiency && (
                            <div className={styles.proficiency}>
                              <div
                                className={styles.proficiencyBar}
                                style={{ width: `${skill.proficiency}%` }}
                              />
                              <span className={styles.proficiencyText}>
                                {skill.proficiency}%
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;