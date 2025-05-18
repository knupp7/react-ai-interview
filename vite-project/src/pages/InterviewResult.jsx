import { useLocation } from "react-router-dom";
import ExportPDFButton from "./interview-result-comps/ExportPDFButton";
import GaugeChart from "./interview-result-comps/GaugeChart";
import RadarChart from "./interview-result-comps/RadarChart";
import CategoryFeedbackBlock from "./interview-result-comps/CategoryFeedbackBlock";
import QuestionAccordion from "./interview-result-comps/QuestionAccordion";
import { score, radarScores, totalQuestions, missedQuestions, categoryFeedback } from "../data/interviewScoreData"
import { mockQuestions } from "../data/interviewMockQuestions";
import styles from "../styles/InterviewResult.module.css";

export default function InterviewResult() {
    const location = useLocation();
    const formData = location.state;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <p className={styles.metaTitle}>2025-05-19 네이버 모바일 기술면접</p>
                <ExportPDFButton />
            </div>

            <div id="export-target" className={styles.reportBox}>
                <section>
                    <h2 className={styles.sectionTitle}>분석 요약</h2>
                    <div className={styles.gaugeRow}>
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
                    </div>
                </section>

                <section className={styles.radar}>
                    <h2 className={styles.sectionTitle}>카테고리별 평가</h2>
                    <RadarChart data={radarScores} />
                </section>

                {categoryFeedback.map((item, index) => (
                    <CategoryFeedbackBlock key={index} {...item} />
                ))}

                <section style={{ marginTop: "2rem" }}>
                    <h2 className={styles.sectionTitle}>질문 상세 분석</h2>
                    {mockQuestions.map((q, idx) => (
                        <QuestionAccordion
                            key={idx}
                            index={idx}
                            question={q.question}
                            answer={q.answer}
                            aiFeedback={q.aiFeedback}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
}