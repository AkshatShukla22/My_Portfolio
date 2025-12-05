// frontend/src/components/home/SkillsSection/LogoMarquee.jsx
import { useEffect, useRef } from 'react';
import styles from './LogoMarquee.module.css';

const LogoMarquee = ({ skills }) => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Duplicate items for seamless loop
    const items = marquee.querySelectorAll(`.${styles.marqueeItem}`);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      marquee.appendChild(clone);
    });

  }, [skills]);

  if (!skills || skills.length === 0) return null;

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack} ref={marqueeRef}>
        {skills.map((skill, index) => (
          <div key={`${skill._id}-${index}`} className={styles.marqueeItem}>
            <div className={styles.iconCircle}>
              {/* Priority: Font Awesome Icon > Uploaded Image > Fallback Letter */}
              {skill.fontAwesomeIcon ? (
                <i className={skill.fontAwesomeIcon}></i>
              ) : skill.logo?.url ? (
                <img 
                  src={skill.logo.url} 
                  alt={skill.name}
                  onError={(e) => {
                    // If image fails to load, show fallback
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement.querySelector('.fallback-letter');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback letter placeholder */}
              <span 
                className="fallback-letter"
                style={{
                  display: (skill.fontAwesomeIcon || skill.logo?.url) ? 'none' : 'flex',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {skill.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={styles.skillName}>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;