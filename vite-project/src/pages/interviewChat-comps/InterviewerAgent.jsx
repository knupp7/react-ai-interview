import styles from "../../styles/interviewChat.module.css";

const InterviewerAgent = ({ profile }) => {

    return (
        <div className={styles.interviwerAgentContainer}>
            <img src={profile.profileImage} alt="interviewer" />
            <div className={styles.interviwerAgentProfile}>
                <h2>{profile.name} [{profile.department}]</h2>
                <p>Virtual Interview Assistant</p>
            </div>
        </div>
    );
}

export default InterviewerAgent;