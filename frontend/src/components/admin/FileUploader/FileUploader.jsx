// frontend/src/components/admin/FileUploader/FileUploader.jsx
import { useState, useRef, useEffect } from 'react';
import api from '../../../utils/api';
import styles from './FileUploader.module.css';

const FileUploader = ({ folder = 'portfolio', onUploadSuccess, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes
  useEffect(() => {
    console.log('📸 FileUploader - Current Image:', currentImage);
    if (currentImage?.url) {
      setPreview(currentImage.url);
    } else {
      setPreview(null);
    }
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WebP, SVG)');
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP, SVG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      alert('File size should not exceed 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    console.log('📤 Uploading file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      console.log('📡 Sending upload request to /api/upload');

      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload successful:', data.data);

      // IMPORTANT: Call success callback with the uploaded image data
      if (onUploadSuccess) {
        onUploadSuccess(data.data);
      }
      
      alert('✅ File uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to upload file';
      setError(errorMsg);
      alert('❌ ' + errorMsg);
      // Revert preview on error
      setPreview(currentImage?.url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onUploadSuccess) {
      onUploadSuccess(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.fileUploader}>
      {error && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#ef4444',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={styles.changeButton}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Change'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className={styles.removeButton}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={styles.uploadArea} 
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
        >
          <div className={styles.uploadIcon}>
            {uploading ? '⏳' : '📁'}
          </div>
          <p className={styles.uploadText}>
            {uploading ? 'Uploading...' : 'Click to upload image'}
          </p>
          <p className={styles.uploadHint}>PNG, JPG, GIF, WebP, SVG up to 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={uploading}
      />
    </div>
  );
};

export default FileUploader;