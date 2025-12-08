// frontend/src/components/home/ExperienceSection/ExperienceSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ExperienceSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { clearProps: "all" });
      
      gsap.from(cardsRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        onComplete: () => {
          gsap.set(cardsRef.current, { opacity: 1, x: 0 });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || data.length === 0) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <section ref={sectionRef} className={styles.experienceSection} id="experience">
      <div className={styles.container}>
        <h2 className={styles.title}>Work Experience</h2>
        <p className={styles.subtitle}>My professional journey and roles</p>

        <div className={styles.timeline}>
          {data
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((exp, index) => (
              <div
                key={exp._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={styles.experienceCard}
              >
                <div className={styles.cardHeader}>
                  {exp.companyLogo?.url ? (
                    <div className={styles.companyLogo}>
                      <img src={exp.companyLogo.url} alt={exp.company} />
                    </div>
                  ) : (
                    <div className={styles.companyIcon}>
                      <i className="fas fa-briefcase"></i>
                    </div>
                  )}

                  <div className={styles.cardHeaderInfo}>
                    <h3>{exp.title}</h3>
                    <div className={styles.companyInfo}>
                      <span className={styles.company}>
                        <i className="fas fa-building"></i>
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className={styles.location}>
                          <i className="fas fa-map-marker-alt"></i>
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.duration}>
                    <i className="fas fa-calendar-alt"></i>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                  </span>
                  <span className={styles.type}>
                    <i className="fas fa-tag"></i>
                    {exp.type}
                  </span>
                </div>

                {exp.description && (
                  <p className={styles.description}>{exp.description}</p>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className={styles.responsibilities}>
                    <h4>Key Responsibilities:</h4>
                    <ul>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>
                          <i className="fas fa-check-circle"></i>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className={styles.technologies}>
                    {exp.technologies.map((tech, idx) => (
                      <span key={idx} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;