/**
 * 브라우저 Notification API 유틸리티
 * 리마인더 알림 기능에 사용됩니다.
 */

/**
 * 브라우저 알림 권한 요청
 * @returns 권한이 허용되었는지 여부
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * 브라우저 알림 표시
 * @param title 알림 제목
 * @param body 알림 본문
 * @param todoText 할 일 텍스트 (태그용)
 */
export const showBrowserNotification = (title: string, body: string, todoText?: string): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: todoText || 'nudge',
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // 5초 후 자동 닫기
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

