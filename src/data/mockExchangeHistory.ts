/**
 * Mock 교환 내역 데이터
 * 실제 API 연동 전까지 사용할 샘플 데이터입니다.
 */
import type { ExchangeHistory } from '../types/reward';

export const mockExchangeHistory: ExchangeHistory[] = [
  {
    id: '1',
    rewardName: '스타벅스 아메리카노',
    pointsUsed: 100,
    exchangedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    rewardName: '편의점 상품권 5천원',
    pointsUsed: 200,
    exchangedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: '3',
    rewardName: '영화관람권',
    pointsUsed: 300,
    exchangedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

