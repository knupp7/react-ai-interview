import React from 'react';
import styles from '../../styles/ExportPDFButton.module.css';

const ExportPDFButton = ({ onExport }) => {
  return (
    <button onClick={onExport} className={styles.exportButton}>
      PDF 내보내기
    </button>
  );
};

export default ExportPDFButton;