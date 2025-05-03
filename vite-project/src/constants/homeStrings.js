// 홈 화면 전용으로 사용하는 문자열 모음
const HOME_STRINGS = {
    HERO: {
      TITLE: '합격을 결정짓는', // 메인 타이틀
      SUBTITLE: 'Ai 모의면접',  // 메인 서브 타이틀
      TAG_LEFT: '직무, 자소서, 회사 맞춤 질문으로 완벽 대비', // 아바타 왼쪽 태그
      TAG_RIGHT: '면접 끝나고 바로 받는 AI 분석리포트', // 아바타 오른쪽 태그
      START_BUTTON: '지금 바로 시작하기', // 시작 버튼 텍스트
    },
  
    SLIDES: [
      {
        title: 'STEP 1',  // 슬라이드 1 제목
        subtitle: '면접관 페르소나', // 슬라이드 1 부제
        description: '면접관 페르소나와 인터뷰 시작', // 슬라이드 1 설명
        image: '/step1-persona.png',  // 슬라이드 1 이미지
      },
      {
        title: 'STEP 2',  // 슬라이드 2 제목
        subtitle: '맞춤 질문',  // 슬라이드 2 부제
        description: '직무, 자소서 기반 맞춤 질문 생성',  // 슬라이드 2 설명
        image: '/step2-example.png',  // 슬라이드 2 이미지
      },
      {
        title: 'STEP 3', // 슬라이드 3 제목
        subtitle: '종합리포트 제공', // 슬라이드 3 부제
        description: 'AI가 답변을 분석하여 종합리포트를 제공합니다.', // 슬라이드 3 설명
        image: '/step3-report.png', // 슬라이드 3 이미지
      },
    ],
  };

export default HOME_STRINGS;