// frontend/src/components/home/JourneySection/BikeAnimation.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const BikeAnimation = ({ bikeImage, speed = 1 }) => {
  const bikeRef = useRef(null);

  useEffect(() => {
    if (!bikeRef.current) return;

    const bike = bikeRef.current;
    const parent = bike.parentElement;

    if (!parent) return;

    // Animate bike moving along the road based on scroll
    const scrollAnimation = gsap.to(bike, {
      x: () => {
        const parentWidth = parent.offsetWidth;
        const bikeWidth = bike.offsetWidth;
        return parentWidth - bikeWidth - 50; // 50px padding from right
      },
      ease: 'none',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom center',
        scrub: speed,
      },
    });

    // Add slight bounce/wobble
    const bounceAnimation = gsap.to(bike, {
      y: -10,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    return () => {
      scrollAnimation.kill();
      bounceAnimation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === parent) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return (
    <div ref={bikeRef} className={styles.bike}>
      {bikeImage ? (
        <img src={bikeImage} alt="Journey" />
      ) : (
        <div className={styles.defaultBike}>🚴</div>
      )}
    </div>
  );
};

export default BikeAnimation;