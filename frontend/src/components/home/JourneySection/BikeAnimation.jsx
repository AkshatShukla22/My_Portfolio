// frontend/src/components/home/JourneySection/BikeAnimation.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const BikeAnimation = ({ bikeImage, bikeIcon = 'fas fa-bicycle', speed = 1, containerRef }) => {
  const bikeRef = useRef(null);

  useEffect(() => {
    if (!bikeRef.current || !containerRef?.current) return;

    const bike = bikeRef.current;
    const container = containerRef.current.querySelector('.journeyContainer');

    if (!container) return;

    // Get the actual road element to calculate exact width
    const road = container.querySelector('[class*="road"]');
    if (!road) return;

    // Animate bike moving along the road based on scroll, synced with progress bar
    const scrollAnimation = gsap.to(bike, {
      x: () => {
        const roadRect = road.getBoundingClientRect();
        const bikeWidth = bike.offsetWidth;
        // Calculate exact distance the bike should travel
        // Road width minus bike width to stop at the end
        return roadRect.width - bikeWidth;
      },
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    return () => {
      scrollAnimation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [speed, containerRef]);

  return (
    <div ref={bikeRef} className={styles.bike}>
      {bikeImage ? (
        <img src={bikeImage} alt="Journey" />
      ) : (
        <div className={styles.defaultBike}>
          <i className={bikeIcon}></i>
        </div>
      )}
    </div>
  );
};

export default BikeAnimation;