// frontend/src/components/admin/BlogEditor/BlogEditor.jsx
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import FileUploader from '../FileUploader/FileUploader';
import styles from '../HeroEditor/HeroEditor.module.css';

const BlogEditor = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false,
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      tags: blog.tags?.join(', ') || '',
      published: blog.published,
    });
    setFeaturedImage(blog.featuredImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        featuredImage,
      };

      if (editingBlog) {
        await api.put(`/blogs/id/${editingBlog._id}`, payload);
        setMessage({ type: 'success', text: 'Blog updated successfully!' });
      } else {
        await api.post('/blogs', payload);
        setMessage({ type: 'success', text: 'Blog created successfully!' });
      }

      await fetchBlogs();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save blog',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await api.delete(`/blogs/id/${id}`);
      await fetchBlogs();
      setMessage({ type: 'success', text: 'Blog deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete blog',
      });
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setShowForm(false);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      tags: '',
      published: false,
    });
    setFeaturedImage(null);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Blog Management</h2>
        <p>Create and manage blog posts</p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.submitButton}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            + Add New Blog Post
          </button>
        )}
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.editorForm}>
          <div className={styles.formSection}>
            <h3>Blog Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Blog Post Title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                placeholder="Brief summary for blog listing..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="15"
                placeholder="Write your blog content here..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, JavaScript, Web Development"
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>Publish Immediately</span>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Featured Image</h3>
            <FileUploader
              folder="blog"
              onUploadSuccess={(result) => setFeaturedImage(result)}
              currentImage={featuredImage}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.formSection}>
          <h3>Blog Posts ({blogs.length})</h3>

          {blogs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No blog posts yet. Click "Add New Blog Post" to create one.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  {blog.featuredImage?.url && (
                    <img
                      src={blog.featuredImage.url}
                      alt={blog.title}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                      {blog.title}
                      {blog.published ? (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#22c55e',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          PUBLISHED
                        </span>
                      ) : (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            background: 'rgba(234, 179, 8, 0.2)',
                            color: '#eab308',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          DRAFT
                        </span>
                      )}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {blog.excerpt || 'No excerpt'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(blog)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogEditor;