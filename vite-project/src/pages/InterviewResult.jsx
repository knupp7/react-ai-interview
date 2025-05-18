import { useLocation } from "react-router-dom";
import ExportPDFButton from "./interview-result-comps/ExportPDFButton";
import GaugeChart from "./interview-result-comps/GaugeChart";
import RadarChart from "./interview-result-comps/RadarChart";
import CategoryFeedbackBlock from "./interview-result-comps/CategoryFeedbackBlock";
import { score, radarScores, totalQuestions, missedQuestions, categoryFeedback } from "../data/interviewScoreData"
import styles from "../styles/InterviewResult.module.css";

export default function InterviewResult() {
    const location = useLocation();
    const formData = location.state;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>2025-05-19 네이버 모바일 기술면접</h1>

            <div id="export-target" className={styles.reportBox}>
                <section className={styles.summary}>
                    <h2>분석 요약</h2>
                    <GaugeChart score={score} />
                    <div className={styles.questionBox}>
                        <div className={styles.questionCard}>
                            <p className={styles.label}>총 질문 수</p>
                            <p className={styles.value}>{totalQuestions}</p>
                        </div>
                        <div className={styles.questionCard}>
                            <p className={styles.label}>놓친 질문 수</p>
                            <p className={styles.value}>{missedQuestions} / {totalQuestions}</p>
                        </div>
                    </div>
                </section>

                <section className={styles.radar}>
                    <h2>카테고리별 평가</h2>
                    <RadarChart data={radarScores} />
                </section>

                {categoryFeedback.map((item, index) => (
                    <CategoryFeedbackBlock key={index} {...item} />
                ))}
            </div>

            <ExportPDFButton />
        </div>
    );
}