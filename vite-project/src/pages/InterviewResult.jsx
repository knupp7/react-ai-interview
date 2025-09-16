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
import LoadingOverlay from "../components/LoadingOverlay";
import FinalFeedback from "./interview-result-comps/FinalFeedback";

export default function InterviewResult() {
  const location = useLocation();
  const formData = location.state;

  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(false);    // 배포용 ref

  const [evalData, setEvalData] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState(0);
  const [avgAnswerSec, setAvgAnswerSec] = useState(null);
  const [radarScores, setRadarScores] = useState({
    "기술 이해도": 0,
    "문제 해결력": 0,
    "기초 지식 응용력": 0,
    "의사소통 능력": 0,
    "태도 및 자기 인식": 0
  });
  const [categoryFeedback, setCategoryFeedback] = useState({
    "기술 이해도": "",
    "문제 해결력": "",
    "기초 지식 응용력": "",
    "의사소통 능력": "",
    "태도 및 자기 인식": ""
  });
  const [questions, setQuestions] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState('');

  const [evalOpen, setEvalOpen] = useState(true);   // 처음 진입하면 로딩 오버레이 ON
  const [evalStep, setEvalStep] = useState(0);
  const [evalMsg, setEvalMsg] = useState("결과를 불러오고 있어요.");
  const [evalErr, setEvalErr] = useState("");

  const evalSteps = [
    "최종 평가 데이터 확인",
    "캐시/로컬 점검",
    "서버에서 평가 결과 수신",
    "리포트 구성 중"
  ];

  const handleExportPDF = () => {
    if (exportRef.current) return;
    exportRef.current = true;
    setIsExporting(true);
  };

  useEffect(() => {
    if (isExporting) {
      const timer = setTimeout(() => {
        const element = document.getElementById('export-target');

        const pxW = element.scrollWidth;     // 가로
        const pxH = element.scrollHeight;    // 세로(매우 길어질 수 있음)
        html2pdf()
          .set({
            margin: 0,                         // 여백 없애기 (원하면 조정)
            filename: 'interview-analysis.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 1.5,
              useCORS: true,
              windowWidth: pxW,
              windowHeight: pxH,
              scrollX: 0,
              scrollY: 0,
            }, // 해상도↑, CORS 이미지 허용
            jsPDF: { unit: 'px', format: [pxW, pxH], orientation: 'portrait' },
            // pagebreak 옵션은 기본값 유지 (강제분할 금지 목적)
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
      if (!sessionCode) {
        setEvalErr("세션 코드가 없습니다. 다시 로그인해 주세요.");
        return;
      }
      try {
        setEvalOpen(true);
        setEvalErr("");
        setEvalStep(0);
        setEvalMsg("최종 평가 데이터 확인 중...");

        // 0 → 1: 캐시/로컬 점검
        await new Promise(r => setTimeout(r, 150));
        setEvalStep(1);
        setEvalMsg("캐시를 확인하고 있어요...");

        /**
         * total_score: int
         * questions: list
         * question_count: int
         * final_feedback: str
         * category_scores: dict
         * category_feedbacks: dict
         */
        // getFinalEvaluation: 캐시가 있으면 즉시 반환
        const res = await getFinalEvaluation(sessionCode);

        // 1 → 2: 서버 수신(UX용 단계 업)
        setEvalStep(2);
        setEvalMsg("서버에서 평가 결과를 수신했어요. 정리 중...");

        setEvalData(res);
        setScore(Math.round((res.total_score) * 20));
        setTotalQuestions(res.question_count);

        const scaledScores = {};
        for (const [key, value] of Object.entries(res.category_scores)) {
          scaledScores[key] = Math.round(value * 20);
        }
        setRadarScores(scaledScores);
        setCategoryFeedback(res.category_feedbacks);
        setQuestions(res.questions);

        // 놓친 질문 계산
        const sumScores = (scores) => {
          if (!scores) return 0;
          if (Array.isArray(scores)) return scores.reduce((a, b) => a + (Number(b) || 0), 0);
          if (typeof scores === 'object') return Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
          return Number(scores) || 0;
        };

        const missed = (res.questions || []).reduce((acc, q) => {
          const total = sumScores(q.scores);
          return acc + (total < 10 ? 1 : 0);
        }, 0);

        setMissedQuestions(missed);
        setFinalFeedback(res.final_feedback);

        setEvalStep(3);
        setEvalMsg("리포트를 구성하고 있어요...");

        await new Promise(r => setTimeout(r, 200));
        setEvalOpen(false);
      } catch (err) {
        console.error("최종 평가 가져오기 실패:", err);
        setEvalErr(err?.message || "최종 평가를 불러오는 중 문제가 발생했어요.");
      }
    };

    fetchEval();
  }, []);

  useEffect(() => {
    const sessionCode = localStorage.getItem("sessionCode");
    if (!sessionCode) return;

    const raw = localStorage.getItem(`qaDurations:${sessionCode}`);
    if (!raw) return;

    try {
      const { list = [] } = JSON.parse(raw);
      if (list.length) {
        const avgMs = list.reduce((a, b) => a + b, 0) / list.length;
        setAvgAnswerSec(Math.round(avgMs / 1000)); // 초로 반올림
      } else {
        setAvgAnswerSec(null);
      }
    } catch {
      setAvgAnswerSec(null);
    }
  }, [evalData]);

  const handleEvalRetry = async () => {
    setEvalErr("");
    // 강제 갱신이 필요하면 getFinalEvaluation(sessionCode, { force: true })로 바꿔도 됨
    setEvalOpen(true);
    // 위 useEffect와 같은 흐름을 재실행하려면 함수로 분리하거나:
    // 간단히 아래처럼 트리거만 다시 걸고 싶다면 fetchEval을 바깥으로 빼도 됨.
    // 여기서는 페이지 리로드가 가장 단순:
    window.location.reload();
  };

  const handleEvalCancel = () => {
    setEvalOpen(false);
    // 필요 시 뒤로 가기 또는 채팅 화면 유지
    // navigate("/interview/chat");
  };

  if (!evalData) {
    return (<LoadingOverlay
      isOpen={evalOpen}
      steps={evalSteps}
      currentStep={evalStep}
      message={evalMsg}
      error={evalErr}
      onRetry={evalErr ? handleEvalRetry : undefined}
      onCancel={handleEvalCancel}
      title="면접 결과를 준비하고 있어요..."
    />
    )
  };

  return (
    <div className={`${styles.wrapper} ${styles.pageBg}`}>
      {/* 헤더: 상단 날짜 + PDF 버튼 */}
      <div className={styles.header}>
        <p className={styles.metaTitle}>{RESULT_STRINGS.title}</p>
        <ExportPDFButton onExport={handleExportPDF} />
        {console.log(formData)}
      </div>

      {/* PDF로 내보낼 전체 영역 */}
      <div id="export-target" className={`${styles.reportBox} ${styles.card}`}>
        {/* 지원자 정보 헤더 */}
        <section className={`${styles.section} ${styles.sectionCard}`}>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleAccent}`}>
            {RESULT_STRINGS.applicant}
          </h2>
          <div className={styles.summaryContainer}>
            <div className={styles.applicantInfo}>
              <div className={styles.applicantAvatar}>
                <img
                  src={formData?.profileImage || "/avatar-placeholder.svg"}
                  alt="applicant"
                  onError={(e) => { e.currentTarget.src = "/avatar-placeholder.svg"; }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className={styles.applicantMeta}>
                <h2 className={styles.applicantName}>
                  {formData?.name || "지원자"}
                </h2>
                <div className={styles.applicantApplied}>
                  <p className={styles.appliedText}>
                    <span>지원 기업 | </span>{formData?.selectedCompany ? `${formData.selectedCompany}` : "회사 미입력"}
                  </p>
                  <p className={styles.appliedText}>
                    <span>지원 직무 | </span>{formData?.selectedRole ? `${formData.selectedRole}` : "직무 미입력"}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.gaugeRow}>
              <GaugeChart score={score} />
              <div className={styles.questionBox}>
                <div className={`${styles.questionCard} ${styles.accentBorder}`}>
                  <p className={styles.label}>{RESULT_STRINGS.totalQuestions}</p>
                  <span className={styles.value}>{totalQuestions}</span>
                </div>
                <div className={`${styles.questionCard} ${styles.accentBorder}`}>
                  <p className={styles.label}>{RESULT_STRINGS.missedQuestions}</p>
                  <span className={styles.value}>{missedQuestions}</span>
                </div>
                <div className={`${styles.questionCard} ${styles.accentBorder}`}>
                  <p className={styles.label}>{RESULT_STRINGS.avgAnsTime}</p>
                  <span className={styles.value}>{(avgAnswerSec) + 's'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리별 평가 */}
        <section className={`${styles.sectionSpacing} ${styles.sectionCard}`}>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleAccent}`}>
            {RESULT_STRINGS.category}
          </h2>
          <div className={styles.chartRow}>
            <div className={`${styles.radarChartWrapper} ${styles.subCard}`}>
              <RadarChart data={radarScores} />
            </div>
            <div className={`${styles.barChartWrapper} ${styles.subCard}`}>
              <HorizontalBarChart data={radarScores} />
            </div>
          </div>
        </section>

        {/* 카테고리 피드백 */}
        <section className={`${styles.sectionSpacing} ${styles.sectionCard}`}>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleAccentSm}`}>
            카테고리별 피드백
          </h2>
          <div className={styles.categoryGrid}>
            {categoryFeedback && Object.entries(categoryFeedback).map(([key, value], idx) => (
              <div key={idx} className={styles.categoryItem}>
                <CategoryFeedbackBlock feedback={{ key, text: value }} />
              </div>
            ))}
          </div>
        </section>

        {/* 질문 상세 */}
        <section className={`${styles.sectionSpacing} ${styles.sectionCard}`}>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleAccentSm}`}>
            {RESULT_STRINGS.questions}
          </h2>
          <div className={styles.qaList}>
            {questions && questions.map((q, idx) => (
              <div key={idx} className={styles.qaItem}>
                <QuestionAccordion
                  index={idx}
                  question={q.question}
                  answer={q.answer}
                  scores={q.scores}
                  feedbacks={q.feedbacks}
                  forceOpen={isExporting}
                />
              </div>
            ))}
          </div>
        </section>

        <FinalFeedback contents={finalFeedback}/>
      </div>
    </div>
  );
}