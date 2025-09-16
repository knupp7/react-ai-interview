// src/components/LoadingOverlay.jsx
import { useEffect } from "react";
import styles from "../styles/LoadingOverlay.module.css";

export default function LoadingOverlay({
  isOpen,
  title = "면접 준비 중...",
  steps = [],
  currentStep = 0,
  message,          // 상세 설명 (선택)
  error,            // 에러 메시지 (선택)
  onCancel,         // 취소(뒤로가기 등) (선택)
  onRetry           // 재시도 (선택)
}) {
  useEffect(() => {
    const original = document.documentElement.style.overflow;
    if (isOpen) document.documentElement.style.overflow = "hidden";
    return () => (document.documentElement.style.overflow = original);
  }, [isOpen]);

  if (!isOpen) return null;

  const percent =
    steps.length > 0 ? Math.floor((currentStep / steps.length) * 100) : 0;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="loading-title">
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.spinner} aria-hidden />
          <h3 id="loading-title">{title}</h3>
        </div>

        {/* 진행 바 (선택) */}
        {steps.length > 0 && (
          <div className={styles.progressWrap} aria-live="polite">
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${percent}%` }} />
            </div>
            <span className={styles.progressText}>{percent}%</span>
          </div>
        )}

        {/* 단계 리스트
        <ul className={styles.stepList} aria-live="polite">
          {steps.map((s, idx) => (
            <li key={s} className={
              idx < currentStep ? styles.done
              : idx === currentStep ? styles.active
              : ""
            }>
              {s}
            </li>
          ))}
        </ul> */}

        {/* 상세 설명 */}
        {message && <p className={styles.message} aria-live="polite">{message}</p>}

        {/* 에러 영역 */}
        {error && (
          <div className={styles.error} role="alert">
            <strong>문제가 발생했어요.</strong>
            <p>{error}</p>
            <div className={styles.actions}>
              {onRetry && <button onClick={onRetry} className={styles.primary}>다시 시도</button>}
              {onCancel && <button onClick={onCancel} className={styles.secondary}>취소</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
