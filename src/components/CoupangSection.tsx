import React from 'react';

interface CoupangSectionProps {
  category?: string;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 쿠팡 파트너스 간단 링크 컴포넌트
 */
const CoupangSection: React.FC<CoupangSectionProps> = ({
  style,
  className
}) => {
  const handleClick = () => {
    // 쿠팡 파트너스 링크로 이동 (카테고리별로 다른 링크 설정 가능)
    window.open('https://www.coupang.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        width: '100%',
        margin: '12px 0',
        padding: '12px',
        textAlign: 'center',
        ...style
      }}
      className={className}
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
          marginBottom: 0,
          lineHeight: '1.4'
        }}
      >
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
};

export default CoupangSection;
