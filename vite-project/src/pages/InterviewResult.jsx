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
        <div className={styles.resultContainer} style={{ padding: "20px" }}>
            <h1>인터뷰 결과</h1>

            {/* PDF로 내보낼 예시 타겟 */}
            <div id="export-target" style={{
                backgroundColor: "#fff",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "20px",
                marginBottom: "20px"
            }}>
                <h2>입력 정보 요약</h2>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(formData, null, 2)}
                </pre>

                {/* 게이지 차트 삽입 */}
                <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    <h3>최종 점수 시각화</h3>
                    <GaugeChart score={score} />
                </div>

                <section className={styles.radar}>
                    <h2>카테고리별 평가</h2>
                    <RadarChart data={radarScores} />
                </section>

                {categoryFeedback.map((item, index) => (
                    <CategoryFeedbackBlock key={index} {...item} />
                ))}
            </div>

            {/* PDF 내보내기 버튼 */}
            <ExportPDFButton />
        </div>
    );
}