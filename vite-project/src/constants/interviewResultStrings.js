function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 면접 결과분석 페이지에서 사용하는 문자열 모음
export const RESULT_STRINGS = {
    title: getTodayDate()+" 기술면접",
    applicant: "지원자 정보",
    summary: "분석 요약",
    totalQuestions: "총 질문 수",
    missedQuestions: "놓친 질문 수",
    avgAnsTime: "평균 답변 시간",
    category: "카테고리별 평가",
    questions: "질문 상세 분석",
    final: "최종 피드백 / 총평"
};