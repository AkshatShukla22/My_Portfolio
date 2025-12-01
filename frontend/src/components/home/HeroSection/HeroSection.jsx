// frontend/src/components/home/HeroSection/HeroSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Hero3DModel from './Hero3DModel';
import styles from './HeroSection.module.css';
import { fadeInUp, fadeInLeft } from '../../../utils/animations';

const HeroSection = ({ data }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeInUp(titleRef.current, 0.3);
      if (subtitleRef.current) fadeInUp(subtitleRef.current, 0.5);
      if (descRef.current) fadeInUp(descRef.current, 0.7);
      if (imageRef.current) fadeInLeft(imageRef.current, 0.9);
      if (ctaRef.current) fadeInUp(ctaRef.current, 1.1);
    }, heroRef);

    return () => ctx.revert();
  }, [data]);

  // Debug: Log data
  useEffect(() => {
    console.log('Hero Section Data:', data);
  }, [data]);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 ref={titleRef} className={styles.title}>
            {data?.title || 'Your Name'}
          </h1>
          <h2 ref={subtitleRef} className={styles.subtitle}>
            {data?.subtitle || 'Full Stack Developer'}
          </h2>
          {data?.description && (
            <p ref={descRef} className={styles.description}>
              {data.description}
            </p>
          )}
          {data?.ctaText && data?.ctaLink && (
            <a 
              ref={ctaRef}
              href={data.ctaLink} 
              className={styles.cta}
            >
              {data.ctaText}
            </a>
          )}
        </div>

        <div ref={imageRef} className={styles.imageContainer}>
          {data?.profileImage?.url ? (
            <img
              src={data.profileImage.url}
              alt={data?.title || 'Profile'}
              className={styles.profileImage}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Three.js 3D Model */}
      {data?.model3D && (
        <div className={styles.modelContainer}>
          <Hero3DModel type={data.model3D.type || 'cube'} />
        </div>
      )}

      {/* Background */}
      {data?.backgroundImage?.url && (
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${data.backgroundImage.url})` }}
        />
      )}
    </section>
  );
};

export default HeroSection;