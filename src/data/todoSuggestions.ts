/**
 * AI 추천 할 일 데이터
 * 카테고리별로 추천할 일 목록을 제공합니다.
 */

export interface TodoSuggestion {
  text: string;
  category: 'health' | 'study' | 'organization' | 'habit' | 'goal';
  importance: 1 | 2 | 3;
  defaultDeadline?: string; // HH:mm 형식
}

export const todoSuggestions: { [key: string]: TodoSuggestion[] } = {
  health: [
    { text: '물 2L 마시기', category: 'health', importance: 2, defaultDeadline: '20:00' },
    { text: '10분 스트레칭하기', category: 'health', importance: 2, defaultDeadline: '09:00' },
    { text: '30분 산책하기', category: 'health', importance: 2, defaultDeadline: '18:00' },
    { text: '과일 1개 먹기', category: 'health', importance: 1, defaultDeadline: '15:00' },
    { text: '잠 7시간 이상 자기', category: 'health', importance: 3, defaultDeadline: '23:00' },
    { text: '건강한 식사하기', category: 'health', importance: 3, defaultDeadline: '19:00' },
    { text: '비타민 챙겨먹기', category: 'health', importance: 1, defaultDeadline: '09:00' },
    { text: '목과 어깨 스트레칭', category: 'health', importance: 2, defaultDeadline: '14:00' }
  ],
  study: [
    { text: '영어 단어 10개 외우기', category: 'study', importance: 2, defaultDeadline: '10:00' },
    { text: '책 30분 읽기', category: 'study', importance: 2, defaultDeadline: '20:00' },
    { text: '온라인 강의 1개 수강', category: 'study', importance: 3, defaultDeadline: '15:00' },
    { text: '복습 노트 정리하기', category: 'study', importance: 2, defaultDeadline: '16:00' },
    { text: '문제집 1페이지 풀기', category: 'study', importance: 2, defaultDeadline: '14:00' },
    { text: '새로운 기술 배우기', category: 'study', importance: 3, defaultDeadline: '11:00' },
    { text: '요약 정리하기', category: 'study', importance: 2, defaultDeadline: '17:00' }
  ],
  organization: [
    { text: '책상 정리하기', category: 'organization', importance: 1, defaultDeadline: '09:00' },
    { text: '옷장 정리하기', category: 'organization', importance: 2, defaultDeadline: '10:00' },
    { text: '이메일 정리하기', category: 'organization', importance: 2, defaultDeadline: '11:00' },
    { text: '폰 사진 정리하기', category: 'organization', importance: 1, defaultDeadline: '15:00' },
    { text: '쓰레기 버리기', category: 'organization', importance: 2, defaultDeadline: '19:00' },
    { text: '장보기 목록 작성하기', category: 'organization', importance: 2, defaultDeadline: '18:00' },
    { text: '파일 정리하기', category: 'organization', importance: 1, defaultDeadline: '16:00' }
  ],
  habit: [
    { text: '일기 쓰기', category: 'habit', importance: 2, defaultDeadline: '22:00' },
    { text: '감사 일기 쓰기', category: 'habit', importance: 2, defaultDeadline: '21:00' },
    { text: '명상 10분하기', category: 'habit', importance: 2, defaultDeadline: '08:00' },
    { text: '아침 루틴 완료하기', category: 'habit', importance: 3, defaultDeadline: '09:00' },
    { text: '저녁 루틴 완료하기', category: 'habit', importance: 3, defaultDeadline: '22:00' },
    { text: '가족/친구에게 연락하기', category: 'habit', importance: 2, defaultDeadline: '20:00' }
  ],
  goal: [
    { text: '프로젝트 1단계 진행하기', category: 'goal', importance: 3, defaultDeadline: '17:00' },
    { text: '포트폴리오 업데이트하기', category: 'goal', importance: 3, defaultDeadline: '16:00' },
    { text: '새로운 취미 시작하기', category: 'goal', importance: 2, defaultDeadline: '19:00' },
    { text: '목표 리뷰하기', category: 'goal', importance: 2, defaultDeadline: '21:00' },
    { text: '다음 주 계획 세우기', category: 'goal', importance: 2, defaultDeadline: '20:00' }
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

