import { useEffect, useRef } from 'react';
import { getSettings, type Settings } from '../utils/storage';
import { getMinutesUntil } from '../utils/timeUtils';
import { showBrowserNotification } from '../utils/notification';
import { motivationMessages } from '../data/motivationMessages';
import type { Todo } from './useTodos';

/**
 * 리마인더 훅
 * 할 일의 마감 시간을 기준으로 브라우저 알림을 예약합니다.
 */
export const useReminder = (todos: Todo[]) => {
  const notificationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const notifiedTodosRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 기존 타이머 정리
    notificationTimersRef.current.forEach(timer => clearTimeout(timer));
    notificationTimersRef.current.clear();
    notifiedTodosRef.current.clear();

    if (todos.length === 0) return;

    const settings = getSettings();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    todos.forEach(todo => {
      if (todo.isCompleted) return;

      const deadlineMinutes = getMinutesUntil(todo.deadline) + currentMinutes;
      const deadlineDate = new Date(now);
      deadlineDate.setHours(Math.floor(deadlineMinutes / 60), deadlineMinutes % 60, 0, 0);

      // 마감 30분 전 알림
      if (settings.reminderTiming === '30min' || settings.reminderTiming === 'all') {
        const reminder30Min = new Date(deadlineDate.getTime() - 30 * 60 * 1000);
        if (reminder30Min > now) {
          const delay = reminder30Min.getTime() - now.getTime();
          const timer = setTimeout(() => {
            triggerReminder(todo, '30분 전', settings);
          }, delay);
          notificationTimersRef.current.set(`${todo.id}-30min`, timer);
        }
      }

      // 마감 10분 전 알림
      if (settings.reminderTiming === '10min' || settings.reminderTiming === 'all') {
        const reminder10Min = new Date(deadlineDate.getTime() - 10 * 60 * 1000);
        if (reminder10Min > now) {
          const delay = reminder10Min.getTime() - now.getTime();
          const timer = setTimeout(() => {
            triggerReminder(todo, '10분 전', settings);
          }, delay);
          notificationTimersRef.current.set(`${todo.id}-10min`, timer);
        }
      }

      // 마감 시간 알림
      if (settings.reminderTiming === 'deadline' || settings.reminderTiming === 'all') {
        if (deadlineDate > now) {
          const delay = deadlineDate.getTime() - now.getTime();
          const timer = setTimeout(() => {
            triggerReminder(todo, '마감 시간', settings);
          }, delay);
          notificationTimersRef.current.set(`${todo.id}-deadline`, timer);
        }
      }
    });

    return () => {
      notificationTimersRef.current.forEach(timer => clearTimeout(timer));
      notificationTimersRef.current.clear();
    };
  }, [todos]);

  const triggerReminder = (todo: Todo, timing: string, settings: Settings) => {
    const key = `${todo.id}-${timing}`;
    if (notifiedTodosRef.current.has(key)) return;
    notifiedTodosRef.current.add(key);

    const filteredMessages = motivationMessages.filter(
      msg => msg.type === settings.nudgeType
    );
    
    if (filteredMessages.length > 0) {
      const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];
      const reminderText = `${todo.text}\n${randomMessage.text}`;
      
      // 브라우저 알림 표시
      showBrowserNotification(
        `할 일 리마인더 - ${timing}`,
        reminderText,
        todo.text
      );

      // 진동 (모바일)
      if (settings.notificationType === 'vibration' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };
};

