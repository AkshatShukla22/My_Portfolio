// frontend/src/components/admin/FileUploader/FileUploader.jsx
import { useState, useRef, useEffect } from 'react';
import api from '../../../utils/api';
import styles from './FileUploader.module.css';

const FileUploader = ({ folder = 'portfolio', onUploadSuccess, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage?.url) {
      setPreview(currentImage.url);
    }
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP, SVG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      console.log('Uploading file:', file.name);

      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', data);

      // Call success callback with the uploaded image data
      onUploadSuccess(data.data);
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload file');
      // Revert preview on error
      setPreview(currentImage?.url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.fileUploader}>
      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
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
        <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
          <div className={styles.uploadIcon}>📁</div>
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