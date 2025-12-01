/**
 * 보상 및 교환 관련 타입 정의
 */

/**
 * 교환 이력
 */
export interface ExchangeHistory {
  id: string;
  rewardName: string;
  pointsUsed: number;
  exchangedAt: string; // ISO 8601 형식
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * 상품권 정보
 */
export interface RewardItem {
  id: string;
  name: string;
  points: number;
  description?: string;
  category?: string;
}

