// frontend/src/components/home/SkillsSection/SkillsSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoMarquee from './LogoMarquee';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = ({ data }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // Debug: Log data
  useEffect(() => {
    console.log('🔍 Skills Section Received Data:', data);
    console.log('📊 Skills Data Type:', typeof data);
    console.log('✅ Is Array?', Array.isArray(data));
    console.log('📏 Skills Length:', data?.length);
    if (data && data.length > 0) {
      console.log('📝 First Skill:', data[0]);
      console.log('🖼️ First Skill Logo:', data[0].logo);
    }
  }, [data]);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Ensure data is an array
  const skillsArray = Array.isArray(data) ? data : [];

  // Group skills by category
  const categories = {
    frontend: skillsArray.filter((s) => s.category === 'frontend'),
    backend: skillsArray.filter((s) => s.category === 'backend'),
    database: skillsArray.filter((s) => s.category === 'database'),
    tools: skillsArray.filter((s) => s.category === 'tools'),
    other: skillsArray.filter((s) => s.category === 'other'),
  };

  console.log('📂 Categories:', {
    frontend: categories.frontend.length,
    backend: categories.backend.length,
    database: categories.database.length,
    tools: categories.tools.length,
    other: categories.other.length,
  });

  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <h2 ref={titleRef} className={styles.title}>Skills & Technologies</h2>
        
        {skillsArray.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <p>🚀 No skills available yet.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Add your first skill from the admin panel!
            </p>
          </div>
        ) : (
          <>
            {/* All skills marquee */}
            <LogoMarquee skills={skillsArray.filter((s) => s.displayInMarquee !== false)} />

            {/* Categorized skills */}
            <div className={styles.categories}>
              {Object.entries(categories).map(([category, skills]) => {
                if (skills.length === 0) return null;
                
                return (
                  <div key={category} className={styles.category}>
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div className={styles.skillGrid}>
                      {skills.map((skill) => {
                        console.log(`🎨 Rendering ${skill.name}:`, {
                          hasLogo: !!skill.logo,
                          logoUrl: skill.logo?.url,
                          hasFontAwesome: !!skill.fontAwesomeIcon,
                        });

                        return (
                          <div key={skill._id} className={styles.skillCard}>
                            {/* FIXED: Show uploaded image first, then Font Awesome, then fallback */}
                            {skill.logo?.url ? (
                              <img 
                                src={skill.logo.url} 
                                alt={skill.name}
                                className={styles.skillLogo}
                                onError={(e) => {
                                  console.error('❌ Image load error:', skill.name, skill.logo.url);
                                  e.target.style.display = 'none';
                                  // Show fallback after image error
                                  e.target.parentElement.querySelector('.fallback')?.style.setProperty('display', 'flex', 'important');
                                }}
                              />
                            ) : skill.fontAwesomeIcon ? (
                              <i 
                                className={skill.fontAwesomeIcon}
                                style={{
                                  fontSize: '3.5rem',
                                  display: 'block',
                                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}
                              ></i>
                            ) : null}
                            
                            {/* Fallback placeholder (hidden by default, shown on image error) */}
                            <div 
                              className={`${styles.placeholderLogo} fallback`}
                              style={{ display: skill.logo?.url ? 'none' : 'flex' }}
                            >
                              {skill.name.charAt(0).toUpperCase()}
                            </div>

                            <span className={styles.skillName}>{skill.name}</span>
                            
                            {skill.proficiency && skill.proficiency > 0 && (
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;