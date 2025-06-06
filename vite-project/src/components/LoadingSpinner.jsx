import { useEffect } from 'react';
import styles from '../styles/LoadingSpinner.module.css'; // CSS 모듈로 해도 됨

export default function LoadingSpinner() {
  useEffect(() => {
    const original = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = original;
    };
  }, []);

  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner} />
    </div>
  );
}