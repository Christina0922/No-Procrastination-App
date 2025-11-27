import { useState, useEffect, useCallback } from 'react';
import { getSettings } from '../utils/storage';
import { getCurrentTimeString, getMinutesUntil, isTimeBefore } from '../utils/timeUtils';
import { nudgeMessages } from '../data/nudgeMessages';
import type { Todo } from './useTodos';

interface NudgeSettings {
  nudgeType: 'soft' | 'direct' | 'funny' | 'strong';
  characterVoice: string;
  notificationType: 'popup' | 'voice' | 'vibration';
}

export const useNudge = (todos: Todo[]) => {
  const [nudgeTriggered, setNudgeTriggered] = useState(false);
  const [currentNudge, setCurrentNudge] = useState<string | null>(null);
  const [settings, setSettings] = useState<NudgeSettings>(getSettings());

  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
  }, []);

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
        triggerNudge();
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [todos, checkNudgeConditions, nudgeTriggered]);

  const triggerNudge = () => {
    const filteredMessages = nudgeMessages.filter(
      msg => msg.type === settings.nudgeType
    );
    
    if (filteredMessages.length > 0) {
      const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];
      setCurrentNudge(randomMessage.text);
      setNudgeTriggered(true);

      // 알림 방식에 따른 처리
      if (settings.notificationType === 'voice' || settings.notificationType === 'popup') {
        // 음성 재생 로직은 CharacterVoicePlayer에서 처리
      }

      if (settings.notificationType === 'vibration') {
        // 진동 (모바일)
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }
  };

  const dismissNudge = () => {
    setNudgeTriggered(false);
    setCurrentNudge(null);
  };

  return {
    nudgeTriggered,
    currentNudge,
    triggerNudge,
    dismissNudge
  };
};

