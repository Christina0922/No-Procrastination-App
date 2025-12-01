import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGiftHistory, type GiftHistory } from '../api/gift';
import { formatDate } from '../utils/timeUtils';

const GiftHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<GiftHistory[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const giftHistory = getGiftHistory();
      // 날짜순으로 정렬 (최신순)
      const sorted = giftHistory.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setHistory(sorted);
    };

    loadHistory();
    // localStorage 변경 감지를 위한 이벤트 리스너
    const handleStorageChange = () => {
      loadHistory();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // 주기적으로 확인 (같은 탭에서의 변경 감지)
    const interval = setInterval(loadHistory, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: 'SUCCESS' | 'FAILED') => {
    return status === 'SUCCESS' ? '#4caf50' : '#f44336';
  };

  const getStatusText = (status: 'SUCCESS' | 'FAILED') => {
    return status === 'SUCCESS' ? '발송 완료' : '발송 실패';
  };

  // 날짜별로 그룹화
  const groupedHistory = history.reduce((acc, item) => {
    const dateKey = new Date(item.date).toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, GiftHistory[]>);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>기프티콘 교환 내역</h1>
        <button
          onClick={() => navigate('/rewards')}
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
          보상 페이지로
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
            교환 내역이 없습니다.
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            포인트로 상품권을 교환하면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <div>
          {Object.entries(groupedHistory)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .map(([dateKey, items]) => (
              <div key={dateKey} style={{ marginBottom: '32px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  color: '#333',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #ddd'
                }}>
                  {formatDate(dateKey)}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((item, index) => (
                    <div
                      key={`${item.date}-${index}`}
                      style={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: `2px solid ${getStatusColor(item.status)}`,
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            marginBottom: '8px',
                            color: '#333'
                          }}>
                            {item.productName}
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#666',
                            marginBottom: '4px'
                          }}>
                            📱 전화번호: {item.phone}
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: 'var(--text-secondary)',
                            marginBottom: '4px'
                          }}>
                            💰 사용 포인트: <strong>{item.usedPoints}P</strong>
                          </div>
                        </div>
                        <div style={{
                          padding: '8px 16px',
                          backgroundColor: getStatusColor(item.status),
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
                        }}>
                          {getStatusText(item.status)}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #ddd'
                      }}>
                        교환 시간: {new Date(item.date).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/rewards')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          상품권 교환하러 가기
        </button>
      </div>
    </div>
  );
};

export default GiftHistoryPage;

