import React from 'react';
import html2pdf from 'html2pdf.js';
import styles from '../../styles/ExportPDFButton.module.css';

const ExportPDFButton = () => {
  const handleExport = () => {
    const element = document.getElementById('export-target');
    html2pdf().set({
      margin: 0.5,
      filename: 'interview-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }).from(element).save();
  };

  return (
    <button onClick={handleExport} className={styles.exportButton}>
      PDF 내보내기
    </button>
  );
};

export default ExportPDFButton;