// frontend/src/components/home/HeroSection/HeroSection.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Github, Linkedin, Twitter, Mail, Globe, Code2, FileText } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import styles from './HeroSection.module.css';
import { fadeInUp, fadeInLeft } from '../../../utils/animations';

const HeroSection = ({ data }) => {
  const { contact } = useContent();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  // Letter-by-letter animation for subtitles
  useEffect(() => {
    if (!data?.subtitles || data.subtitles.length === 0) return;

    const subtitles = data.subtitles;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId = null;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;
    const delayBeforeNextWord = 500;

    const type = () => {
      const currentFullText = subtitles[subtitleIndex];

      if (!isDeleting) {
        // Typing
        if (charIndex < currentFullText.length) {
          setCurrentSubtitle(currentFullText.substring(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(type, typeSpeed);
        } else {
          // Finished typing, pause then start deleting
          isDeleting = true;
          timeoutId = setTimeout(type, pauseTime);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCurrentSubtitle(currentFullText.substring(0, charIndex - 1));
          charIndex--;
          timeoutId = setTimeout(type, deleteSpeed);
        } else {
          // Finished deleting, move to next subtitle
          isDeleting = false;
          setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
          timeoutId = setTimeout(type, delayBeforeNextWord);
        }
      }
    };

    // Start the animation after a brief delay
    timeoutId = setTimeout(type, 1000);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data?.subtitles, subtitleIndex]);

  useEffect(() => {
    // Only run animation once when component mounts and data is available
    if (!data) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) fadeInUp(titleRef.current, 0.3);
      if (subtitleRef.current) fadeInUp(subtitleRef.current, 0.5);
      if (descRef.current) fadeInUp(descRef.current, 0.7);
      if (imageRef.current) fadeInLeft(imageRef.current, 0.9);
      if (ctaRef.current) fadeInUp(ctaRef.current, 1.1);
    }, heroRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  // Get icon for social link
  const getSocialIcon = (platform) => {
    const iconMap = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      email: Mail,
      portfolio: Globe,
      leetcode: Code2,
      gfg: Code2, // GeeksforGeeks
      codechef: Code2,
      codeforces: Code2,
      hackerrank: Code2,
      website: Globe,
      blog: Globe,
    };

    const key = platform.toLowerCase();
    const Icon = iconMap[key] || Globe;
    return <Icon size={20} />;
  };

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 ref={titleRef} className={styles.title}>
            {data?.title || 'Your Name'}
          </h1>
          <h2 ref={subtitleRef} className={styles.subtitle}>
            {currentSubtitle}
            <span className={styles.cursor}>|</span>
          </h2>
          {data?.description && (
            <p ref={descRef} className={styles.description}>
              {data.description}
            </p>
          )}

          {/* Social Links */}
          {contact?.socialLinks && contact.socialLinks.length > 0 && (
            <div className={styles.socialLinks}>
              {contact.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}

          {/* Resume Button */}
          {data?.resume?.url && (
            <a
              href={data.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeButton}
              title="View Resume"
            >
              <FileText size={20} />
              <span>View Resume</span>
            </a>
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