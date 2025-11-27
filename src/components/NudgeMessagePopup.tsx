import React from 'react';

interface NudgeMessagePopupProps {
  message: string;
  onDismiss: () => void;
  onStart: () => void;
}

const NudgeMessagePopup: React.FC<NudgeMessagePopupProps> = ({ message, onDismiss, onStart }) => {
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
      onClick={onDismiss}
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
        <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>미루기 방지 알림</h2>
        <p
          style={{
            margin: '0 0 24px 0',
            color: '#666',
            fontSize: '18px',
            lineHeight: '1.6',
            fontWeight: '500'
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onStart}
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
            지금 시작하기
          </button>
          <button
            onClick={onDismiss}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            나중에
          </button>
        </div>
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
          ⚠️ 나중에 하면 오늘의 보상이 사라집니다!
        </p>
      </div>
    </div>
  );
};

export default NudgeMessagePopup;

