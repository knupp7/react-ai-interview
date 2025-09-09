// src/components/interviewChat-comps/SpeechStreamButtonWS.jsx
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/interviewChat.module.css";

const TARGET_SR = 16000;

// 다운샘플링(F32 → F32 @16k)
const downsample = (float32, inRate, outRate) => {
  if (inRate === outRate) return float32;
  const ratio = inRate / outRate;
  const newLen = Math.floor(float32.length / ratio);
  const out = new Float32Array(newLen);
  let pos = 0;
  for (let i = 0; i < newLen; i++) {
    const nextPos = (i + 1) * ratio;
    let sum = 0, count = 0;
    for (; pos < nextPos && pos < float32.length; pos++) {
      sum += float32[Math.floor(pos)];
      count++;
    }
    out[i] = sum / (count || 1);
  }
  return out;
};

// F32 → S16LE
const floatTo16 = (float32) => {
  const out = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    let s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
};

const SpeechStreamButtonWS = ({ wsRef, onUserText }) => {
  const mediaRef = useRef(null);
  const procRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [isRec, setIsRec] = useState(false);
  const [hint, setHint] = useState("");

  const start = async () => {
    if (isRec) return;
    try {
      // 발화 시작 알림(서버가 이 시점부터 STT 버퍼링)
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "UTTERANCE_START", format: "pcm_s16le" }));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);

      const proc = audioCtx.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = (ev) => {
        const input = ev.inputBuffer.getChannelData(0);
        const ds = downsample(input, audioCtx.sampleRate, TARGET_SR);
        const pcm16 = floatTo16(ds);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(pcm16.buffer); // 🔹 같은 WS로 바이너리 전송
        }
      };
      procRef.current = proc;
      source.connect(proc);
      proc.connect(audioCtx.destination); // or 제거

      setIsRec(true);
      setHint("녹음 중…");
    } catch (e) {
      setHint(`마이크 오류: ${e.message}`);
      stop();
    }
  };

  const stop = () => {
    try { procRef.current?.disconnect(); } catch {}
    procRef.current = null;

    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;

    try { mediaRef.current?.getTracks?.().forEach(t => t.stop()); } catch {}
    mediaRef.current = null;

    setIsRec(false);
    setHint("");

    // 발화 종료 알림 (서버가 여기서 STT 수행 → 질문/오디오 응답 푸시)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "UTTERANCE_END" }));
    }

    // (선택) 사용자가 방금 말한 텍스트를 UI에 선반영하고 싶다면
    // onUserText?.("(사용자 발화 전송됨)");
  };

  useEffect(() => () => stop(), []);

  return (
    <div className={styles.inputRow}>
      <button
        className={`${styles.micBtn} ${isRec ? styles.active : ""}`}
        onClick={isRec ? stop : start}
        aria-pressed={isRec}
        title={isRec ? "녹음 종료" : "녹음 시작"}
      >
        🎤
      </button>

      <div className={styles.sttPreview}>
        {isRec
          ? <span className={styles.interimText}>{hint || "녹음 중…"}</span>
          : <span className={styles.sttTextMuted}>마이크 대기</span>}
      </div>
    </div>
  );
};

export default SpeechStreamButtonWS;
