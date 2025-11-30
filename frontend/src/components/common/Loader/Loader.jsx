// frontend/src/components/common/Loader/Loader.jsx
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loader;