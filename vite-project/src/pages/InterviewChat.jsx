import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/interviewChat.module.css";
import InterviewerAgent from "./interviewChat-comps/InterviewerAgent";
import ChattingArea from "./interviewChat-comps/ChattingArea";
import InputBox from "./interviewChat-comps/InputBox";

export default function InterviewStart() {
  const location = useLocation();
  const formData = location.state;
  const navigate = useNavigate();

  const [persona, setPersona] = useState({
    name: "면접관",
    department: "AI Assistant",
    profileImage: "/bot_avatar.png"
  });
  const [msg, setMsg] = useState([]);
  const socketRef = useRef(null);
  const sessionCode = localStorage.getItem("sessionCode");

  const userProfile = {
    name: formData.name || "나졸업",
    profileImage: formData.name || "/duri.png"
  };

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

  useEffect(() => {
    if (!sessionCode || !persona) return;

    const socket = new WebSocket(`ws://localhost:8000/sessions/${sessionCode}/ws/chat`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.question) {
        setMsg((prev) => [...prev, { from: 'ai', text: data.question }]);
      } else if (data.event === "면접 종료") {
        alert(data.message);
        navigate("/interview/result", { state: formData });
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    return () => {
      socket.close();
    };
  }, [sessionCode, persona, navigate, formData]);

  const handleStartInterviewResult = () => {
    navigate("/interview/result", { state: formData });
  };

  const handleSend = (text) => {
    setMsg((prev) => [...prev, { from: 'user', text }]);
    socketRef.current?.send(text);
  };

  return (
    <div className={styles.interviewContainer}>
      <div className={styles.header}>
        <InterviewerAgent profile={persona} />
        <button className={styles.endInterviewBtn} onClick={handleStartInterviewResult}>면접종료</button>
      </div>

      {/**
       * messeges: 대화 데이터
       * interviewer: 면접관 프로필
       * interviewee: 면접자(유저) 프로필
       */}
      <div className={styles.chatWrapper}>
        <ChattingArea messages={msg} interviewer={persona} interviewee={userProfile} />
        <InputBox onSend={handleSend} />
      </div>
    </div>
  );
}
