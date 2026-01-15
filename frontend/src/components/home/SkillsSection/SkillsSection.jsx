// frontend/src/components/home/SkillsSection/SkillsSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoMarquee from './LogoMarquee';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// Category labels matching the editor
const CATEGORY_LABELS = {
  'frontend': 'Frontend Development',
  'backend': 'Backend Development',
  'mobile': 'Mobile Development',
  'database': 'Database & Data Storage',
  'devops': 'DevOps & Cloud',
  'programming': 'Programming Languages',
  'framework': 'Frameworks & Libraries',
  'tools': 'Development Tools',
  'design': 'Design & UI/UX',
  'testing': 'Testing & QA',
  'ai-ml': 'AI & Machine Learning',
  'data-science': 'Data Science & Analytics',
  'blockchain': 'Blockchain & Web3',
  'cybersecurity': 'Cybersecurity',
  'game-dev': 'Game Development',
  'embedded': 'Embedded Systems & IoT',
  'version-control': 'Version Control',
  'soft-skills': 'Soft Skills',
  'languages': 'Spoken Languages',
  'other': 'Other Skills',
};

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

  // Ensure data is an array
  const skillsArray = Array.isArray(data) ? data : [];

  // Group skills by category dynamically
  const groupedSkills = {};
  skillsArray.forEach(skill => {
    const category = skill.category || 'other';
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  // Sort skills within each category by order
  Object.keys(groupedSkills).forEach(category => {
    groupedSkills[category].sort((a, b) => a.order - b.order);
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
            {/* Marquee: Shows Font Awesome icons first, then images */}
            <LogoMarquee skills={skillsArray.filter((s) => s.displayInMarquee !== false)} />

            {/* Categorized skills grid */}
            <div className={styles.categories}>
              {Object.entries(groupedSkills).map(([category, skills]) => {
                if (skills.length === 0) return null;
                
                return (
                  <div key={category} className={styles.category}>
                    <h3>{CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div className={styles.skillGrid}>
                      {skills.map((skill) => (
                        <div key={skill._id} className={styles.skillCard}>
                          {/* GRID PRIORITY: Uploaded Image > Font Awesome Icon > Fallback */}
                          {skill.logo?.url ? (
                            <img 
                              src={skill.logo.url} 
                              alt={skill.name}
                              className={styles.skillLogo}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.fallback');
                                if (fallback) fallback.style.display = 'flex';
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
                          ) : (
                            <div className={`${styles.placeholderLogo} fallback`}>
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