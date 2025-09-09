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
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        질문 {index + 1}
        <span className={styles.icon}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <p><strong>질문 내용:</strong> {question}</p>
          <p><strong>내 답변:</strong> {answer}</p>
          <div className={styles.feedbackBlock}>
            <p><strong>AI 피드백:</strong></p>
            {feedbacks.map((fb, i) => (
              <div key={i} className={styles.feedbackItem}>
                <p><strong>{categories[i]}</strong> (점수: {scores[i]})</p>
                <p>{fb}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}