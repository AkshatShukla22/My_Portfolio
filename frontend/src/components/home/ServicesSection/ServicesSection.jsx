// frontend/src/components/home/ServicesSection/ServicesSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
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
    <section ref={sectionRef} className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <h2 className={styles.title}>Services I Offer</h2>
        <p className={styles.subtitle}>
          Comprehensive solutions tailored to your needs
        </p>

        <div className={styles.servicesGrid}>
          {data
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((service, index) => (
              <div
                key={service._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={styles.serviceCard}
              >
                {service.icon && (
                  <div className={styles.serviceIcon}>
                    <span>{service.icon}</span>
                  </div>
                )}

                <h3>{service.title}</h3>
                <p className={styles.description}>{service.description}</p>

                {service.features && service.features.length > 0 && (
                  <ul className={styles.featuresList}>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className={styles.checkmark}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;