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

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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
    <section ref={sectionRef} className={styles.projectsSection} id="projects">
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Projects</h2>
        <p className={styles.subtitle}>Explore my recent work and creations</p>

        <div className={styles.projectsGrid}>
          {data.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              ref={(el) => (cardsRef.current[index] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;