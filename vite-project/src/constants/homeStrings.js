// 홈 화면 전용으로 사용하는 문자열 모음
const HOME_STRINGS = {
    HERO: {
      TITLE: '기술면접 준비의 정답', // 메인 타이틀
      SUBTITLE: '두리인턴',  // 메인 서브 타이틀
      TAG_LEFT: '직무, 자소서, 회사 맞춤 질문으로 완벽 대비', // 아바타 왼쪽 태그
      TAG_RIGHT: '면접 끝나고 바로 받는 AI 분석리포트', // 아바타 오른쪽 태그
      START_BUTTON: '지금 바로 시작하기', // 시작 버튼 텍스트
    },
  
    SLIDES: [
      {
        title: '맞춤 질문으로 효율적인 면접 준비',  // 슬라이드 1 제목
        description: '내가 지원할 회사에서 물어볼 질문만 쏙쏙, 보다 효율적인 면접 준비를 만나보세요', // 슬라이드 1 설명
        image: '/step1-persona.png',  // 슬라이드 1 이미지
      },
      {
        title: '면접관 페르소나로 실감나는 면접 준비',  // 슬라이드 2 제목
        description: '실제 면접관에게 질문받는 것 같은 실감나는 모의 면접, 면접관 페르소나 에이전트가 도와드립니다',  // 슬라이드 2 설명
        image: '/step2-example.png',  // 슬라이드 2 이미지
      },
      {
        title: '요약 리포트로 지능적인 면접 준비', // 슬라이드 3 제목
        description: '한번 보고 끝? 더 성장하는 나를 위한 요약 리포트, 합격하는 면접을 위해 꼭 필요합니다', // 슬라이드 3 설명
        image: '/step3-report.png', // 슬라이드 3 이미지
      },
    ],
  };

export default HOME_STRINGS;