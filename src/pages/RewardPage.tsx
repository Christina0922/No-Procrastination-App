import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRewards } from '../hooks/useRewards';
import { formatDate } from '../utils/timeUtils';
import { getExchangeHistory, addExchangeHistory, type ExchangeHistory } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import RewardExchangeHistory from '../components/RewardExchangeHistory';

const RewardPage: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, totalPoints, getTodayRewards } = useRewards();
  const todayRewards = getTodayRewards();
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistory[]>(getExchangeHistory());
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<{ name: string; points: number } | null>(null);

  const availableRewards = [
    { name: '스타벅스 아메리카노', points: 100 },
    { name: '편의점 상품권 5천원', points: 200 },
    { name: '영화관람권', points: 300 },
    { name: '온라인 쇼핑몰 1만원권', points: 500 }
  ];

  const handleExchange = (rewardName: string, pointsRequired: number) => {
    if (totalPoints < pointsRequired) {
      alert(`포인트가 부족합니다. (필요: ${pointsRequired}P, 보유: ${totalPoints}P)`);
      return;
    }

    const exchange: ExchangeHistory = {
      id: uuidv4(),
      rewardName,
      pointsUsed: pointsRequired,
      exchangedAt: new Date().toISOString(),
      status: 'pending'
    };

    addExchangeHistory(exchange);
    setExchangeHistory(getExchangeHistory());
    setShowExchangeModal(false);
    alert(`교환 신청이 완료되었습니다!\n${rewardName} (${pointsRequired}P 사용)`);
  };

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

      {/* 교환 내역 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>교환 내역</h2>
        <RewardExchangeHistory />
      </div>

      <button
        onClick={() => setShowExchangeModal(true)}
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

      {/* 교환 모달 */}
      {showExchangeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowExchangeModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>상품권 교환</h2>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>보유 포인트</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                {totalPoints} P
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableRewards.map((reward) => (
                <div
                  key={reward.name}
                  style={{
                    padding: '16px',
                    border: `2px solid ${totalPoints >= reward.points ? '#4caf50' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: totalPoints >= reward.points ? '#f1f8e9' : '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {reward.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {reward.points} 포인트
                    </div>
                  </div>
                  <button
                    onClick={() => handleExchange(reward.name, reward.points)}
                    disabled={totalPoints < reward.points}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: totalPoints >= reward.points ? '#4caf50' : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: totalPoints >= reward.points ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    교환
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExchangeModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
              💡 교환 신청 후 실제 상품권 발송은 추후 API 연동 시 자동 처리됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardPage;

