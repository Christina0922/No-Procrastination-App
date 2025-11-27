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

