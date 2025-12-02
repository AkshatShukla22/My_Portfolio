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

  const skillsArray = Array.isArray(data) ? data : [];
  const categories = {
    frontend: skillsArray.filter((s) => s.category === 'frontend'),
    backend: skillsArray.filter((s) => s.category === 'backend'),
    database: skillsArray.filter((s) => s.category === 'database'),
    tools: skillsArray.filter((s) => s.category === 'tools'),
    other: skillsArray.filter((s) => s.category === 'other'),
  };

  return (
    <section ref={sectionRef} className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        <h2 ref={titleRef} className={styles.title}>Skills & Technologies</h2>
        
        {skillsArray.length > 0 && (
          <>
            {/* Beautiful Marquee */}
            <LogoMarquee skills={skillsArray.filter((s) => s.displayInMarquee !== false)} />

            {/* Categorized skills grid */}
            <div className={styles.categories}>
              {Object.entries(categories).map(([category, skills]) => {
                if (skills.length === 0) return null;
                
                return (
                  <div key={category} className={styles.category}>
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div className={styles.skillGrid}>
                      {skills.map((skill) => (
                        <div key={skill._id} className={styles.skillCard}>
                          {skill.fontAwesomeIcon ? (
                            <i 
                              className={skill.fontAwesomeIcon}
                              style={{
                                fontSize: '3rem',
                                display: 'block',
                                marginBottom: '0.5rem',
                                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                              }}
                            ></i>
                          ) : skill.logo?.url ? (
                            <img src={skill.logo.url} alt={skill.name} />
                          ) : (
                            <div className={styles.placeholderLogo}>
                              {skill.name.charAt(0).toUpperCase()}
                            </div>
                          )}
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
                      ))}
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