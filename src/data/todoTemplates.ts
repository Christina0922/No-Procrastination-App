/**
 * 반복 할 일 템플릿 데이터
 * 매일/매주/매월 반복되는 할 일을 정의합니다.
 */

export interface TodoTemplate {
  id: string;
  text: string;
  repeatType: 'daily' | 'weekly' | 'monthly';
  deadline: string; // HH:mm 형식
  importance: 1 | 2 | 3;
  enabled: boolean;
  days?: string[]; // 요일 배열 ['월', '화', '수', '목', '금', '토', '일']
}

/**
 * 기본 반복 할 일 템플릿
 */
export const defaultTemplates: TodoTemplate[] = [
  {
    id: '1',
    text: '물 2L 마시기',
    repeatType: 'daily',
    deadline: '20:00',
    importance: 2,
    enabled: false
  },
  {
    id: '2',
    text: '10분 스트레칭하기',
    repeatType: 'daily',
    deadline: '09:00',
    importance: 2,
    enabled: false
  },
  {
    id: '3',
    text: '일기 쓰기',
    repeatType: 'daily',
    deadline: '22:00',
    importance: 2,
    enabled: false
  },
  {
    id: '4',
    text: '책상 정리하기',
    repeatType: 'weekly',
    deadline: '18:00',
    importance: 1,
    enabled: false
  },
  {
    id: '5',
    text: '주간 계획 세우기',
    repeatType: 'weekly',
    deadline: '20:00',
    importance: 3,
    enabled: false
  },
  {
    id: '6',
    text: '월간 목표 리뷰하기',
    repeatType: 'monthly',
    deadline: '19:00',
    importance: 3,
    enabled: false
  }
];

