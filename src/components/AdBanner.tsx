import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense 광고 배너 컴포넌트
 * @param slot 광고 slot ID
 */
const AdBanner: React.FC<AdBannerProps> = ({ slot, style, className }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // 이미 로드된 경우 스킵
    if (isLoaded.current) return;

    // adsbygoogle이 정의되어 있는지 확인
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        // 광고 초기화
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense 광고 로드 실패:', error);
      }
    } else {
      // adsbygoogle이 아직 로드되지 않은 경우, 스크립트 로드 대기
      const checkAdsbygoogle = setInterval(() => {
        if ((window as any).adsbygoogle) {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            isLoaded.current = true;
            clearInterval(checkAdsbygoogle);
          } catch (error) {
            console.error('AdSense 광고 로드 실패:', error);
            clearInterval(checkAdsbygoogle);
          }
        }
      }, 100);

      // 5초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkAdsbygoogle);
      }, 5000);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: '100%',
        minHeight: '100px',
        marginTop: '16px',
        marginBottom: '0',
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style
      }}
      className={className}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '728px',
          height: 'auto'
        }}
        data-ad-client="ca-pub-XXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;

