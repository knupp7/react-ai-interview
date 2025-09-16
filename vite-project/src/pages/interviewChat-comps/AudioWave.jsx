// AudioWave.jsx
// v2, 대칭
import { useEffect, useMemo, useRef } from "react";
import styles from "../../styles/AudioWave.module.css";

const BAR_COUNT = 100;

export default function AudioWave({ analyser }) {
  const rafRef = useRef(null);
  const barsRef = useRef([]);
  const dataRef = useRef(null);
  const emaRef = useRef(null);

  const HALF = Math.floor(BAR_COUNT / 2);

  // 바 DOM 고정 렌더
  const bars = useMemo(
    () => Array.from({ length: BAR_COUNT }, (_, i) => (
      <div key={i} className={styles.bar} ref={el => (barsRef.current[i] = el)} />
    )),
    []
  );

  useEffect(() => {
    if (!analyser) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const binCount = analyser.frequencyBinCount; // = fftSize/2
    if (!dataRef.current || dataRef.current.length !== binCount) {
      dataRef.current = new Uint8Array(binCount);
    }
    if (!emaRef.current || emaRef.current.length !== HALF) {
      emaRef.current = new Float32Array(HALF);
    }

    const buf = dataRef.current;
    const binsPerBand = Math.max(1, Math.floor(binCount / HALF));
    const alphaUp = 0.5;    // 빠르게 올라가고
    const alphaDown = 0.15; // 천천히 내려오게

    const tick = () => {
      analyser.getByteFrequencyData(buf); // 0..255

      // b=0(저주파) 값을 "센터"에, b가 커질수록 바깥쪽으로
      for (let b = 0; b < HALF; b++) {
        const start = b * binsPerBand;
        const end = Math.min(binCount, start + binsPerBand);

        let sum = 0;
        for (let i = start; i < end; i++) sum += buf[i];
        let target = (sum / (end - start || 1)) / 255; // 0..1

        // 바깥으로 갈수록 살짝 감쇠(시각적인 테이퍼)
        target *= (1 - (b / HALF) * 0.25); // 1 → 0.75

        const prev = emaRef.current[b];
        const a = target > prev ? alphaUp : alphaDown;
        const next = prev + (target - prev) * a;
        emaRef.current[b] = next;

        // ← 왼쪽 / 오른쪽 → (센터 기준 대칭)
        const leftIdx  = HALF - 1 - b; // 가운데에서 왼쪽으로
        const rightIdx = HALF + b;     // 가운데에서 오른쪽으로
        const MIN_SCALE = 0.0;             // 완전 0까지 줄어듦
        const scale = MIN_SCALE + next * (1 - MIN_SCALE);

        const lEl = barsRef.current[leftIdx];
        const rEl = barsRef.current[rightIdx];
        if (lEl) lEl.style.transform = `scaleY(${scale})`;
        if (rEl) rEl.style.transform = `scaleY(${scale})`;
      }

      // 홀수 개를 쓰는 경우 중앙 막대 처리
      if (BAR_COUNT % 2 === 1) {
        const mid = HALF;
        const midVal = emaRef.current[0] || 0; // 가장 안쪽 밴드값 사용
        const mEl = barsRef.current[mid];
        if (mEl) mEl.style.transform = `scaleY(${0.08 + midVal * 0.92})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [analyser]);

  return (
    <div className={styles.waveContainer}>
      <div className={styles.wave}>
        {bars}
      </div>
    </div>
  );
}