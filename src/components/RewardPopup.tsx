import React from 'react';

interface RewardPopupProps {
  points: number;
  message: string;
  onClose: () => void;
}

const RewardPopup: React.FC<RewardPopupProps> = ({ points, message, onClose }) => {
  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>보상 획득!</h2>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ff6b6b',
            marginBottom: '16px'
          }}
        >
          +{points} 포인트
        </div>
        <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '16px' }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '12px 32px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default RewardPopup;

