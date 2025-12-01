/**
 * Reward 타입 정의 (통일된 구조)
 * 모든 reward 관련 데이터는 이 인터페이스를 따릅니다.
 */
export interface Reward {
  id: string;
  name: string;
  points: number;
  imageUrl: string;
  description: string;
}
