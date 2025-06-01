import { useEffect, useRef } from "react";
import styles from "../../styles/interviewChat.module.css";

const ChattingArea = ({ messages, interviewer, interviewee }) => {
  const bottomRef = useRef(null);
  // 메시지가 바뀔 때마다 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.from === 'ai' ? styles.messageBot : styles.messageUser}
        >
          {msg.from === 'ai' && <img src={interviewer.profileImage} alt="bot" />}
          <div className={styles.bubble}>{msg.text}</div>
          {msg.from === 'user' && <img src={interviewee.profileImage} alt="you" />}
        </div>
      ))}
      <div ref={bottomRef} /> {/* 스크롤을 위한 빈 div */}
    </div>
  );
}

export default ChattingArea;