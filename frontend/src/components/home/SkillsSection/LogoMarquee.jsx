// frontend/src/components/home/SkillsSection/LogoMarquee.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './SkillsSection.module.css';

const LogoMarquee = ({ skills }) => {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!marqueeRef.current || !skills || skills.length === 0) return;

    const marquee = marqueeRef.current;
    const marqueeContent = marquee.querySelector(`.${styles.marqueeContent}`);
    
    if (!marqueeContent) return;

    // Clone for seamless loop
    const clone = marqueeContent.cloneNode(true);
    marquee.appendChild(clone);

    // Calculate animation duration based on content width
    const contentWidth = marqueeContent.offsetWidth;
    const duration = contentWidth / 50; // Adjust speed by changing divisor

    // Animate
    animationRef.current = gsap.to([marqueeContent, clone], {
      x: -contentWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    };
  }, [skills]);

  if (!skills || skills.length === 0) return null;

  return (
    <div className={styles.marquee} ref={marqueeRef}>
      <div className={styles.marqueeContent}>
        {skills.map((skill) => (
          <div key={skill._id} className={styles.marqueeItem}>
            {skill.logo?.url ? (
              <img src={skill.logo.url} alt={skill.name} title={skill.name} />
            ) : (
              <span className={styles.marqueeText}>{skill.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;