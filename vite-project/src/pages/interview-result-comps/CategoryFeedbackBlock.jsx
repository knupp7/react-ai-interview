import React from "react";
import styles from "../../styles/CategoryFeedbackBlock.module.css";

export default function CategoryFeedbackBlock({ icon, category, good, bad }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>
        <span className={styles.icon}>{icon}</span> {category}
      </h3>
      <div className={styles.feedback}>
        <p><strong>✅ 잘한점</strong></p>
        <p>{good}</p>
      </div>
      <div className={styles.feedback}>
        <p><strong>❌ 부족한점</strong></p>
        <p>{bad}</p>
      </div>
    </div>
  );
}
