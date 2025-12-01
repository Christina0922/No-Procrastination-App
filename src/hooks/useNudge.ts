import { useState, useEffect, useCallback } from 'react';
import { getSettings, type Settings } from '../utils/storage';
import { getCurrentTimeString, getMinutesUntil, isTimeBefore } from '../utils/timeUtils';
import { motivationMessages } from '../data/motivationMessages';
import { requestNotificationPermission, showBrowserNotification } from '../utils/notification';
import { useReminder } from './useReminder';
import type { Todo } from '../types/todo';

/**
 * 미루기 방지 유도 메시지 훅
 * 기존 로직 유지: 할 일 생성 후 10분 미시작, deadline 30분 전, deadline 지남 등의 조건 체크
 */
export const useNudge = (todos: Todo[]) => {
  const [nudgeTriggered, setNudgeTriggered] = useState(false);
  const [currentNudge, setCurrentNudge] = useState<string | null>(null);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [settings, setSettings] = useState<Settings>(getSettings());

  // 리마인더 훅 사용 (마감 시간 기준 알림)
  useReminder(todos);

  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
    requestNotificationPermission();
  }, []);

  const triggerReminder = (todo: Todo, timing: string) => {
    const filteredMessages = motivationMessages.filter(
      msg => msg.type === settings.nudgeType
    );
    
    if (filteredMessages.length > 0) {
      const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];
      const reminderText = `[${timing}] ${todo.text}: ${randomMessage.text}`;
      
      setCurrentNudge(reminderText);
      setCurrentTodo(todo);
      setNudgeTriggered(true);

      // 브라우저 알림
      if (settings.notificationType === 'popup' || settings.notificationType === 'voice') {
        showBrowserNotification(
          `할 일 리마인더 - ${timing}`,
          `${todo.text}\n${randomMessage.text}`,
          todo.text
        );
      }

      // 진동
      if (settings.notificationType === 'vibration') {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }
  };

  const checkNudgeConditions = useCallback(() => {
    const now = getCurrentTimeString();
    
    for (const todo of todos) {
      if (todo.isCompleted) continue;

      // 조건 1: 할 일 생성 후 10분 이상 미시작
      if (!todo.startedAt) {
        const createdAt = new Date(todo.createdAt);
        const nowDate = new Date();
        const minutesSinceCreation = (nowDate.getTime() - createdAt.getTime()) / (1000 * 60);
        
        if (minutesSinceCreation >= 10) {
          return true;
        }
      }

      // 조건 2: deadline 30분 전인데 완료되지 않음
      const minutesUntilDeadline = getMinutesUntil(todo.deadline);
      if (minutesUntilDeadline <= 30 && minutesUntilDeadline > 0) {
        return true;
      }

      // 조건 3: deadline이 지났는데 완료되지 않음
      if (isTimeBefore(todo.deadline, now)) {
        return true;
      }
    }

    return false;
  }, [todos]);

  useEffect(() => {
    if (todos.length === 0) return;

    const interval = setInterval(() => {
      if (checkNudgeConditions() && !nudgeTriggered) {
        const incompleteTodos = todos.filter(t => !t.isCompleted);
        if (incompleteTodos.length > 0) {
          const randomTodo = incompleteTodos[Math.floor(Math.random() * incompleteTodos.length)];
          triggerReminder(randomTodo, '미루기 방지');
        }
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [todos, checkNudgeConditions, nudgeTriggered, settings]);

  const dismissNudge = () => {
    setNudgeTriggered(false);
    setCurrentNudge(null);
    setCurrentTodo(null);
  };

  return {
    nudgeTriggered,
    currentNudge,
    currentTodo,
    triggerNudge: () => {
      const incompleteTodos = todos.filter(t => !t.isCompleted);
      if (incompleteTodos.length > 0) {
        const randomTodo = incompleteTodos[Math.floor(Math.random() * incompleteTodos.length)];
        triggerReminder(randomTodo, '수동 알림');
      }
    },
    dismissNudge
  };
};

