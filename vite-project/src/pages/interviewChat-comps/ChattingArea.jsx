import styles from "../../styles/interviewChat.module.css";

const ChattingArea = ({ messages, interviewer, interviewee }) => {
  return (
    <div className={styles.chatContainer}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.from === 'ai' ? styles.messageBot : styles.messageUser}
        >
          {msg.from === 'ai' && <img src={interviewee.profileImage} alt="bot" />}
          <div className={styles.bubble}>{msg.text}</div>
          {msg.from === 'user' && <img src={interviewee.profileImage} alt="you" />}
        </div>
      ))}
    </div>
  );
}

export default ChattingArea;