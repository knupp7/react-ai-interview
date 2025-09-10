// src/components/interviewChat-comps/SpeechAnswerButtonMP3.jsx
import { useRef, useState, useEffect } from "react";
import styles from "../../styles/interviewChat.module.css";

export default function SpeechAnswerButtonMP3({ wsRef, onUserText }) {
  const [isRec, setIsRec] = useState(false);
  const [sec, setSec] = useState(0);
  const [hint, setHint] = useState("");
  const timerRef = useRef(null);
  const recRef = useRef(null);

  const start = async () => {
    if (isRec) return;
    try {
      recRef.current = new MicRecorder({ bitRate: 96 }); // 64~96kbps 추천
      await recRef.current.start();
      setIsRec(true);
      setHint("녹음 중…");
      timerRef.current = setInterval(() => setSec(s => s + 1), 1000);
    } catch (e) {
      setHint(`마이크 오류: ${e.message}`);
    }
  };

  const stop = async () => {
    try {
      const [buffer, blob] = await recRef.current.stop().getMp3(); // buffer:Array<number>, blob:Blob
      clearInterval(timerRef.current); timerRef.current = null;
      setSec(0);
      setIsRec(false);
      setHint(`인코딩 완료 ${Math.round(blob.size/1024)} KB`);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const ab = await blob.arrayBuffer();
        wsRef.current.send(ab);                 // send
        onUserText?.("(음성 응답 전송)");
      } else {
        setHint("WS 연결이 닫혀 있습니다");
      }
    } catch (e) {
      setHint(`인코딩/전송 실패: ${e.message}`);
      setIsRec(false);
    }
  };

  useEffect(() => () => { try { recRef.current?.stop(); } catch {} }, []);

  return (
    <div className={styles.inputRow}>
      <button
        className={`${styles.micBtn} ${isRec ? styles.active : ""}`}
        onClick={isRec ? stop : start}
        aria-pressed={isRec}
        title={isRec ? "녹음 종료(전송)" : "녹음 시작"}
      >🎤</button>

      <div className={styles.sttPreview}>
        {isRec
          ? <span className={styles.interimText}>
              녹음 {String(Math.floor(sec/60)).padStart(2,"0")}:{String(sec%60).padStart(2,"0")}
            </span>
          : <span className={styles.sttTextMuted}>마이크 대기</span>}
        {hint && <span style={{marginLeft:8, color:"#666"}}>{hint}</span>}
      </div>
    </div>
  );
}
