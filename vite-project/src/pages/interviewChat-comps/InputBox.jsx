import { useState } from "react";
import styles from "../../styles/interviewChat.module.css";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { //shift+Enter는 엔터 기능 유지
      e.preventDefault(); // 줄바꿈 방지
      handleSend();
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <textarea
        className={styles.inputArea}
        type="text"
        placeholder="답변을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.sendBtn} onClick={handleSend}>➤</button>
    </div>
  );
}

export default InputBox;