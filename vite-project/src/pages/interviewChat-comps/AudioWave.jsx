// AudioWave.jsx
import { useEffect, useMemo, useRef } from "react";
import styles from "../../styles/AudioWave.module.css";

const BAR_COUNT = 50;

export default function AudioWave({ analyser }) {
  const rafRef = useRef(null);
  const barsRef = useRef([]);            // 각 막대 DOM 참조
  const emaRef = useRef(new Float32Array(BAR_COUNT)); // 부드럽게(감쇠)용
  const dataRef = useRef(null);          // Uint8Array 재사용

  // 빈 div를 고정 렌더(리렌더링 없음)
  const bars = useMemo(
    () => Array.from({ length: BAR_COUNT }, (_, i) => <div key={i} className={styles.bar} ref={el => (barsRef.current[i] = el)} />),
    []
  );

  useEffect(() => {
    if (!analyser) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // 주파수 도메인 사용 (스펙트럼 느낌). 필요시 getByteTimeDomainData로 교체 가능.
    const binCount = analyser.frequencyBinCount; // fftSize / 2
    if (!dataRef.current || dataRef.current.length !== binCount) {
      dataRef.current = new Uint8Array(binCount);
    }
    const buf = dataRef.current;

    // 한 막대가 먹을 bin 개수
    const binsPerBar = Math.max(1, Math.floor(binCount / BAR_COUNT));
    const alphaUp = 0.5;   // 빠르게 올라가고
    const alphaDown = 0.15; // 천천히 내려오게 (감쇠)

    const tick = () => {
      analyser.getByteFrequencyData(buf); // 0..255

      // 집계 → 0..1 정규화
      for (let b = 0; b < BAR_COUNT; b++) {
        const start = b * binsPerBar;
        const end = Math.min(binCount, start + binsPerBar);
        let sum = 0;
        for (let i = start; i < end; i++) sum += buf[i];
        const avg = sum / (end - start || 1); // 0..255
        const target = avg / 255;             // 0..1

        // EMA (올라갈 때/내려갈 때 가중치 다르게)
        const prev = emaRef.current[b];
        const a = target > prev ? alphaUp : alphaDown;
        const next = prev + (target - prev) * a;
        emaRef.current[b] = next;

        // transform으로만 반영 (리플로우 회피)
        const el = barsRef.current[b];
        if (el) el.style.transform = `scaleY(${0.08 + next * 0.92})`; // 0.08~1.0
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser]);

  return (
    <div className={styles.waveContainer}>
      <div className={styles.wave}>
        {bars}
      </div>
    </div>
  );
}
