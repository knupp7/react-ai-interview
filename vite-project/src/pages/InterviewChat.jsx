import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/interviewChat.module.css";
import InterviewerAgent from "./interviewChat-comps/InterviewerAgent";
import ChattingArea from "./interviewChat-comps/ChattingArea";
// import InputBox from "./interviewChat-comps/InputBox";
// import SpeechStreamButtonWS from "./interviewChat-comps/SpeechStreamButtonWS";
// import SpeechAnswerButtonMP3 from "./interviewChat-comps/SpeechAnswerButtonMP3";
import SpeechAnswerButtonFFmpeg from "./interviewChat-comps/SpeechAnswerButtonFFmpeg";

export default function InterviewStart() {
  const location = useLocation();
  const formData = location.state || {};
  const navigate = useNavigate();

  const [persona, setPersona] = useState({
    name: "면접관",
    department: "AI Assistant",
    profileImage: "/bot_avatar.png"
  });
  const [msg, setMsg] = useState([]);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);

  const [sttReady, setSttReady] = useState(false);
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);
  const wsRef = useRef(null);


  const audioRecvRef = useRef(null);           // { mime, chunks: [] }
  const audioQueueRef = useRef([]);            // 재생 큐
  const audioElRef = useRef(null);

  const rxPcmRef = useRef(null);      // { sr, fmt, chunks: ArrayBuffer[] }
  const audioCtxRef = useRef(null);

  const sessionCode = localStorage.getItem("sessionCode");
  const userProfile = {
    name: formData.name || "나졸업",
    profileImage: "/duri.png"
  };

  // 인터뷰 완료되었다면 결과 페이지로 이동
  useEffect(() => {
    const isFinished = localStorage.getItem("interviewFinished") === "true";
    if (isFinished) {
      navigate("/interview/result");
    }
  }, []);

  // 페르소나 로드
  useEffect(() => {
    const savedPersona = localStorage.getItem("persona");
    if (savedPersona) {
      try {
        setPersona(JSON.parse(savedPersona));
      } catch (e) {
        console.error("persona 파싱 실패:", e);
      }
    } else {
      console.warn("페르소나가 저장되어 있지 않습니다.");
    }
  }, []);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  };

  // ArrayBuffer[] -> ArrayBuffer
  const concatArrayBuffers = (chunks) => {
    const total = chunks.reduce((n, ab) => n + ab.byteLength, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const ab of chunks) { out.set(new Uint8Array(ab), off); off += ab.byteLength; }
    return out.buffer;
  };

  // PCM S16LE -> Float32 [-1,1]
  const s16ToF32 = (ab) => {
    const in16 = new Int16Array(ab);
    const out = new Float32Array(in16.length);
    for (let i = 0; i < in16.length; i++) out[i] = in16[i] / 0x8000;
    return out;
  };

  const playPcm = async (float32, sampleRate) => {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") { try { await ctx.resume(); } catch { } }
    const buf = ctx.createBuffer(1, float32.length, sampleRate);
    buf.copyToChannel(float32, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  };

  // 재생 큐 유틸
  const playNext = () => {
    if (!audioQueueRef.current.length) {
      if (audioElRef.current) {
        // 마지막 URL 정리
        try { URL.revokeObjectURL(audioElRef.current.src); } catch { }
      }
      audioElRef.current = null;
      return;
    }
    const blob = audioQueueRef.current.shift();
    const url = URL.createObjectURL(blob);
    let el = audioElRef.current;
    if (!el) {
      el = new Audio();
      el.addEventListener("ended", () => {
        try { URL.revokeObjectURL(el.src); } catch { }
        playNext();
      });
      audioElRef.current = el;
    } else {
      try { URL.revokeObjectURL(el.src); } catch { }
    }
    el.src = url;
    el.play().catch(() => { });
  };

  const enqueueAndPlay = (blob) => {
    audioQueueRef.current.push(blob);
    if (!audioElRef.current) playNext();
  };

  // WS
  useEffect(() => {
    if (!sessionCode) return;
    const ws = new WebSocket(`ws://localhost:8000/sessions/${sessionCode}/ws/stt`);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;
    let alive = true;

    ws.onopen = () => {
      // // 핸드셰이크: 포맷/수용 가능한 TTS MIME 알림
      // ws.send(JSON.stringify({
      //   type: "HELLO",
      //   sessionCode,
      //   audio: { format: "pcm_s16le", sample_rate: 16000, channels: 1 },
      //   ttsAccepted: ["audio/webm;codecs=opus", "audio/wav"]
      // }));
      console.log("STT WS open");
      if (!alive) return;
      if (wsRef.current === ws) setSttReady(true);
    };

    ws.onmessage = (event) => {
      // 텍스트(JSON) or 바이너리(ArrayBuffer)
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          const evt = data.type || data.event;

          switch (evt) {
            case "QUESTION":
            case "question":
              setMsg(prev => [...prev, { from: "ai", text: data.text || data.question }]);
              break;

            case "면접 종료":
              localStorage.setItem("interviewFinished", "true");
              alert("면접이 종료되었습니다. 면접 종료 버튼을 눌러주세요.");
              setIsInterviewFinished(true);
              break;

            // 서버가 보내는 PCM 전용 이벤트 (질문 오디오)
            case "question_audio_start":
              rxPcmRef.current = {
                sr: data.sample_rate || 16000,
                fmt: data.format || "pcm_s16le",
                chunks: [],
              };
              setAwaitingAnswer(false);
              break;

            case "question_audio_end":
              if (rxPcmRef.current?.chunks?.length) {
                const merged = concatArrayBuffers(rxPcmRef.current.chunks);
                const f32 = s16ToF32(merged);
                playPcm(f32, rxPcmRef.current.sr);
              }
              setAwaitingAnswer(true);
              rxPcmRef.current = null;
              break;

            case "final_text":
              setMsg(prev => [...prev, { from: "ai", text: data.text || data.final_text }]);
              break;

            default:
              break;
          }
        } catch { }
      } else {
        // 바이너리(TTS 청크)
        if (rxPcmRef.current) {
          // PCM: ArrayBuffer 그대로 누적
          rxPcmRef.current.chunks.push(event.data);
        } else if (audioRecvRef.current) {
          // 컨테이너 오디오(webm/wav): Blob으로 누적
          audioRecvRef.current.chunks.push(new Blob([event.data]));
        }
      }
    };

    ws.onclose = (e) => {
      console.log("WS closed:", e.code, e.reason);
      if (!alive) return;
      if (wsRef.current === ws) {                    // 최신 소켓일 때만 정리
        wsRef.current = null;
        setSttReady(false);
        setAwaitingAnswer(false);
      }
    };
    ws.onerror = (e) => { console.error("WS error:", e); };

    return () => {
      alive = false;
      if (wsRef.current === ws) {                    // 내가 만든 소켓만 닫기
        try {
          ws.close();
        } catch { }
        wsRef.current = null;
      }
      //  오디오 자원 정리
      audioQueueRef.current = [];
      if (audioElRef.current) {
        try { audioElRef.current.pause(); } catch { }
        try { URL.revokeObjectURL(audioElRef.current.src); } catch { }
        audioElRef.current = null;
      }
    };
  }, [sessionCode]);

  // 사용자가 말한 후 서버가 STT→텍스트를 되돌려주지 않는 경우,
  // 클라에서 "내가 말한 텍스트" 말풍선은 필요하면 별도로 띄울 수도 있음.
  const appendUserText = (text) => {
    setMsg(prev => [...prev, { from: "user", text }]);
  };

  // 종료 버튼
  const handleStartInterviewResult = () => {
    navigate("/interview/result", { state: formData });
  };

  // const handleSend = (text) => {
  //   if (!text) return;
  //   setMsg((prev) => [...prev, { from: "user", text }]);
  //   socketRef.current?.send(text);
  // };

  const status = !sttReady
    ? { label: "연결 대기", cls: styles.statusOff }
    : awaitingAnswer
      ? { label: "내 차례", cls: styles.statusReady }
      : { label: "면접관이 말하는 중", cls: styles.statusListening };

  return (
    <div className={styles.interviewContainer}>
      <div className={styles.header}>
        <InterviewerAgent profile={persona} status={status} />
        <button
          className={styles.endInterviewBtn}
          onClick={handleStartInterviewResult}
          disabled={!isInterviewFinished}
        >
          면접 종료
        </button>
      </div>

      {/**
       * messeges: 대화 데이터
       * interviewer: 면접관 프로필
       * interviewee: 면접자(유저) 프로필
       */}
      <div className={styles.chatWrapper}>
        <ChattingArea messages={msg} interviewer={persona} interviewee={userProfile} />
        {/* <InputBox onSend={handleSend} /> */}
        <SpeechAnswerButtonFFmpeg wsRef={wsRef} onUserText={appendUserText} canSend={sttReady && awaitingAnswer} />
      </div>
    </div>
  );
}
