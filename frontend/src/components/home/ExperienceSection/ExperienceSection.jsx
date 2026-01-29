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
      
      // Enhanced animation with scale and rotation
      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        rotateX: 10,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        onComplete: () => {
          gsap.set(cardsRef.current, { opacity: 1, y: 0, scale: 1, rotateX: 0 });
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

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  return (
    <section ref={sectionRef} className={styles.experienceSection} id="experience">
      <div className={styles.container}>
        {/* Header with badge */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
            color: 'var(--primary-color)',
            padding: '0.5rem 1.25rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <i className="fas fa-briefcase" style={{ marginRight: '0.5rem' }}></i>
            Career Journey
          </span>
        </div>

        <h2 className={styles.title}>Professional Experience</h2>
        <p className={styles.subtitle}>
          Building innovative solutions and growing through diverse roles
        </p>

        <div className={styles.timeline}>
          {data
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((exp, index) => (
              <div
                key={exp._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={styles.experienceCard}
              >
                {/* Modern header with logo and current badge */}
                <div className={styles.cardHeader}>
                  {exp.companyLogo?.url ? (
                    <div className={styles.companyLogo}>
                      <img src={exp.companyLogo.url} alt={exp.company} />
                    </div>
                  ) : (
                    <div className={styles.companyIcon}>
                      <i className="fas fa-building"></i>
                    </div>
                  )}

                  <div className={styles.cardHeaderInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{exp.title}</h3>
                      {exp.current && (
                        <span style={{
                          background: 'linear-gradient(135deg, #10b981, #34d399)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          letterSpacing: '0.3px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}>
                          <i className="fas fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.35rem', animation: 'pulse 2s infinite' }}></i>
                          CURRENT
                        </span>
                      )}
                    </div>
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

                {/* Enhanced meta section with duration calculation */}
                <div className={styles.cardMeta}>
                  <span className={styles.duration}>
                    <i className="fas fa-calendar-alt"></i>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                  </span>
                  <span className={styles.type}>
                    <i className="fas fa-clock"></i>
                    {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                  </span>
                  <span className={styles.type}>
                    <i className="fas fa-tag"></i>
                    {exp.type}
                  </span>
                </div>

                {/* Description with better formatting */}
                {exp.description && (
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    padding: '1rem 1.25rem',
                    borderRadius: '0.75rem',
                    borderLeft: '3px solid var(--primary-color)',
                    marginBottom: '1.5rem'
                  }}>
                    <p className={styles.description} style={{ margin: 0 }}>
                      {exp.description}
                    </p>
                  </div>
                )}

                {/* Responsibilities with modern styling */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className={styles.responsibilities}>
                    <h4>
                      <i className="fas fa-tasks" style={{ marginRight: '0.5rem', color: 'var(--primary-color)', opacity: 0.7 }}></i>
                      Key Responsibilities
                    </h4>
                    <ul>
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>
                          <i className="fas fa-chevron-right"></i>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies with count badge */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      marginBottom: '0.75rem' 
                    }}>
                      <h4 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: 'var(--text-color)', 
                        opacity: 0.9,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <i className="fas fa-code" style={{ color: 'var(--primary-color)', opacity: 0.7 }}></i>
                        Technologies
                      </h4>
                      <span style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary-color)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        {exp.technologies.length}
                      </span>
                    </div>
                    <div className={styles.technologies}>
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className={styles.techTag}>
                          <i className="fas fa-hashtag" style={{ fontSize: '0.7rem', opacity: 0.6, marginRight: '0.25rem' }}></i>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Footer CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: '1rem',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.95rem',
            marginBottom: '1rem'
          }}>
            Interested in working together?
          </p>
          <a 
            href="#contact" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
            }}
          >
            Let's Connect
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      {/* Add keyframe animation for pulse effect */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
};

export default ExperienceSection;