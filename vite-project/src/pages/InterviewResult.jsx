import { useLocation } from "react-router-dom";
import ExportPDFButton from "./interview-result-comps/ExportPDFButton";
import GaugeChart from "./interview-result-comps/GaugeChart";
import RadarChart from "./interview-result-comps/RadarChart";
import CategoryFeedbackBlock from "./interview-result-comps/CategoryFeedbackBlock";
import QuestionAccordion from "./interview-result-comps/QuestionAccordion";
import { score, radarScores, totalQuestions, missedQuestions, categoryFeedback } from "../data/interviewScoreData"
import { mockQuestions } from "../data/interviewMockQuestions";
import { finalFeedback } from "../data/interviewFinalFeedback";
import styles from "../styles/InterviewResult.module.css";

export default function InterviewResult() {
    const location = useLocation();
    const formData = location.state;

    return (
        <div className={styles.wrapper}>
            {/* ▶ 헤더: 상단 날짜 + PDF 버튼 */}
            <div className={styles.header}>
                <p className={styles.metaTitle}>2025-05-19 네이버 모바일 기술면접</p>
                <ExportPDFButton />
            </div>

            {/* ▶ PDF로 내보낼 전체 영역 */}
            <div id="export-target" className={styles.reportBox}>
                {/* ▷ 분석 요약 섹션: 게이지 + 질문 요약 */}
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

                {/* ▷ 카테고리별 평가 (레이더 차트) */}
                <section className={styles.sectionSpacing}>
                    <h2 className={styles.sectionTitle}>카테고리별 평가</h2>
                    <RadarChart data={radarScores} />
                </section>

                {/* ▷ 카테고리별 피드백 상세 블럭 */}
                {categoryFeedback.map((item, index) => (
                    <CategoryFeedbackBlock key={index} {...item} />
                ))}

                {/* ▷ 질문 상세 분석 (Accordion) */}
                <section className={styles.sectionSpacing}>
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

                {/* ▷ 최종 총평 영역 */}
                <section className={styles.sectionSpacing}>
                    <h2 className={styles.sectionTitle}>최종 피드백 / 총평</h2>
                    <div className={styles.finalBox}>
                        {finalFeedback}
                    </div>
                </section>
            </div>
        </div>
    );
}