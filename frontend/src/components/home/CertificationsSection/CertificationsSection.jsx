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
      gsap.from(cardsRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
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
                {cert.image?.url && (
                  <div className={styles.certImage}>
                    <img src={cert.image.url} alt={cert.title} />
                  </div>
                )}

                <div className={styles.certContent}>
                  <h3>{cert.title}</h3>
                  <p className={styles.issuer}>{cert.issuer}</p>

                  {cert.date && (
                    <p className={styles.date}>
                      Issued: {new Date(cert.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}

                  {cert.credentialId && (
                    <p className={styles.credentialId}>
                      Credential ID: {cert.credentialId}
                    </p>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyButton}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Verify Certificate →
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