// frontend/src/components/admin/ServiceEditor/ServiceEditor.jsx
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import api from '../../../utils/api';
import styles from './ServiceEditor.module.css';

const ICON_OPTIONS = [
  { value: 'fa-code', label: 'Web Development' },
  { value: 'fa-mobile-screen-button', label: 'Mobile Development' },
  { value: 'fa-pen-ruler', label: 'UI/UX Design' },
  { value: 'fa-palette', label: 'Graphic Design' },
  { value: 'fa-gears', label: 'API Development' },
  { value: 'fa-server', label: 'Backend Development' },
  { value: 'fa-database', label: 'Database Design' },
  { value: 'fa-cloud', label: 'Cloud Services' },
  { value: 'fa-shield-halved', label: 'Security' },
  { value: 'fa-chart-line', label: 'Analytics' },
  { value: 'fa-user-tie', label: 'Consulting' },
  { value: 'fa-graduation-cap', label: 'Training' },
  { value: 'fa-rocket', label: 'Deployment' },
  { value: 'fa-screwdriver-wrench', label: 'Maintenance' },
  { value: 'fa-magnifying-glass', label: 'SEO' },
  { value: 'fa-bullhorn', label: 'Marketing' },
  { value: 'custom', label: 'Custom Icon (enter below)' }
];

const PACKAGE_NAMES = ['Basic', 'Standard', 'Premium'];

