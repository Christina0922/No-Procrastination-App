import React from 'react';
import { getExchangeHistory, type ExchangeHistory } from '../utils/storage';
import { formatDate } from '../utils/timeUtils';

/**
 * 교환 내역 컴포넌트
 * 포인트로 상품권을 교환한 이력을 표시합니다.
 */
const RewardExchangeHistory: React.FC = () => {
  const exchangeHistory = getExchangeHistory();

  const getStatusLabel = (status: ExchangeHistory['status']): string => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '대기중';
      case 'cancelled':
        return '취소';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: ExchangeHistory['status']): string => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  if (exchangeHistory.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
        교환 내역이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {exchangeHistory.slice().reverse().map((exchange) => (
        <div
          key={exchange.id}
          style={{
            padding: '16px',
            marginBottom: '12px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              {exchange.rewardName}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {formatDate(exchange.exchangedAt)}
            </div>
            <div style={{ fontSize: '12px', color: '#f44336', fontWeight: 'bold' }}>
              -{exchange.pointsUsed} 포인트
            </div>
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: getStatusColor(exchange.status),
              color: '#fff'
            }}
          >
            {getStatusLabel(exchange.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardExchangeHistory;




