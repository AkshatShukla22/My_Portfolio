// frontend/src/components/home/ServicesSection/ServicesSection.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES_PER_PAGE = 6;

const ServicesSection = ({ data }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedPackages, setSelectedPackages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Initialize selected packages (default to first package)
    const initialPackages = {};
    data.forEach(service => {
      if (service.hasPackages && service.packages.length > 0) {
        initialPackages[service._id] = 0; // Index of first package
      }
    });
    setSelectedPackages(initialPackages);

    const ctx = gsap.context(() => {
      // Animate cards
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data, currentPage]);

  if (!data || data.length === 0) return null;

  const activeServices = data.filter(service => service.isActive);

  if (activeServices.length === 0) return null;

  // Pagination calculations
  const totalPages = Math.ceil(activeServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const endIndex = startIndex + SERVICES_PER_PAGE;
  const currentServices = activeServices.slice(startIndex, endIndex);

  const handlePackageSelect = (serviceId, packageIndex) => {
    setSelectedPackages(prev => ({
      ...prev,
      [serviceId]: packageIndex
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to section top smoothly
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <section ref={sectionRef} className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>What I Do</h2>
          <p className={styles.subtitle}>
            Professional services tailored to bring your ideas to life
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {currentServices.map((service, index) => {
            const hasPackages = service.hasPackages && service.packages && service.packages.length > 0;
            const selectedPkgIndex = hasPackages ? (selectedPackages[service._id] || 0) : null;
            const selectedPackage = hasPackages ? service.packages[selectedPkgIndex] : null;

            return (
              <div
                key={service._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={styles.serviceCard}
              >
                <div className={styles.cardInner}>
                  <div className={styles.iconWrapper}>
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>

                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>

                  {hasPackages ? (
                    <>
                      {/* Package Tabs */}
                      <div className={styles.packageTabs}>
                        {service.packages.map((pkg, pkgIndex) => (
                          <button
                            key={pkgIndex}
                            className={`${styles.packageTab} ${
                              selectedPkgIndex === pkgIndex ? styles.activeTab : ''
                            }`}
                            onClick={() => handlePackageSelect(service._id, pkgIndex)}
                          >
                            {pkg.name}
                          </button>
                        ))}
                      </div>

                      {/* Selected Package Details */}
                      {selectedPackage && (
                        <div className={styles.packageDetails}>
                          <p className={styles.packageDescription}>
                            {selectedPackage.description}
                          </p>

                          <div className={styles.packageMeta}>
                            <div className={styles.metaItem}>
                              <i className="fa-solid fa-clock"></i>
                              <span>{selectedPackage.deliveryTime}</span>
                            </div>
                            <div className={styles.metaItem}>
                              <i className="fa-solid fa-rotate"></i>
                              <span>{selectedPackage.revisions}</span>
                            </div>
                          </div>

                          {selectedPackage.features && selectedPackage.features.length > 0 && (
                            <ul className={styles.featuresList}>
                              {selectedPackage.features.map((feature, idx) => (
                                <li key={idx}>
                                  <i className="fa-solid fa-check"></i>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className={styles.priceWrapper}>
                            <span className={styles.price}>{selectedPackage.price}</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Simple Service (No Packages) */}
                      {service.features && service.features.length > 0 && (
                        <ul className={styles.featuresList}>
                          {service.features.map((feature, idx) => (
                            <li key={idx}>
                              <i className="fa-solid fa-check"></i>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {service.price && (
                        <div className={styles.priceWrapper}>
                          <span className={styles.price}>{service.price}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                onClick={() => handlePageChange(page)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}

            <button
              className={styles.pageButton}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;