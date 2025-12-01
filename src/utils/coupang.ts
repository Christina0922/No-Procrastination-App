/**
 * 쿠팡 파트너스 링크 유틸리티
 */

/**
 * 쿠팡 파트너스 링크에 필수 파라미터를 추가합니다.
 * @param originalUrl 원본 쿠팡 링크
 * @returns 파트너스 파라미터가 추가된 링크
 */
export const linkAppend = (originalUrl: string): string => {
  if (!originalUrl) return originalUrl;

  try {
    const url = new URL(originalUrl);
    // 파트너스 추적 파라미터 추가
    url.searchParams.set('src', 'procrastination_app');
    url.searchParams.set('ref', 'no_procrastination');
    return url.toString();
  } catch (error) {
    // URL 파싱 실패 시 원본 반환
    console.error('쿠팡 링크 파싱 실패:', error);
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}src=procrastination_app&ref=no_procrastination`;
  }
};

/**
 * 쿠팡 링크를 새 창에서 엽니다.
 * @param url 쿠팡 링크
 */
export const openCoupangLink = (url: string): void => {
  const partnerUrl = linkAppend(url);
  window.open(partnerUrl, '_blank', 'noopener,noreferrer');
};

