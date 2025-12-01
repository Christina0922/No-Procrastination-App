import React from 'react';

interface CoupangProductProps {
  title: string;
  iframeUrl: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 쿠팡 파트너스 상품 iframe 컴포넌트
 */
const CoupangProduct: React.FC<CoupangProductProps> = ({
  title,
  iframeUrl,
  style,
  className
}) => {
  return (
    <div
      style={{
        minWidth: '120px',
        maxWidth: '120px',
        width: '100%',
        margin: '12px',
        padding: '12px',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
      className={className}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '12px',
          textAlign: 'center',
          lineHeight: '1.4',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {title}
      </div>
      <iframe
        src={iframeUrl}
        width="120"
        height="240"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        style={{
          border: 'none',
          borderRadius: '4px'
        }}
        title={title}
      />
    </div>
  );
};

export default CoupangProduct;
