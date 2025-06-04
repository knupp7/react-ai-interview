import React from 'react';
import styles from '../styles/LoadingSpinner.module.css'; // CSS 모듈로 해도 됨

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner} />
    </div>
  );
}