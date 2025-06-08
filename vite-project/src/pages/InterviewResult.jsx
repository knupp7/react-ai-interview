import { useLocation } from "react-router-dom";
import ExportPDFButton from "./interview-result-comps/ExportPDFButton";
import GaugeChart from "./interview-result-comps/GaugeChart";
import RadarChart from "./interview-result-comps/RadarChart";
import CategoryFeedbackBlock from "./interview-result-comps/CategoryFeedbackBlock";
import QuestionAccordion from "./interview-result-comps/QuestionAccordion";
import HorizontalBarChart from "./interview-result-comps/HorizontalBarChart";
import styles from "../styles/InterviewResult.module.css";
import { RESULT_STRINGS } from "../constants/interviewResultStrings";
import { useEffect, useRef, useState } from "react";
import { getFinalEvaluation } from "../api/eval";
import html2pdf from 'html2pdf.js';
import LoadingSpinner from "../components/LoadingSpinner";

export default function InterviewResult() {
    const location = useLocation();
    const formData = location.state; // 사용자 정보 (현재 미사용)

    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef(false);    // 배포용 ref

    const [evalData, setEvalData] = useState(null);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [radarScores, setRadarScores] = useState({
        "기술 이해도": 0,
        "문제 해결력": 0,
        "기초 지식 응용력": 0,
        "코드 구현력": 0,
        "의사소통 능력": 0,
        "태도 및 자기 인식": 0
    });
    const [categoryFeedback, setCategoryFeedback] = useState({
        "기술 이해도": "",
        "문제 해결력": "",
        "기초 지식 응용력": "",
        "코드 구현력": "",
        "의사소통 능력": "",
        "태도 및 자기 인식": ""
    });
    const [questions, setQuestions] = useState(null);
    const [finalFeedback, setFinalFeedback] = useState('');

    const handleExportPDF = () => {
        if (exportRef.current) return;
        exportRef.current = true;
        setIsExporting(true);
    };

    useEffect(() => {
        if (isExporting) {
            const timer = setTimeout(() => {
                const element = document.getElementById('export-target');
                html2pdf()
                    .set({
                        margin: 0.5,
                        filename: 'interview-analysis.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                    })
                    .from(element)
                    .save()
                    .then(() => {
                        setIsExporting(false);
                        exportRef.current = false;
                    });
            }, 100); // 한 프레임 쉬기

            return () => clearTimeout(timer);
        }
    }, [isExporting]);

    useEffect(() => {
        const fetchEval = async () => {
            const sessionCode = localStorage.getItem("sessionCode");
            if (!sessionCode) return;
            try {
                /**
                 * total_score: int
                 * questions: list
                 * question_count: int
                 * final_feedback: str
                 * category_scores: list
                 * category_feedbacks: list
                 */
                const res = await getFinalEvaluation(sessionCode);
                setEvalData(res);
                console.log("평가 결과:", res);

                // report data
                setScore(Math.round((res.total_score) * 20));
                setTotalQuestions(res.question_count);

                const scaledScores = {};
                for (const [key, value] of Object.entries(res.category_scores)) {
                    scaledScores[key] = Math.round(value * 20);
                }
                setRadarScores(scaledScores);
                setCategoryFeedback(res.category_feedbacks);

                setQuestions(res.questions)

                setFinalFeedback(res.final_feedback)
            } catch (err) {
                console.error("최종 평가 가져오기 실패:", err);
            }
        };

        fetchEval();
    }, []);

    if (!evalData) return <LoadingSpinner />;

    return (
        <div className={styles.wrapper}>
            {/* ▶ 헤더: 상단 날짜 + PDF 버튼 */}
            <div className={styles.header}>
                <p className={styles.metaTitle}>{RESULT_STRINGS.title}</p>
                <ExportPDFButton onExport={handleExportPDF} />
            </div>

            {/* ▶ PDF로 내보낼 전체 영역 */}
            <div id="export-target" className={styles.reportBox}>
                {/* ▷ 분석 요약 섹션: 게이지 + 질문 요약 */}
                <section>
                    <h2 className={styles.sectionTitle}>{RESULT_STRINGS.summary}</h2>
                    <div className={styles.gaugeRow}>
                        {/* total score */}
                        <GaugeChart score={score} />
                        <div className={styles.questionBox}>
                            {/* total_q */}
                            <div className={styles.questionCard}>
                                <p className={styles.label}>{RESULT_STRINGS.totalQuestions}</p>
                                <span className={styles.value}>{totalQuestions}</span>
                            </div>
                            {/* deprecated - missed question */}
                            {/* <div className={styles.questionCard}>
                                <p className={styles.label}>{RESULT_STRINGS.missedQuestions}</p>
                                <p className={styles.value}>{missedQuestions} / {totalQuestions}</p>
                            </div> */}
                        </div>
                    </div>
                </section>

                {/* ▷ 카테고리별 평가 (레이더 차트, 수평차트) */}
                <section className={styles.sectionSpacing}>
                    <h2 className={styles.sectionTitle}>{RESULT_STRINGS.category}</h2>
                    <div className={styles.chartRow}>
                        <div className={styles.radarChartWrapper}>
                            <RadarChart data={radarScores} />
                        </div>
                        <div className={styles.barChartWrapper}>
                            <HorizontalBarChart data={radarScores} />
                        </div>
                    </div>
                </section>

                {/* ▷ 카테고리별 피드백 상세 블럭 */}
                {categoryFeedback && Object.entries(categoryFeedback).map(([key, value], index) => (
                    <CategoryFeedbackBlock
                        key={index}
                        feedback={{ key, text: value }}
                    />
                ))}

                {/* ▷ 질문 상세 분석 (Accordion) */}
                <section className={styles.sectionSpacing}>
                    <h2 className={styles.sectionTitle}>{RESULT_STRINGS.questions}</h2>
                    {questions && questions.map((q, idx) => (
                        <QuestionAccordion
                            key={idx}
                            index={idx}
                            question={q.question}
                            answer={q.answer}
                            scores={q.scores}
                            feedbacks={q.feedbacks}
                            forceOpen={isExporting}
                        />
                    ))}
                </section>

                {/* ▷ 최종 총평 영역 */}
                <section className={styles.sectionSpacing}>
                    <h2 className={styles.sectionTitle}>{RESULT_STRINGS.final}</h2>
                    <div className={styles.finalBox}>
                        {finalFeedback}
                    </div>
                </section>
            </div>
        </div>
    );
}