const ServiceEditor = () => {
  const { services, refreshContent } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'fa-gears',
    customIcon: '',
    features: [''],
    price: '',
    hasPackages: false,
    packages: [],
    isActive: true,
    showInFooter: true
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const emptyPackage = {
    name: 'Basic',
    description: '',
    price: '',
    features: [''],
    deliveryTime: '7 days',
    revisions: 'Unlimited'
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'fa-gears',
      customIcon: '',
      features: [''],
      price: '',
      hasPackages: false,
      packages: [],
      isActive: true,
      showInFooter: true
    });
    setEditingId(null);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // Package handlers
  const handlePackageChange = (packageIndex, field, value) => {
    const newPackages = [...formData.packages];
    newPackages[packageIndex] = {
      ...newPackages[packageIndex],
      [field]: value
    };
    setFormData({ ...formData, packages: newPackages });
  };

  const handlePackageFeatureChange = (packageIndex, featureIndex, value) => {
    const newPackages = [...formData.packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setFormData({ ...formData, packages: newPackages });
  };

  const addPackageFeature = (packageIndex) => {
    const newPackages = [...formData.packages];
    newPackages[packageIndex].features.push('');
    setFormData({ ...formData, packages: newPackages });
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    const newPackages = [...formData.packages];
    newPackages[packageIndex].features = newPackages[packageIndex].features.filter(
      (_, i) => i !== featureIndex
    );
    setFormData({ ...formData, packages: newPackages });
  };

  const addPackage = () => {
    if (formData.packages.length >= 3) {
      setMessage({ type: 'error', text: 'Maximum 3 packages allowed (Basic, Standard, Premium)' });
      return;
    }
    const availableNames = PACKAGE_NAMES.filter(
      name => !formData.packages.find(pkg => pkg.name === name)
    );
    if (availableNames.length === 0) {
      setMessage({ type: 'error', text: 'All package types already added' });
      return;
    }
    setFormData({
      ...formData,
      packages: [...formData.packages, { ...emptyPackage, name: availableNames[0] }]
    });
  };

  const removePackage = (index) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    setFormData({ ...formData, packages: newPackages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Determine final icon value
    const finalIcon = formData.icon === 'custom' 
      ? (formData.customIcon || '').trim() 
      : formData.icon;

    // Validation
    if (formData.icon === 'custom' && !finalIcon) {
      setMessage({ type: 'error', text: 'Please enter a custom icon class' });
      setLoading(false);
      return;
    }

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a service title' });
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'Please enter a service description' });
      setLoading(false);
      return;
    }

    // Clean and prepare data
    const cleanedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: finalIcon,
      features: formData.features.filter(f => f && f.trim() !== ''),
      price: formData.hasPackages ? '' : (formData.price || '').trim(),
      hasPackages: formData.hasPackages,
      packages: formData.hasPackages 
        ? formData.packages.map(pkg => ({
            name: pkg.name,
            description: pkg.description.trim(),
            price: pkg.price.trim(),
            deliveryTime: pkg.deliveryTime || '7 days',
            revisions: pkg.revisions || 'Unlimited',
            features: pkg.features.filter(f => f && f.trim() !== '')
          }))
        : [],
      isActive: formData.isActive,
      showInFooter: formData.showInFooter
    };

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, cleanedData);
        setMessage({ type: 'success', text: 'Service updated successfully!' });
      } else {
        await api.post('/services', cleanedData);
        setMessage({ type: 'success', text: 'Service created successfully!' });
      }
      await refreshContent();
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save service'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    // Check if icon is custom (not in predefined list, excluding 'custom' option itself)
    const predefinedIcons = ICON_OPTIONS.filter(opt => opt.value !== 'custom').map(opt => opt.value);
    const isCustomIcon = !predefinedIcons.includes(service.icon);
    
    setFormData({
      title: service.title,
      description: service.description,
      icon: isCustomIcon ? 'custom' : service.icon,
      customIcon: isCustomIcon ? service.icon : '',
      features: service.features && service.features.length > 0 ? [...service.features] : [''],
      price: service.price || '',
      hasPackages: service.hasPackages || false,
      packages: service.packages && service.packages.length > 0 
        ? service.packages.map(pkg => ({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            deliveryTime: pkg.deliveryTime || '7 days',
            revisions: pkg.revisions || 'Unlimited',
            features: pkg.features && pkg.features.length > 0 ? [...pkg.features] : ['']
          }))
        : [],
      isActive: service.isActive !== undefined ? service.isActive : true,
      showInFooter: service.showInFooter !== undefined ? service.showInFooter : true
    });
    setEditingId(service._id);
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services/${id}`);
      await refreshContent();
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete service'
      });
    }
  };

  const handleReorder = async (id, direction) => {
    const currentIndex = services.findIndex(s => s._id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= services.length) return;

    const reorderedServices = [...services];
    [reorderedServices[currentIndex], reorderedServices[newIndex]] = 
    [reorderedServices[newIndex], reorderedServices[currentIndex]];

    const updateData = reorderedServices.map((service, index) => ({
      id: service._id,
      order: index
    }));

    try {
      await api.put('/services/reorder', { services: updateData });
      await refreshContent();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reorder services' });
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Services Management</h2>
        <p>Create and manage your portfolio services with optional pricing packages</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formSection}>
          <h3>{editingId ? 'Edit Service' : 'Add New Service'}</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Service Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Web Development"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="icon">Icon</label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
              >
                {ICON_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.icon === 'custom' && (
            <div className={styles.formGroup}>
              <label htmlFor="customIcon">Custom Icon Class *</label>
              <input
                type="text"
                id="customIcon"
                name="customIcon"
                value={formData.customIcon}
                onChange={handleChange}
                placeholder="e.g., fa-solid fa-microchip"
              />
              <p className={styles.helpText}>
                Enter Font Awesome class (e.g., "fa-solid fa-microchip"). 
                Check <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)'}}>Font Awesome</a> for icons.
              </p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe what this service offers..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>General Features (Optional)</label>
            <p className={styles.helpText}>Add features that apply to all packages or the entire service</p>
            {formData.features.map((feature, index) => (
              <div key={index} className={styles.featureRow}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className={styles.removeBtn}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className={styles.addFeatureBtn}
            >
              <i className="fa-solid fa-plus"></i> Add Feature
            </button>
          </div>

          {/* Pricing Type Selection */}
          <div className={styles.pricingTypeSection}>
            <h4>Pricing Structure</h4>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="pricingType"
                  checked={!formData.hasPackages}
                  onChange={() => setFormData({ ...formData, hasPackages: false, packages: [] })}
                />
                <span>Simple Pricing</span>
                <small>Single price for the service</small>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="pricingType"
                  checked={formData.hasPackages}
                  onChange={() => setFormData({ ...formData, hasPackages: true, price: '' })}
                />
                <span>Package Pricing (Like a Gig)</span>
                <small>Multiple packages: Basic, Standard, Premium</small>
              </label>
            </div>
          </div>

          {/* Simple Pricing */}
          {!formData.hasPackages && (
            <div className={styles.formGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., Starting at $2,000 or Contact for pricing"
              />
            </div>
          )}

          {/* Package Pricing */}
          {formData.hasPackages && (
            <div className={styles.packagesSection}>
              <div className={styles.packagesSectionHeader}>
                <h4>Pricing Packages</h4>
                <button
                  type="button"
                  onClick={addPackage}
                  className={styles.addPackageBtn}
                  disabled={formData.packages.length >= 3}
                >
                  <i className="fa-solid fa-plus"></i> Add Package
                </button>
              </div>

              {formData.packages.length === 0 && (
                <p className={styles.helpText}>Click "Add Package" to create pricing tiers</p>
              )}

              <div className={styles.packagesGrid}>
                {formData.packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className={styles.packageCard}>
                    <div className={styles.packageHeader}>
                      <select
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(pkgIndex, 'name', e.target.value)}
                        className={styles.packageNameSelect}
                      >
                        {PACKAGE_NAMES.map(name => (
                          <option 
                            key={name} 
                            value={name}
                            disabled={formData.packages.find(p => p.name === name && p !== pkg)}
                          >
                            {name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removePackage(pkgIndex)}
                        className={styles.removePackageBtn}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>

                    <div className={styles.packageFormGroup}>
                      <label>Description *</label>
                      <textarea
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(pkgIndex, 'description', e.target.value)}
                        placeholder="Brief description of this package"
                        rows="2"
                        required
                      />
                    </div>

                    <div className={styles.packageFormRow}>
                      <div className={styles.packageFormGroup}>
                        <label>Price *</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(pkgIndex, 'price', e.target.value)}
                          placeholder="$999"
                          required
                        />
                      </div>
                      <div className={styles.packageFormGroup}>
                        <label>Delivery Time</label>
                        <input
                          type="text"
                          value={pkg.deliveryTime}
                          onChange={(e) => handlePackageChange(pkgIndex, 'deliveryTime', e.target.value)}
                          placeholder="7 days"
                        />
                      </div>
                    </div>

                    <div className={styles.packageFormGroup}>
                      <label>Revisions</label>
                      <input
                        type="text"
                        value={pkg.revisions}
                        onChange={(e) => handlePackageChange(pkgIndex, 'revisions', e.target.value)}
                        placeholder="Unlimited"
                      />
                    </div>

                    <div className={styles.packageFormGroup}>
                      <label>Features *</label>
                      {pkg.features.map((feature, featIndex) => (
                        <div key={featIndex} className={styles.featureRow}>
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handlePackageFeatureChange(pkgIndex, featIndex, e.target.value)}
                            placeholder={`Feature ${featIndex + 1}`}
                            required
                          />
                          {pkg.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePackageFeature(pkgIndex, featIndex)}
                              className={styles.removeBtn}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addPackageFeature(pkgIndex)}
                        className={styles.addFeatureBtn}
                      >
                        <i className="fa-solid fa-plus"></i> Add Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active (visible on website)</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="showInFooter"
                checked={formData.showInFooter}
                onChange={handleChange}
              />
              <span>Show in footer</span>
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </form>

      <div className={styles.servicesList}>
        <h3>Existing Services ({services?.length || 0})</h3>
        {services && services.length > 0 ? (
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={service._id} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>
                  <div className={styles.cardTitle}>
                    <h4>{service.title}</h4>
                    <div className={styles.badges}>
                      {!service.isActive && (
                        <span className={styles.inactiveBadge}>Inactive</span>
                      )}
                      {service.showInFooter && (
                        <span className={styles.footerBadge}>Footer</span>
                      )}
                      {service.hasPackages && (
                        <span className={styles.packageBadge}>
                          {service.packages.length} Package{service.packages.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className={styles.cardDescription}>{service.description}</p>

                {service.hasPackages && service.packages.length > 0 ? (
                  <div className={styles.packagesSummary}>
                    {service.packages.map((pkg, idx) => (
                      <div key={idx} className={styles.packageSummaryItem}>
                        <strong>{pkg.name}</strong>: {pkg.price}
                        <small>{pkg.features.length} features</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {service.features && service.features.length > 0 && (
                      <ul className={styles.featuresList}>
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                        {service.features.length > 3 && (
                          <li className={styles.moreFeatures}>
                            +{service.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                    {service.price && (
                      <div className={styles.cardPrice}>{service.price}</div>
                    )}
                  </>
                )}

                <div className={styles.cardActions}>
                  <div className={styles.orderButtons}>
                    <button
                      onClick={() => handleReorder(service._id, 'up')}
                      disabled={index === 0}
                      className={styles.reorderBtn}
                      title="Move up"
                    >
                      <i className="fa-solid fa-arrow-up"></i>
                    </button>
                    <button
                      onClick={() => handleReorder(service._id, 'down')}
                      disabled={index === services.length - 1}
                      className={styles.reorderBtn}
                      title="Move down"
                    >
                      <i className="fa-solid fa-arrow-down"></i>
                    </button>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleEdit(service)}
                      className={styles.editBtn}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className={styles.deleteBtn}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No services yet. Create your first service above!
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceEditor;