import React from "react";
import styles from "../../styles/CategoryFeedbackBlock.module.css";

// export default function CategoryFeedbackBlock({ icon, category, good, bad }) {
export default function CategoryFeedbackBlock({ feedback }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>
        {feedback.key}
      </h3>
      <div className={styles.feedback}>
        <p>{feedback.text}</p>
      </div>
    </div>
  );
}
