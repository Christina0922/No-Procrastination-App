import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRewards } from '../hooks/useRewards';
import { formatDate } from '../utils/timeUtils';

const RewardPage: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, totalPoints, getTodayRewards } = useRewards();
  const todayRewards = getTodayRewards();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>보상 내역</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          홈으로
        </button>
      </div>

      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff3cd',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          border: '2px solid #ffc107'
        }}
      >
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>누적 포인트</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff6b6b' }}>
          {totalPoints} P
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>오늘 획득한 포인트</h2>
        {todayRewards.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            오늘 획득한 포인트가 없습니다.
          </p>
        ) : (
          <div>
            {todayRewards.map((reward) => (
              <div
                key={reward.id}
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
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    +{reward.amount} 포인트
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {formatDate(reward.date)}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>🎉</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>전체 보상 내역</h2>
        {rewards.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            보상 내역이 없습니다.
          </p>
        ) : (
          <div>
            {rewards.slice().reverse().map((reward) => (
              <div
                key={reward.id}
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
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    +{reward.amount} 포인트
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {formatDate(reward.date)}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>🎉</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          alert('상품권 교환 기능은 추후 API 연동 예정입니다.');
        }}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        포인트로 상품권 받기
      </button>
    </div>
  );
};

export default RewardPage;

