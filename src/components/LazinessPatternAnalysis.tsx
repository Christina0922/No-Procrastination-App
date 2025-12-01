import React, { useState, useEffect } from 'react';
import { getTopLazinessHours, getAverageProcrastinationTime } from '../utils/lazinessPattern';

/**
 * 게으름 패턴 분석 컴포넌트
 * 사용자가 주로 미루는 시간대를 분석하여 보여줍니다.
 */
const LazinessPatternAnalysis: React.FC = () => {
  const [topHours, setTopHours] = useState<Array<{ hour: string; count: number; message: string }>>([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  useEffect(() => {
    const hours = getTopLazinessHours(3);
    const avgTime = getAverageProcrastinationTime();
    setTopHours(hours);
    setAverageTime(avgTime);
  }, []);

  if (topHours.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#888' }}>
        아직 충분한 데이터가 없어요. 할 일을 더 추가해보세요!
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '24px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#333' }}>
        📊 게으름 패턴 분석
      </h2>
      
      {topHours.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#ff6b6b' }}>
            가장 자주 미루는 시간대
          </div>
          {topHours.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffc107'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                {item.hour} ({item.count}개)
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {averageTime > 0 && (
        <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            평균 미루기 시간
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196f3' }}>
            {averageTime}분
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            할 일을 생성한 후 평균 {averageTime}분 후에 시작하는 편이에요
          </div>
        </div>
      )}
    </div>
  );
};

export default LazinessPatternAnalysis;

