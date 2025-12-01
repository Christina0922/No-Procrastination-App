export const formatTime = (timeString: string): string => {
  return timeString; // HH:mm 형식 그대로 반환
};

export const parseTime = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
};

export const getTimeInMinutes = (timeString: string): number => {
  const { hours, minutes } = parseTime(timeString);
  return hours * 60 + minutes;
};

export const isTimeBefore = (time1: string, time2: string): boolean => {
  return getTimeInMinutes(time1) < getTimeInMinutes(time2);
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getMinutesUntil = (deadline: string): number => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const deadlineMinutes = getTimeInMinutes(deadline);
  return deadlineMinutes - currentMinutes;
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 현재 시간의 AM/PM 반환
 */
export const getCurrentAmPm = (): 'AM' | 'PM' => {
  const now = new Date();
  return now.getHours() < 12 ? 'AM' : 'PM';
};

/**
 * HH:mm 형식의 시간을 12시간제로 변환 (AM/PM 포함)
 * @param timeString HH:mm 형식 (24시간제)
 * @param amPm AM 또는 PM
 * @returns { hours: number, minutes: number } 12시간제 시간
 */
export const convertTo12Hour = (timeString: string, amPm: 'AM' | 'PM'): { hours: number; minutes: number } => {
  const [hours24, minutes] = timeString.split(':').map(Number);
  let hours12 = hours24;
  
  if (amPm === 'AM') {
    if (hours24 === 0) {
      hours12 = 12; // 12:00 AM = 0시
    } else if (hours24 === 12) {
      hours12 = 12; // 12:00 PM = 12시
    } else if (hours24 < 12) {
      hours12 = hours24;
    } else {
      hours12 = hours24 - 12;
    }
  } else { // PM
    if (hours24 === 0) {
      hours12 = 12; // 12:00 AM = 0시 (이 경우는 AM이어야 함)
    } else if (hours24 === 12) {
      hours12 = 12; // 12:00 PM = 12시
    } else if (hours24 < 12) {
      hours12 = hours24 + 12;
    } else {
      hours12 = hours24;
    }
  }
  
  return { hours: hours12, minutes };
};

/**
 * 12시간제 시간과 AM/PM을 24시간제로 변환
 * @param hours12 12시간제 시간 (1-12)
 * @param _minutes 분 (0-59) - 현재 사용하지 않음
 * @param amPm AM 또는 PM
 * @returns 24시간제 시간 (0-23)
 */
export const convertTo24Hour = (hours12: number, _minutes: number, amPm: 'AM' | 'PM'): number => {
  if (amPm === 'AM') {
    if (hours12 === 12) {
      return 0; // 12:00 AM = 0시
    }
    return hours12; // 1-11 AM = 1-11시
  } else { // PM
    if (hours12 === 12) {
      return 12; // 12:00 PM = 12시
    }
    return hours12 + 12; // 1-11 PM = 13-23시
  }
};

/**
 * 시간 문자열과 AM/PM을 Date 객체로 변환
 * @param timeString HH:mm 형식 (24시간제 입력값)
 * @param amPm AM 또는 PM
 * @returns Date 객체
 */
export const timeStringToDate = (timeString: string, amPm: 'AM' | 'PM'): Date => {
  const [hours24Input, minutes] = timeString.split(':').map(Number);
  
  // 24시간제 입력값을 12시간제로 해석한 후 다시 24시간제로 변환
  let hours24: number;
  
  if (amPm === 'AM') {
    if (hours24Input === 0) {
      hours24 = 0; // 12:00 AM = 0시
    } else if (hours24Input === 12) {
      hours24 = 0; // 12:00 AM = 0시 (입력이 12이지만 AM이면 0시)
    } else if (hours24Input < 12) {
      hours24 = hours24Input; // 1-11 AM = 1-11시
    } else {
      // 13-23시 입력이지만 AM이면 다음날로 처리하지 않고, 1-11시로 해석
      hours24 = hours24Input - 12;
    }
  } else { // PM
    if (hours24Input === 0) {
      hours24 = 12; // 12:00 PM = 12시 (입력이 0이지만 PM이면 12시)
    } else if (hours24Input === 12) {
      hours24 = 12; // 12:00 PM = 12시
    } else if (hours24Input < 12) {
      hours24 = hours24Input + 12; // 1-11 PM = 13-23시
    } else {
      hours24 = hours24Input; // 13-23시는 그대로
    }
  }
  
  const date = new Date();
  date.setHours(hours24, minutes, 0, 0);
  return date;
};

/**
 * 한국식 시간 표시 형식 (오전/오후 포함)
 * @param timeString HH:mm 형식 (24시간제 입력값)
 * @param amPm AM 또는 PM
 * @returns "오전 10:30" 또는 "오후 3:45" 형식
 */
export const formatTimeKorean = (timeString: string, amPm: 'AM' | 'PM'): string => {
  const [hours24Input, minutes] = timeString.split(':').map(Number);
  
  // 12시간제 표시용 시간 계산
  let displayHours: number;
  
  if (amPm === 'AM') {
    if (hours24Input === 0 || hours24Input === 12) {
      displayHours = 12; // 12:00 AM = 오전 12:00
    } else if (hours24Input < 12) {
      displayHours = hours24Input; // 1-11 AM = 오전 1-11시
    } else {
      displayHours = hours24Input - 12; // 13-23시 입력이지만 AM이면 1-11시로 표시
    }
  } else { // PM
    if (hours24Input === 0) {
      displayHours = 12; // 0시 입력이지만 PM이면 오후 12:00
    } else if (hours24Input === 12) {
      displayHours = 12; // 12:00 PM = 오후 12:00
    } else if (hours24Input < 12) {
      displayHours = hours24Input; // 1-11시 입력이면 오후 1-11시
    } else {
      displayHours = hours24Input - 12; // 13-23시 = 오후 1-11시
    }
  }
  
  const amPmKorean = amPm === 'AM' ? '오전' : '오후';
  return `${amPmKorean} ${displayHours}:${String(minutes).padStart(2, '0')}`;
};

/**
 * AM/PM 기반으로 시간 비교
 */
export const compareTimeWithAmPm = (time1: string, amPm1: 'AM' | 'PM', time2: string, amPm2: 'AM' | 'PM'): number => {
  // AM이 PM보다 먼저
  if (amPm1 !== amPm2) {
    return amPm1 === 'AM' ? -1 : 1;
  }
  
  // 같은 AM/PM이면 시간 비교
  const date1 = timeStringToDate(time1, amPm1);
  const date2 = timeStringToDate(time2, amPm2);
  return date1.getTime() - date2.getTime();
};

/**
 * 남은 시간 또는 초과 시간을 포맷팅
 * @param deadlineDate 마감 시간 Date 객체
 * @param isCompleted 완료 여부
 * @returns 포맷된 시간 문자열
 */
export const formatRemainingTime = (deadlineDate: Date, isCompleted: boolean = false): { text: string; color: string; status: 'normal' | 'urgent' | 'overdue' } => {
  if (isCompleted) {
    return {
      text: '완료됨',
      color: '#888',
      status: 'normal'
    };
  }

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 0) {
    // 초과됨
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    if (hours > 0) {
      return {
        text: `${hours}시간 ${minutes}분 초과됨`,
        color: '#f44336',
        status: 'overdue'
      };
    } else {
      return {
        text: `${minutes}분 초과됨`,
        color: '#f44336',
        status: 'overdue'
      };
    }
  } else if (diffMinutes <= 30) {
    // 임박
    return {
      text: '마감 임박',
      color: '#ff9800',
      status: 'urgent'
    };
  } else {
    // 정상
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours > 0) {
      return {
        text: `마감까지 ${hours}시간 ${minutes}분 남음`,
        color: '#888',
        status: 'normal'
      };
    } else {
      return {
        text: `마감까지 ${minutes}분 남음`,
        color: '#888',
        status: 'normal'
      };
    }
  }
};

