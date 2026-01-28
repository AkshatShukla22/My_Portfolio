// frontend/src/components/home/BlogSection/BlogSection.jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BlogSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const BlogSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Set initial opacity to 1 to ensure cards are visible
    cardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '1';
      }
    });

    const ctx = gsap.context(() => {
      // Animate from position only, keep opacity at 1
      gsap.from(cardsRef.current, {
        y: 80,
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

  // Hide section if no blogs
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className={styles.blogSection} id="blog">
      <div className={styles.container}>
        <h2 className={styles.title}>Latest Blog Posts</h2>
        <p className={styles.subtitle}>Thoughts, tutorials, and insights</p>

        <div className={styles.blogGrid}>
          {data.slice(0, 6).map((blog, index) => (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog._id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={styles.blogCard}
              style={{ opacity: 1 }} // Force opacity to 1
            >
              {blog.featuredImage?.url && (
                <div className={styles.blogImage}>
                  <img 
                    src={blog.featuredImage.url} 
                    alt={blog.title}
                  />
                </div>
              )}

              <div className={styles.blogContent}>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt || 'No excerpt available'}</p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className={styles.tags}>
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.blogMeta}>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{blog.views || 0} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;