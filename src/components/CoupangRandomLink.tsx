import React from 'react';
import { productLinks } from '../data/coupangProducts';

/**
 * 쿠팡 파트너스 랜덤 링크 컴포넌트
 * 클릭 시 productLinks 배열에서 랜덤으로 1개를 선택해 새 창에서 열기
 */
const CoupangRandomLink: React.FC = () => {
  const handleClick = () => {
    if (productLinks.length === 0) {
      return;
    }

    // 현재 시간 기준 랜덤으로 1개 선택
    const randomIndex = Math.floor(Math.random() * productLinks.length);
    const selectedLink = productLinks[randomIndex];

    if (selectedLink) {
      // 쿠팡 파트너스 딥링크로 새 창 열기
      window.open(selectedLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        marginTop: '12px',
        marginBottom: '0',
        padding: '0',
        display: 'block'
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: '#ff6b6b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'block'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ff5252';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ff6b6b';
        }}
      >
        미루지 않게 도와주는 습관템 보러가기
      </button>
      <p
        style={{
          fontSize: '11px',
          color: '#999',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: '0',
          lineHeight: '1.4',
          padding: '0'
        }}
      >
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
};

export default CoupangRandomLink;
