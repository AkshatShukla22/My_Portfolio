// frontend/src/pages/BlogDetail/BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import Loader from '../../components/common/Loader/Loader';
import styles from './BlogDetail.module.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      setBlog(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Navbar />
        <div className={styles.error}>
          <h1>😕 Oops!</h1>
          <p>{error}</p>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className={styles.blogDetailPage}>
      <Navbar />

      <article className={styles.blogArticle}>
        <div className={styles.container}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>

          {blog.featuredImage?.url && (
            <div className={styles.featuredImage}>
              <img src={blog.featuredImage.url} alt={blog.title} />
            </div>
          )}

          <div className={styles.blogHeader}>
            <h1 className={styles.title}>{blog.title}</h1>

            <div className={styles.blogMeta}>
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
              <span>•</span>
              <span>{blog.views || 0} views</span>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className={styles.tags}>
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.blogContent}>
            {blog.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;