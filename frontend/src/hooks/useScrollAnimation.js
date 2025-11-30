// frontend/src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (animationType = 'fadeInUp', options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const animations = {
      fadeInUp: {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      fadeInLeft: {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      fadeInRight: {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      scaleIn: {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      slideIn: {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
    };

    const animation = gsap.from(elementRef.current, {
      ...animations[animationType],
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        ...options.scrollTrigger,
      },
      ...options,
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === elementRef.current) {
          trigger.kill();
        }
      });
    };
  }, [animationType]);

  return elementRef;
};