// frontend/src/components/home/TimelineSection/TimelineSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TimelineSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = ({ data }) => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!data || !data.items || data.items.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate the central line
      gsap.fromTo(
        lineRef.current,
        { height: '0%' },
        {
          height: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Animate timeline items with stagger
      itemsRef.current.forEach((item, index) => {
        if (item) {
          const isRight = index % 2 === 0;
          
          gsap.fromTo(
            item,
            {
              x: isRight ? 100 : -100,
              opacity: 0,
              scale: 0.8,
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || !data.items || data.items.length === 0) return null;

  const sortedItems = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <section ref={sectionRef} className={styles.timelineSection} id="timeline">
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title || 'My Journey'}</h2>

        <div className={styles.timelineWrapper}>
          {/* Central animated line */}
          <div className={styles.timelineLine}>
            <div ref={lineRef} className={styles.timelineLineInner} />
          </div>

          {/* Timeline items */}
          <div className={styles.timelineItems}>
            {sortedItems.map((item, index) => {
              const isRight = index % 2 === 0;
              
              return (
                <div
                  key={item._id || index}
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={`${styles.timelineItem} ${isRight ? styles.right : styles.left}`}
                >
                  {/* Year badge */}
                  <div className={styles.yearBadge}>
                    <span>{item.year}</span>
                  </div>

                  {/* Icon dot in center */}
                  <div className={styles.iconDot}>
                    <div className={styles.iconCircle}>
                      <i className={item.icon}></i>
                    </div>
                    <div className={styles.pulse}></div>
                  </div>

                  {/* Content card */}
                  <div className={styles.contentCard}>
                    <div className={styles.cardInner}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      {item.subtitle && (
                        <h4 className={styles.itemSubtitle}>{item.subtitle}</h4>
                      )}
                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}
                    </div>
                    {/* Decorative corner */}
                    <div className={styles.cornerDecoration}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;