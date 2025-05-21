import styles from "../../styles/interviewChat.module.css";

const InputBox = () => {
  return (
    <div className={styles.inputBox}>
      <input type="text" placeholder="답변을 입력해주세요" />
      <button>➤</button>
    </div>
  );
}

export default InputBox;