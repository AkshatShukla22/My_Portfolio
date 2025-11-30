// frontend/src/components/home/TimelineSection/TimelineSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TimelineSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = ({ data }) => {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!data || !data.items || data.items.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate road drawing
      gsap.fromTo(
        roadRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );

      // Animate timeline items
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.from(item, {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: 0.5 + index * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.timelineSection} id="timeline">
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title || 'My Timeline'}</h2>

        <div className={styles.timelineWrapper}>
          <div ref={roadRef} className={styles.timelineRoad} />

          <div className={styles.timelineItems}>
            {data.items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div
                  key={item._id || index}
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={`${styles.timelineItem} ${
                    index % 2 === 0 ? styles.left : styles.right
                  }`}
                >
                  <div className={styles.timelineDot}>
                    {item.icon && <span>{item.icon}</span>}
                  </div>

                  <div className={styles.timelineContent}>
                    <span className={styles.year}>{item.year}</span>
                    <h3>{item.title}</h3>
                    {item.subtitle && <h4>{item.subtitle}</h4>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;