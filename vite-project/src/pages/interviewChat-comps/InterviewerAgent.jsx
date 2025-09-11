import styles from "../../styles/interviewChat.module.css";

const InterviewerAgent = ({ profile, status }) => {
    const isListening =
        status && (typeof status.isListening === "boolean"
            ? status.isListening
            : status.label === "듣는 중");

    return (
        <div className={styles.interviwerAgentContainer}>
            <img src={profile.profileImage} alt="interviewer" />
            <div className={styles.interviwerAgentProfile}>
                <h2>{profile.name} [{profile.department}]</h2>
                <p>Virtual Interview Assistant</p>

                {/* 상태 뱃지 (status가 있을 때만 렌더) */}
                {status && (
                    <span className={`${styles.statusPill} ${status.cls || ""}`}>
                        {status.label}
                        {isListening && (
                            <span className={styles.statusDots}><i /><i /><i /></span>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InterviewerAgent;    