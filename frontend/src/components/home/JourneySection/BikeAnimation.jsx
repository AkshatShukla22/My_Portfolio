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
    const section = containerRef.current;

    // Find the journey container directly
    const container = section.querySelector(`.${styles.journeyContainer}`);
    if (!container) {
      console.error('Journey container not found');
      return;
    }

    // Find the road element
    const road = section.querySelector(`.${styles.road}`);
    if (!road) {
      console.error('Road element not found');
      return;
    }

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
          <i className={bikeIcon} aria-hidden="true"></i>
        </div>
      )}
    </div>
  );
};

export default BikeAnimation;