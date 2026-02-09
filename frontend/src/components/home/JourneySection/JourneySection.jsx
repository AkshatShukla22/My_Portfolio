// frontend/src/components/home/JourneySection/JourneySection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BikeAnimation from './BikeAnimation';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const JourneySection = ({ data }) => {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const progressRoadRef = useRef(null);
  const stepsRef = useRef([]);
  const [expandedSteps, setExpandedSteps] = useState({});

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

      // Sync both progress road and bike to the same scroll trigger
      const container = sectionRef.current.querySelector(`.${styles.journeyContainer}`);
      
      if (progressRoadRef.current && container) {
        gsap.to(progressRoadRef.current, {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
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
            delay: index * 0.15,
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

  const toggleExpand = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const isDescriptionLong = (description) => {
    return description && description.length > 120;
  };

  if (!data) {
    console.log('No journey data available');
    return null;
  }

  const sortedSteps = data.steps ? [...data.steps].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  return (
    <section ref={sectionRef} className={styles.journeySection} id="journey">
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title || 'My Journey'}</h2>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}

        {sortedSteps.length > 0 ? (
          <div className={styles.journeyContainer}>
            {/* Background Road */}
            <div ref={roadRef} className={styles.road} />
            
            {/* Progress Road (colored as you scroll) */}
            <div ref={progressRoadRef} className={styles.progressRoad} />

            {/* Bike Animation */}
            <BikeAnimation
              bikeImage={data.bikeAnimation?.bikeImage?.url}
              bikeIcon={data.bikeAnimation?.icon}
              speed={data.bikeAnimation?.speed || 1}
              containerRef={sectionRef}
            />

            {/* Journey Steps */}
            <div className={styles.steps}>
              {sortedSteps.map((step, index) => {
                const isTop = index % 2 === 0;
                const stepId = step._id || index;
                const isExpanded = expandedSteps[stepId];
                const hasLongDescription = isDescriptionLong(step.description);
                
                return (
                  <div
                    key={stepId}
                    ref={(el) => (stepsRef.current[index] = el)}
                    className={`${styles.stepWrapper} ${isTop ? styles.wrapperTop : styles.wrapperBottom}`}
                    style={{ left: `${step.position || 0}%` }}
                  >
                    {/* For top cards: icon above card */}
                    {isTop && (
                      <div className={styles.stepMarker}>
                        {step.icon && step.icon.startsWith('fa') ? (
                          <i className={step.icon} aria-hidden="true"></i>
                        ) : (
                          <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                        )}
                      </div>
                    )}
                    
                    <div className={`${styles.stepContent} ${isExpanded ? styles.expanded : ''}`}>
                      {step.year && <span className={styles.year}>{step.year}</span>}
                      <h3>{step.title}</h3>
                      <p className={styles.description}>
                        {isExpanded || !hasLongDescription 
                          ? step.description 
                          : `${step.description.substring(0, 120)}...`
                        }
                      </p>
                      {hasLongDescription && (
                        <span 
                          className={styles.seeMoreText}
                          onClick={() => toggleExpand(stepId)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              toggleExpand(stepId);
                            }
                          }}
                        >
                          {isExpanded ? 'See less' : 'See more'}
                        </span>
                      )}
                      {step.percentage != null && (
                        <div className={styles.percentageBadge}>
                          <i className="fas fa-award" aria-hidden="true"></i> {step.percentage}%
                        </div>
                      )}
                      {step.image?.url && (
                        <img
                          src={step.image.url}
                          alt={step.title}
                          className={styles.stepImage}
                        />
                      )}
                    </div>

                    {/* For bottom cards: icon below card */}
                    {!isTop && (
                      <div className={styles.stepMarker}>
                        {step.icon && step.icon.startsWith('fa') ? (
                          <i className={step.icon} aria-hidden="true"></i>
                        ) : (
                          <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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