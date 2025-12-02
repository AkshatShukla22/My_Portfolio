// frontend/src/components/home/ProjectsSection/ProjectsSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import styles from './ProjectsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const animatedRef = useRef(false);

  const projects = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (projects.length === 0 || animatedRef.current) return;

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const validCards = cardsRef.current.filter(Boolean);

        if (validCards.length > 0) {
          // Simple fade-in animation that ALWAYS works
          gsap.fromTo(
            validCards,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power2.out',
              delay: 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );

          animatedRef.current = true;
        }
      }, sectionRef);

      return () => ctx.revert();
    });
  }, [projects.length]);

  // Refresh ScrollTrigger when projects change
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [projects]);

  return (
    <section ref={sectionRef} className={styles.projectsSection} id="projects">
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Projects</h2>
        <p className={styles.subtitle}>Explore my recent work and creations</p>

        {projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            margin: '2rem 0'
          }}>
            <p>No projects available yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Check back soon for exciting new projects!
            </p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                ref={(el) => (cardsRef.current[index] = el)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;