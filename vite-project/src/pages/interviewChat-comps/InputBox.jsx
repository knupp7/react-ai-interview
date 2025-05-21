import { useState } from "react";
import styles from "../../styles/interviewChat.module.css";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.inputBox}>
      <input
        type="text"
        placeholder="답변을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleSubmit}
      />
      <button onClick={handleSend}>➤</button>
    </div>
  );
}

export default InputBox;