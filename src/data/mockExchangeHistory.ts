/**
 * Mock 교환 내역 데이터
 * 실제 API 연동 전까지 사용할 샘플 데이터입니다.
 */

export interface ExchangeHistory {
  id: string;          // 고유 ID
  name: string;        // 교환한 상품 이름
  points: number;      // 사용한 포인트
  exchangedAt: string; // 교환 일시 (ISO 문자열 또는 '2025-12-01' 같은 문자열)
}

const mockExchangeHistory: ExchangeHistory[] = [
  {
    id: '1',
    name: '스타벅스 아메리카노',
    points: 100,
    exchangedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: '편의점 상품권 5천원',
    points: 200,
    exchangedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: '영화관람권',
    points: 300,
    exchangedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default mockExchangeHistory;
