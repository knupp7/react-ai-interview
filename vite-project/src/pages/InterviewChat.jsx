import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/interviewChat.module.css";
import InterviewerAgent from "./interviewChat-comps/InterviewerAgent";
import ChattingArea from "./interviewChat-comps/ChattingArea";
// import InputBox from "./interviewChat-comps/InputBox";
import SpeechStreamButtonWS from "./interviewChat-comps/SpeechStreamButtonWS";

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

  const wsRef = useRef(null);                  // ★ 단일 WS
  const audioRecvRef = useRef(null);           // { mime, chunks: [] }
  const audioQueueRef = useRef([]);            // 재생 큐
  const audioElRef = useRef(null);

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
    const ws = new WebSocket(`ws://localhost:8000/sessions/${sessionCode}/ws/chat`);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      // 핸드셰이크: 포맷/수용 가능한 TTS MIME 알림
      ws.send(JSON.stringify({
        type: "HELLO",
        sessionCode,
        audio: { format: "pcm_s16le", sample_rate: 16000, channels: 1 },
        ttsAccepted: ["audio/webm;codecs=opus", "audio/wav"]
      }));
    };

    ws.onmessage = (event) => {
      // 텍스트(JSON) or 바이너리(ArrayBuffer)
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "QUESTION":
              setMsg(prev => [...prev, { from: "ai", text: data.text }]);
              break;
            case "EVENT":
              if (data.name === "면접 종료") {
                localStorage.setItem("interviewFinished", "true");
                alert("면접이 종료되었습니다. 면접 종료 버튼을 눌러주세요.");
                setIsInterviewFinished(true);
              }
              break;
            case "AUDIO_START":
              audioRecvRef.current = { mime: data.mime || "audio/webm", chunks: [] };
              break;
            case "AUDIO_END":
              if (audioRecvRef.current) {
                const { mime, chunks } = audioRecvRef.current;
                const blob = new Blob(chunks, { type: mime });
                audioRecvRef.current = null;
                enqueueAndPlay(blob);
              }
              break;
            case "FINAL_TEXT": // (선택) 서버가 텍스트로도 넘겨줄 때
              setMsg(prev => [...prev, { from: "ai", text: data.text }]);
              break;
            default:
              break;
          }
        } catch { }
      } else {
        // 바이너리(TTS 청크)
        if (audioRecvRef.current) {
          audioRecvRef.current.chunks.push(new Blob([event.data]));
        }
      }
    };

    ws.onclose = (e) => { console.log("WS closed:", e.code, e.reason); wsRef.current = null; };
    ws.onerror = (e) => { console.error("WS error:", e); };

    return () => {
      try {
        ws.close();
      } catch { }
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

  return (
    <div className={styles.interviewContainer}>
      <div className={styles.header}>
        <InterviewerAgent profile={persona} />
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
        <SpeechStreamButtonWS wsRef={wsRef} onUserText={appendUserText} />
      </div>
    </div>
  );
}
