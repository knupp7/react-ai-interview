import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/interviewChat.module.css";
import InterviewerAgent from "./interviewChat-comps/InterviewerAgent";
import ChattingArea from "./interviewChat-comps/ChattingArea";
import InputBox from "./interviewChat-comps/InputBox";

export default function InterviewStart() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState([
    { from: 'ai', text: '안드로이드에서 LiveData와 StateFlow의 차이점을 설명해보시겠어요?' },
    { from: 'user', text: 'LiveData는 생명주기를 인식하고, XML과 잘 연동돼요.\nStateFlow는 코드로만 기반이고 구조가 더 깔끔하다고 알고 있어요.' },
  ]);

  const interviewerProfile = {
    interviewerName: "김도윤",
    department: "네이버 모바일 개발팀",
    interviewerProfileImage: "/bot_avatar.png"
  };

  const userProfile = {
    interviewerName: "김도윤",
    department: "네이버 모바일 개발팀",
    interviewerProfileImage: "/bot_avatar.png"
  };

  const handleStartInterviewResult = () => {
    navigate("/interview/result", { state: formData });
  };

  return (
    <div className={styles.interviewContainer}>
      <div className={styles.header}>
        <InterviewerAgent profile={interviewerProfile} />
        <button onClick={handleStartInterviewResult}>면접종료</button>
      </div>

      {/**
       * messeges: 대화 데이터
       * interviewer: 면접관 프로필
       * interviewee: 면접자(유저) 프로필
       */}
      <ChattingArea messages={msg} interviewer={interviewerProfile} interviewee={userProfile} />
      <InputBox onSend={(text) => { setMsg([...msg, { from: 'user', text }]) }} />
    </div>
  );
}
