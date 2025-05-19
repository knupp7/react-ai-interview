import React, { useState } from "react";
import styles from "../../styles/QuestionAccordion.module.css";

export default function QuestionAccordion({ question, answer, aiFeedback, index }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <p><strong>AI 피드백:</strong> {aiFeedback}</p>
        </div>
      )}
    </div>
  );
}