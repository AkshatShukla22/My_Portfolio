// frontend/src/components/home/JourneySection/JourneySection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BikeAnimation from './BikeAnimation';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const JourneySection = ({ data }) => {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const stepsRef = useRef([]);

  // Debug: Log data
  useEffect(() => {
    console.log('Journey Section Data:', data);
  }, [data]);

  useEffect(() => {
    if (!data?.steps || data.steps.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate road drawing
      if (roadRef.current) {
        gsap.from(roadRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }

      // Animate steps appearing
      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.from(step, {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // Don't render if no data
  if (!data) {
    console.log('No journey data available');
    return null;
  }

  return (
    <section ref={sectionRef} className={styles.journeySection} id="journey">
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title || 'My Journey'}</h2>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}

        {data.steps && data.steps.length > 0 ? (
          <div className={styles.journeyContainer}>
            {/* Road/Path */}
            <div ref={roadRef} className={styles.road} />

            {/* Bike Animation */}
            <BikeAnimation
              bikeImage={data.bikeAnimation?.bikeImage?.url}
              speed={data.bikeAnimation?.speed || 1}
            />

            {/* Journey Steps */}
            <div className={styles.steps}>
              {data.steps
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((step, index) => (
                  <div
                    key={step._id || index}
                    ref={(el) => (stepsRef.current[index] = el)}
                    className={styles.step}
                    style={{ left: `${step.position || (index * 20)}%` }}
                  >
                    <div className={styles.stepMarker}>
                      {step.icon ? <span>{step.icon}</span> : <span>📍</span>}
                    </div>
                    <div className={styles.stepContent}>
                      {step.year && <span className={styles.year}>{step.year}</span>}
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      {step.image?.url && (
                        <img
                          src={step.image.url}
                          alt={step.title}
                          className={styles.stepImage}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>No journey steps added yet. Add some from the admin panel!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneySection;