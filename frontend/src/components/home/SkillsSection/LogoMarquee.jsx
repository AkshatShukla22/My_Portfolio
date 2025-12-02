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
              {skill.fontAwesomeIcon ? (
                <i className={skill.fontAwesomeIcon}></i>
              ) : skill.logo?.url ? (
                <img src={skill.logo.url} alt={skill.name} />
              ) : (
                <span className={styles.fallbackIcon}>
                  {skill.name.charAt(0)}
                </span>
              )}
            </div>
            <span className={styles.skillName}>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;