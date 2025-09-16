import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/InterviewResult.module.css";
import { RESULT_STRINGS } from "../../constants/interviewResultStrings";

const FinalFeedback = ({ contents }) => {
    return (
        <section className={`${styles.sectionSpacing} ${styles.sectionCard}`}>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleAccentSm}`}>
                {RESULT_STRINGS.final}
            </h2>
            <div className={`${styles.finalBox} ${styles.accentLeft}`}>
                <ReactMarkdown>{contents}</ReactMarkdown>
            </div>
        </section>
    );
};

export default FinalFeedback;
