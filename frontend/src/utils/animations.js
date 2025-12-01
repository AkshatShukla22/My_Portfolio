// frontend/src/utils/animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * Initialize smooth scroll
 */
export const initSmoothScroll = () => {
  // Check if elements exist
  const wrapper = document.querySelector('#smooth-wrapper');
  const content = document.querySelector('#smooth-content');
  
  if (!wrapper || !content) {
    console.warn('Smooth scroll elements not found');
    return null;
  }

  try {
    return ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });
  } catch (error) {
    console.error('ScrollSmoother initialization failed:', error);
    return null;
  }
};

/**
 * Fade in up animation
 */
export const fadeInUp = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    y: 100,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in left animation
 */
export const fadeInLeft = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in right animation
 */
export const fadeInRight = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in animation
 */
export const fadeIn = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Scale in animation
 */
export const scaleIn = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'back.out(1.7)',
  });
};

/**
 * Stagger animation for lists
 */
export const staggerReveal = (elements, delay = 0) => {
  if (!elements || elements.length === 0) return null;
  
  return gsap.from(elements, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Scroll-triggered animation
 */
export const scrollReveal = (element, options = {}) => {
  if (!element) return null;
  
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...options.scrollTrigger,
    },
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options,
  });
};

/**
 * Parallax effect
 */
export const parallax = (element, speed = 0.5) => {
  if (!element) return null;
  
  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: (i, target) => {
      const dataSpeed = target.dataset?.speed;
      return -ScrollTrigger.maxScroll(window) * (dataSpeed || speed);
    },
    ease: 'none',
  });
};

/**
 * Scale on scroll
 */
export const scaleOnScroll = (element) => {
  if (!element) return null;
  
  return gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    }
  );
};

/**
 * Slide in animation
 */
export const slideIn = (element, direction = 'up', delay = 0) => {
  if (!element) return null;
  
  const directions = {
    up: { y: 100 },
    down: { y: -100 },
    left: { x: -100 },
    right: { x: 100 },
  };

  return gsap.from(element, {
    ...directions[direction],
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Rotate in animation
 */
export const rotateIn = (element, delay = 0) => {
  if (!element) return null;
  
  return gsap.from(element, {
    rotation: -180,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'back.out(1.7)',
  });
};

/**
 * Text reveal animation (character by character)
 */
export const textReveal = (element, delay = 0) => {
  if (!element) return null;
  
  const text = element.textContent;
  element.textContent = '';
  
  const chars = text.split('');
  chars.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    element.appendChild(span);
  });

  return gsap.from(element.children, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay,
    stagger: 0.03,
    ease: 'power2.out',
  });
};

/**
 * Counter animation
 */
export const animateCounter = (element, endValue, duration = 2, delay = 0) => {
  if (!element) return null;
  
  const obj = { value: 0 };
  
  return gsap.to(obj, {
    value: endValue,
    duration,
    delay,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.value);
    },
  });
};

/**
 * Magnetic button effect
 */
export const magneticButton = (button) => {
  if (!button) return;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    gsap.to(button, {
      x: deltaX * 0.3,
      y: deltaY * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Kill all ScrollTriggers
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Refresh ScrollTrigger
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};