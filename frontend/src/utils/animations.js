// frontend/src/utils/animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Initialize smooth scroll functionality
 * This creates a smooth scrolling effect using GSAP
 */
export const initSmoothScroll = () => {
  const scrollWrapper = document.getElementById('smooth-wrapper');
  const scrollContent = document.getElementById('smooth-content');

  // If elements don't exist, return a dummy object
  if (!scrollWrapper || !scrollContent) {
    console.log('Smooth scroll elements not found - using native scroll');
    return {
      kill: () => {},
    };
  }

  let scrollInstance;

  try {
    // Configure smooth scroll
    const smoothScrollConfig = {
      wrapper: scrollWrapper,
      content: scrollContent,
      smooth: 1.2,
      effects: true,
      smoothTouch: false, // Disable on touch devices to prevent conflicts
    };

    // Initialize smooth scroll (if you have a library like Locomotive Scroll)
    // If not using a library, we'll use GSAP-based smooth scroll
    
    // GSAP-based smooth scroll implementation
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.075;

    const updateScroll = () => {
      targetScroll = window.scrollY;
      currentScroll += (targetScroll - currentScroll) * ease;
      
      if (scrollContent) {
        scrollContent.style.transform = `translateY(-${currentScroll}px)`;
      }

      requestAnimationFrame(updateScroll);
    };

    // Set up the scroll wrapper
    scrollWrapper.style.position = 'fixed';
    scrollWrapper.style.top = '0';
    scrollWrapper.style.left = '0';
    scrollWrapper.style.width = '100%';
    scrollWrapper.style.height = '100%';
    scrollWrapper.style.overflow = 'hidden';

    // Set body height to enable scrolling
    const setBodyHeight = () => {
      document.body.style.height = `${scrollContent.offsetHeight}px`;
    };

    setBodyHeight();
    window.addEventListener('resize', setBodyHeight);

    // Start the animation loop
    requestAnimationFrame(updateScroll);

    // Create ScrollTrigger scroller proxy
    ScrollTrigger.scrollerProxy(scrollWrapper, {
      scrollTop(value) {
        if (arguments.length) {
          currentScroll = targetScroll = value;
        }
        return currentScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Update ScrollTrigger when smooth scroll updates
    ScrollTrigger.addEventListener('refresh', setBodyHeight);
    ScrollTrigger.refresh();

    scrollInstance = {
      kill: () => {
        window.removeEventListener('resize', setBodyHeight);
        ScrollTrigger.removeEventListener('refresh', setBodyHeight);
        ScrollTrigger.getAll().forEach(t => t.kill());
        
        // Reset styles
        if (scrollWrapper) {
          scrollWrapper.style.position = '';
          scrollWrapper.style.top = '';
          scrollWrapper.style.left = '';
          scrollWrapper.style.width = '';
          scrollWrapper.style.height = '';
          scrollWrapper.style.overflow = '';
        }
        if (scrollContent) {
          scrollContent.style.transform = '';
        }
        document.body.style.height = '';
      },
    };

    return scrollInstance;

  } catch (error) {
    console.error('Smooth scroll initialization failed:', error);
    return {
      kill: () => {},
    };
  }
};

/**
 * Smooth scroll to a specific element
 * This is more reliable than smooth scroll libraries
 */
export const scrollToElement = (elementId, offset = 80, duration = 1.2) => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      resolve(false);
      return;
    }

    // Kill any ongoing scroll animations
    gsap.killTweensOf(window);

    // Get element position
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    // Use GSAP for smooth scrolling
    gsap.to(window, {
      duration: duration,
      scrollTo: {
        y: offsetPosition,
        autoKill: true,
      },
      ease: 'power2.inOut',
      onComplete: () => {
        resolve(true);
      },
      onInterrupt: () => {
        resolve(false);
      },
    });
  });
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (duration = 1) => {
  gsap.killTweensOf(window);
  
  gsap.to(window, {
    duration: duration,
    scrollTo: { y: 0 },
    ease: 'power2.inOut',
  });
};

/**
 * Refresh all ScrollTrigger instances
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

/**
 * Kill all ScrollTrigger instances
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Create a scroll-triggered animation
 */
export const createScrollAnimation = (element, animationProps, triggerConfig = {}) => {
  if (!element) return null;

  const defaultTrigger = {
    trigger: element,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
    ...triggerConfig,
  };

  return gsap.from(element, {
    ...animationProps,
    scrollTrigger: defaultTrigger,
  });
};

/**
 * Batch scroll animations for multiple elements
 */
export const batchScrollAnimation = (elements, animationProps, triggerConfig = {}) => {
  if (!elements || elements.length === 0) return null;

  return ScrollTrigger.batch(elements, {
    onEnter: (batch) => {
      gsap.from(batch, {
        ...animationProps,
        stagger: 0.15,
      });
    },
    start: 'top 80%',
    ...triggerConfig,
  });
};

/**
 * Initialize parallax effect
 */
export const initParallax = (element, speed = 0.5) => {
  if (!element) return null;

  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

/**
 * Fade in animation on scroll
 */
export const fadeInOnScroll = (elements, staggerDelay = 0.1) => {
  if (!elements) return null;

  const elementsArray = Array.isArray(elements) ? elements : [elements];

  return gsap.from(elementsArray, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: staggerDelay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elementsArray[0],
      start: 'top 80%',
    },
  });
};

/**
 * Fade in up animation
 */
export const fadeInUp = (element, delay = 0) => {
  if (!element) return null;

  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in left animation
 */
export const fadeInLeft = (element, delay = 0) => {
  if (!element) return null;

  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    delay: delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in right animation
 */
export const fadeInRight = (element, delay = 0) => {
  if (!element) return null;

  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    delay: delay,
    ease: 'power3.out',
  });
};

/**
 * Fade in down animation
 */
export const fadeInDown = (element, delay = 0) => {
  if (!element) return null;

  return gsap.from(element, {
    y: -60,
    opacity: 0,
    duration: 1,
    delay: delay,
    ease: 'power3.out',
  });
};

/**
 * Scale in animation
 */
export const scaleIn = (element, delay = 0) => {
  if (!element) return null;

  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    delay: delay,
    ease: 'back.out(1.7)',
  });
};

/**
 * Stagger fade in animation for multiple elements
 */
export const staggerFadeIn = (elements, staggerAmount = 0.1) => {
  if (!elements || elements.length === 0) return null;

  return gsap.from(elements, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: staggerAmount,
    ease: 'power2.out',
  });
};