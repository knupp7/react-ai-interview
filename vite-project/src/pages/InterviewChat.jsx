import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/interviewChat.module.css";

export default function InterviewStart() {
  const navigate = useNavigate();

  const messages = [
    { from: 'ai', text: '안드로이드에서 LiveData와 StateFlow의 차이점을 설명해보시겠어요?' },
    { from: 'user', text: 'LiveData는 생명주기를 인식하고, XML과 잘 연동돼요.\nStateFlow는 코드로만 기반이고 구조가 더 깔끔하다고 알고 있어요.' },
    { from: 'ai', text: '“깔끔하다”고 했는데, 어떤 면에서 LiveData보다 StateFlow가 더 낫다고 보시나요?' },
    { from: 'user', text: 'StateFlow는 값이 항상 존재하고, 일시적인 값 변경이 가능해요. collect를 통해 상태를 알람되게 유지할 수 있고, 테스트가 쉬워요.' },
    { from: 'ai', text: '최근 레벨업 프로젝트에서 MVVM 패턴을 사용했다고 했는데, 실제 적용 경험이 있으신가요?' },
    { from: 'user', text: '네, 최근 앱 프로젝트에서 MVVM 패턴을 사용했습니다...' },
    { from: 'ai', text: '“깔끔하다”고 했는데, 어떤 면에서 LiveData보다 StateFlow가 더 낫다고 보시나요?' },
    { from: 'user', text: 'StateFlow는 값이 항상 존재하고, 일시적인 값 변경이 가능해요. collect를 통해 상태를 알람되게 유지할 수 있고, 테스트가 쉬워요.' },
    { from: 'ai', text: '최근 레벨업 프로젝트에서 MVVM 패턴을 사용했다고 했는데, 실제 적용 경험이 있으신가요?' },
    { from: 'user', text: '네, 최근 앱 프로젝트에서 MVVM 패턴을 사용했습니다...' },
    { from: 'ai', text: '“깔끔하다”고 했는데, 어떤 면에서 LiveData보다 StateFlow가 더 낫다고 보시나요?' },
    { from: 'user', text: 'StateFlow는 값이 항상 존재하고, 일시적인 값 변경이 가능해요. collect를 통해 상태를 알람되게 유지할 수 있고, 테스트가 쉬워요.' },
    { from: 'ai', text: '최근 레벨업 프로젝트에서 MVVM 패턴을 사용했다고 했는데, 실제 적용 경험이 있으신가요?' },
    { from: 'user', text: '네, 최근 앱 프로젝트에서 MVVM 패턴을 사용했습니다...' },
  ];

  const interviewerProfile = {
    interviewerName: "김도윤",
    department: "네이버 모바일 개발팀",
    interviewerProfileImage: "/bot_avatar.png"
  };

  const handleStartInterviewResult = () => {
    navigate("/interview/result", { state: formData });
  };

  return (
    <div className={styles.interviewContainer}>
      <header className={styles.header}>
        <div className={styles.interviwerAgentContainer}>
          <img src={interviewerProfile.interviewerProfileImage} alt="bot" />
          <div className={styles.interviwerAgentProfile}>
            <h2>{interviewerProfile.interviewerName} [{interviewerProfile.department}]</h2>
            <p>Virtual Interview Assistant</p>
          </div>
        </div>
        <button onClick={handleStartInterviewResult}>면접종료</button>
      </header>

      {/* 채팅 영역 */}
      <main className={styles.chatContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.from === 'ai' ? styles.messageBot : styles.messageUser}
          >
            {msg.from === 'ai' && <img src="/bot_avatar.png" alt="bot" />}
            <div className={styles.bubble}>{msg.text}</div>
            {msg.from === 'user' && <img src={interviewerProfile.profileImage} alt="you" />}
          </div>
        ))}
      </main>

      {/* 입력창 */}
      <div className={styles.inputBox}>
        <input type="text" placeholder="답변을 입력해주세요..." />
        <button>➤</button>
      </div>
    </div>
  );
}
