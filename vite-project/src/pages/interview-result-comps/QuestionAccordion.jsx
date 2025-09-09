import React, { useEffect, useState } from "react";
import styles from "../../styles/QuestionAccordion.module.css";

const categories = [
  "기술 이해도",
  "문제 해결력",
  "기초 지식 응용력",
  "의사소통 능력",
  "태도 및 자기 인식"
];

export default function QuestionAccordion({ question, answer, scores, feedbacks, index, forceOpen = false }) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={`${styles.header} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>질문 {index + 1}</span>
        <span className={styles.icon} aria-hidden>▼</span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <p className={styles.row}>
            <strong className={styles.label}>질문 내용</strong>
            <span className={styles.text}>{question}</span>
          </p>
          <p className={styles.row}>
            <strong className={styles.label}>내 답변</strong>
            <span className={styles.text}>{answer}</span>
          </p>

          <div className={styles.feedbackBlock}>
            <p className={styles.fbHeader}><strong>AI 피드백</strong></p>
            {feedbacks.map((fb, i) => (
              <div key={i} className={styles.feedbackItem}>
                <div className={styles.feedbackHead}>
                  <span className={styles.badge}>{categories[i]}</span>
                  <span className={styles.score}>점수 {scores[i]}</span>
                </div>
                <p className={styles.feedbackText}>{fb}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}