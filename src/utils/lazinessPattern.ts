import { getTodos } from './storage';
import type { Todo } from '../types/todo';

/**
 * 게으름 패턴 분석 유틸리티
 * 늦게 완료한 시간대를 분석합니다.
 */

export interface LazinessPattern {
  hour: number;
  count: number;
  percentage: number;
}

/**
 * 시간대별 미루기 패턴 분석
 * 할 일이 늦게 완료된 시간대를 분석합니다.
 */
export const analyzeLazinessPattern = (): LazinessPattern[] => {
  const todos = getTodos();
  const incompleteTodos = todos.filter((todo: Todo) => !todo.isCompleted);
  
  // 할 일 생성 시간과 마감 시간의 차이를 분석
  const hourCounts: { [key: number]: number } = {};
  let totalCount = 0;

  incompleteTodos.forEach((todo: Todo) => {
    const createdAt = new Date(todo.createdAt);
    const hour = createdAt.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    totalCount++;
  });

  // 완료되지 않은 할 일이 많은 시간대 = 미루는 시간대
  const patterns: LazinessPattern[] = Object.entries(hourCounts)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count: count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);

  return patterns;
};

/**
 * 가장 자주 미루는 시간대 TOP N
 */
export const getTopLazinessHours = (limit: number = 3): Array<{ hour: string; count: number; message: string }> => {
  const patterns = analyzeLazinessPattern();
  
  return patterns.slice(0, limit).map(pattern => {
    let message = '';
    if (pattern.hour >= 0 && pattern.hour < 6) {
      message = '새벽 시간대에 미루는 편이에요';
    } else if (pattern.hour >= 6 && pattern.hour < 12) {
      message = '오전 시간대에 미루는 편이에요';
    } else if (pattern.hour >= 12 && pattern.hour < 18) {
      message = '오후 시간대에 미루는 편이에요';
    } else {
      message = '저녁 시간대에 미루는 편이에요';
    }

    return {
      hour: `${pattern.hour}시`,
      count: pattern.count,
      message
    };
  });
};

/**
 * 평균 미루기 시간 계산
 * 할 일 생성 후 완료까지 걸린 평균 시간
 */
export const getAverageProcrastinationTime = (): number => {
  const todos = getTodos();
  const completedTodos = todos.filter((todo: Todo) => todo.isCompleted && todo.startedAt);
  
  if (completedTodos.length === 0) return 0;

  const totalMinutes = completedTodos.reduce((sum: number, todo: Todo) => {
    const createdAt = new Date(todo.createdAt);
    const startedAt = todo.startedAt ? new Date(`${new Date().toISOString().split('T')[0]}T${todo.startedAt}`) : null;
    if (!startedAt) return sum;
    const minutes = (startedAt.getTime() - createdAt.getTime()) / (1000 * 60);
    return sum + minutes;
  }, 0);

  return Math.round(totalMinutes / completedTodos.length);
};

