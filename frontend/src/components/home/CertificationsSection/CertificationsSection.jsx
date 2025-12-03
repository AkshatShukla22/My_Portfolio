// frontend/src/components/home/CertificationsSection/CertificationsSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CertificationsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const CertificationsSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = gsap.context(() => {
      // Clear any inline styles that might be added by GSAP
      gsap.set(cardsRef.current, { clearProps: "all" });
      
      gsap.from(cardsRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        onComplete: () => {
          // Ensure opacity is 1 after animation
          gsap.set(cardsRef.current, { opacity: 1, y: 0 });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.certificationsSection} id="certifications">
      <div className={styles.container}>
        <h2 className={styles.title}>Certifications & Achievements</h2>
        <p className={styles.subtitle}>Professional certifications and credentials</p>

        <div className={styles.certificationsGrid}>
          {data
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((cert, index) => (
              <div
                key={cert._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={styles.certCard}
              >
                <div className={styles.certContent}>
                  <div className={styles.certHeader}>
                    <div className={styles.certIcon}>
                      <i className="fas fa-award"></i>
                    </div>
                    <div className={styles.certHeaderText}>
                      <h3>{cert.title}</h3>
                      <p className={styles.issuer}>
                        <i className="fas fa-building"></i>
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <div className={styles.certMeta}>
                    {cert.date && (
                      <div className={styles.metaItem}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                          {new Date(cert.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}

                    {cert.credentialId && (
                      <div className={styles.metaItem}>
                        <i className="fas fa-hashtag"></i>
                        <span className={styles.credentialId}>{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyButton}
                    >
                      Verify Certificate
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;