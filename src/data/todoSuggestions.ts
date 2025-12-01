/**
 * AI 추천 할 일 데이터
 * 카테고리별로 추천할 일 목록을 제공합니다.
 */

export interface TodoSuggestion {
  text: string;
  category: 'health' | 'study' | 'organization' | 'habit' | 'goal';
  importance: 1 | 2 | 3;
  defaultDeadline?: string; // HH:mm 형식
  reason?: string; // 추천 이유
}

export const todoSuggestions: { [key: string]: TodoSuggestion[] } = {
  health: [
    { text: '물 2L 마시기', category: 'health', importance: 2, defaultDeadline: '20:00', reason: '충분한 수분 섭취는 건강의 기본입니다. 하루 목표량을 달성하면 에너지가 넘칩니다!' },
    { text: '10분 스트레칭하기', category: 'health', importance: 2, defaultDeadline: '09:00', reason: '아침 스트레칭은 하루를 활기차게 시작하는 데 도움이 됩니다. 몸이 깨어나고 기분도 좋아집니다!' },
    { text: '30분 산책하기', category: 'health', importance: 2, defaultDeadline: '18:00', reason: '신선한 공기를 마시며 걷는 것은 스트레스 해소와 체력 향상에 최고입니다!' },
    { text: '과일 1개 먹기', category: 'health', importance: 1, defaultDeadline: '15:00', reason: '오후 간식으로 과일을 먹으면 비타민을 보충하고 포만감도 느낄 수 있어요!' },
    { text: '잠 7시간 이상 자기', category: 'health', importance: 3, defaultDeadline: '23:00', reason: '충분한 수면은 내일을 위한 최고의 투자입니다. 건강과 집중력이 향상됩니다!' },
    { text: '건강한 식사하기', category: 'health', importance: 3, defaultDeadline: '19:00', reason: '균형 잡힌 식사는 몸과 마음을 건강하게 유지하는 핵심입니다!' },
    { text: '비타민 챙겨먹기', category: 'health', importance: 1, defaultDeadline: '09:00', reason: '하루 필요한 영양소를 보충하면 면역력이 강화되고 활력이 넘칩니다!' },
    { text: '목과 어깨 스트레칭', category: 'health', importance: 2, defaultDeadline: '14:00', reason: '오후에 몸을 풀어주면 근육 긴장이 완화되고 집중력이 회복됩니다!' }
  ],
  study: [
    { text: '영어 단어 10개 외우기', category: 'study', importance: 2, defaultDeadline: '10:00', reason: '매일 조금씩 공부하면 어느새 큰 실력 향상을 경험할 수 있습니다!' },
    { text: '책 30분 읽기', category: 'study', importance: 2, defaultDeadline: '20:00', reason: '독서는 지식을 넓히고 상상력을 키우는 최고의 방법입니다!' },
    { text: '온라인 강의 1개 수강', category: 'study', importance: 3, defaultDeadline: '15:00', reason: '새로운 지식을 배우는 것은 성장의 핵심입니다. 오늘도 한 걸음 나아가세요!' },
    { text: '복습 노트 정리하기', category: 'study', importance: 2, defaultDeadline: '16:00', reason: '복습은 학습의 80%를 차지합니다. 정리된 노트는 미래의 보물입니다!' },
    { text: '문제집 1페이지 풀기', category: 'study', importance: 2, defaultDeadline: '14:00', reason: '작은 실천이 큰 성과로 이어집니다. 꾸준함이 실력의 비밀입니다!' },
    { text: '새로운 기술 배우기', category: 'study', importance: 3, defaultDeadline: '11:00', reason: '새로운 기술을 배우면 경쟁력이 높아지고 자신감도 생깁니다!' },
    { text: '요약 정리하기', category: 'study', importance: 2, defaultDeadline: '17:00', reason: '요약 정리는 핵심을 파악하는 능력을 키워줍니다!' }
  ],
  organization: [
    { text: '책상 정리하기', category: 'organization', importance: 1, defaultDeadline: '09:00', reason: '깔끔한 환경은 집중력을 높이고 생산성을 향상시킵니다!' },
    { text: '옷장 정리하기', category: 'organization', importance: 2, defaultDeadline: '10:00', reason: '정리된 옷장은 아침 준비 시간을 단축하고 스트레스를 줄입니다!' },
    { text: '이메일 정리하기', category: 'organization', importance: 2, defaultDeadline: '11:00', reason: '정리된 이메일함은 중요한 메시지를 놓치지 않게 도와줍니다!' },
    { text: '폰 사진 정리하기', category: 'organization', importance: 1, defaultDeadline: '15:00', reason: '사진 정리는 저장 공간을 확보하고 소중한 순간을 더 쉽게 찾을 수 있게 해줍니다!' },
    { text: '쓰레기 버리기', category: 'organization', importance: 2, defaultDeadline: '19:00', reason: '깨끗한 공간은 마음도 편안하게 만들어줍니다!' },
    { text: '장보기 목록 작성하기', category: 'organization', importance: 2, defaultDeadline: '18:00', reason: '계획된 장보기는 시간과 돈을 절약하고 건강한 식습관을 유지하게 해줍니다!' },
    { text: '파일 정리하기', category: 'organization', importance: 1, defaultDeadline: '16:00', reason: '정리된 파일은 필요한 정보를 빠르게 찾을 수 있게 해줍니다!' }
  ],
  habit: [
    { text: '일기 쓰기', category: 'habit', importance: 2, defaultDeadline: '22:00', reason: '하루를 돌아보며 기록하면 자기 이해가 깊어지고 감사한 마음이 생깁니다!' },
    { text: '감사 일기 쓰기', category: 'habit', importance: 2, defaultDeadline: '21:00', reason: '감사하는 습관은 행복감을 높이고 긍정적인 마인드를 만들어줍니다!' },
    { text: '명상 10분하기', category: 'habit', importance: 2, defaultDeadline: '08:00', reason: '명상은 스트레스를 줄이고 집중력을 향상시키는 과학적으로 입증된 방법입니다!' },
    { text: '아침 루틴 완료하기', category: 'habit', importance: 3, defaultDeadline: '09:00', reason: '규칙적인 아침 루틴은 하루의 생산성을 결정합니다. 작은 습관이 큰 변화를 만듭니다!' },
    { text: '저녁 루틴 완료하기', category: 'habit', importance: 3, defaultDeadline: '22:00', reason: '저녁 루틴은 다음 날을 위한 준비입니다. 충분한 휴식이 내일의 에너지를 만듭니다!' },
    { text: '가족/친구에게 연락하기', category: 'habit', importance: 2, defaultDeadline: '20:00', reason: '소중한 사람들과의 소통은 행복감을 높이고 관계를 돈독하게 만듭니다!' }
  ],
  goal: [
    { text: '프로젝트 1단계 진행하기', category: 'goal', importance: 3, defaultDeadline: '17:00', reason: '큰 목표는 작은 단계로 나누면 달성 가능합니다. 오늘 한 걸음이 미래를 만듭니다!' },
    { text: '포트폴리오 업데이트하기', category: 'goal', importance: 3, defaultDeadline: '16:00', reason: '지속적인 업데이트는 성장의 증거입니다. 나의 발전을 기록하세요!' },
    { text: '새로운 취미 시작하기', category: 'goal', importance: 2, defaultDeadline: '19:00', reason: '새로운 도전은 삶에 활력을 불어넣고 새로운 가능성을 열어줍니다!' },
    { text: '목표 리뷰하기', category: 'goal', importance: 2, defaultDeadline: '21:00', reason: '정기적인 목표 리뷰는 방향성을 유지하고 동기를 높여줍니다!' },
    { text: '다음 주 계획 세우기', category: 'goal', importance: 2, defaultDeadline: '20:00', reason: '계획이 있는 사람은 목표를 달성할 확률이 훨씬 높습니다. 미래를 준비하세요!' }
  ]
};

/**
 * 카테고리별 랜덤 추천 할 일 가져오기
 */
export const getRandomSuggestion = (category: keyof typeof todoSuggestions): TodoSuggestion | null => {
  const suggestions = todoSuggestions[category];
  if (!suggestions || suggestions.length === 0) return null;
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

/**
 * 모든 카테고리에서 랜덤 추천
 */
export const getRandomSuggestionFromAll = (): TodoSuggestion | null => {
  const allCategories = Object.keys(todoSuggestions) as Array<keyof typeof todoSuggestions>;
  const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
  return getRandomSuggestion(randomCategory);
};

