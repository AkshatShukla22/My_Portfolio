// frontend/src/components/common/PageTransition/PageTransition.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PageTransition.module.css';

const PageTransition = ({ children }) => {
  const transitionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(transitionRef.current, {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.8,
      ease: 'power4.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div ref={transitionRef} className={styles.pageTransition} />
      {children}
    </>
  );
};

export default PageTransition;