import { getTodos, getStatistics } from './storage';
import type { Todo } from '../hooks/useTodos';

/**
 * 통계 계산 유틸리티 함수
 * 할 일 완료/미루기 기록 데이터를 기반으로 다양한 통계를 계산합니다.
 */

/**
 * 가장 자주 미룬 할 일 TOP N
 */
export const getMostProcrastinatedTodos = (limit: number = 5): Array<{ text: string; count: number }> => {
  const todos = getTodos();
  const incompleteTodos = todos.filter((todo: Todo) => !todo.isCompleted);
  const todoCounts: { [key: string]: number } = {};
  
  incompleteTodos.forEach((todo: Todo) => {
    const key = todo.text;
    todoCounts[key] = (todoCounts[key] || 0) + 1;
  });

  return Object.entries(todoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([text, count]) => ({ text, count }));
};

/**
 * 가장 빨리 완료한 할 일 TOP N
 */
export const getFastestCompletedTodos = (limit: number = 5): Array<{ text: string; minutes: number }> => {
  const todos = getTodos();
  const completedTodos = todos.filter((todo: Todo) => todo.isCompleted && todo.startedAt);
  
  const fastest = completedTodos
    .map((todo: Todo) => {
      const createdAt = new Date(todo.createdAt);
      const startedAt = todo.startedAt ? new Date(`${new Date().toISOString().split('T')[0]}T${todo.startedAt}`) : null;
      if (!startedAt) return null;
      const minutes = (startedAt.getTime() - createdAt.getTime()) / (1000 * 60);
      return { text: todo.text, minutes };
    })
    .filter((item): item is { text: string; minutes: number } => item !== null)
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, limit);

  return fastest;
};

/**
 * 시간대별 완료 패턴 분석
 */
export const getCompletionTimePattern = (): Array<{ hour: string; count: number }> => {
  const todos = getTodos();
  const completedTodos = todos.filter((todo: Todo) => todo.isCompleted && todo.startedAt);
  
  const hourCounts: { [key: number]: number } = {};
  completedTodos.forEach((todo: Todo) => {
    if (todo.startedAt) {
      const hour = parseInt(todo.startedAt.split(':')[0]);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: `${hour}시`, count: count }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
};

/**
 * 중요도별 완료율 계산
 */
export const getImportanceCompletionRate = (): Array<{ importance: string; rate: number; completed: number; total: number }> => {
  const todos = getTodos();
  const importanceStats: { [key: number]: { total: number; completed: number } } = {
    1: { total: 0, completed: 0 },
    2: { total: 0, completed: 0 },
    3: { total: 0, completed: 0 }
  };

  todos.forEach((todo: Todo) => {
    importanceStats[todo.importance].total++;
    if (todo.isCompleted) {
      importanceStats[todo.importance].completed++;
    }
  });

  return Object.entries(importanceStats).map(([importance, stats]) => ({
    importance: importance === '1' ? '낮음' : importance === '2' ? '보통' : '높음',
    rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    completed: stats.completed,
    total: stats.total
  }));
};

/**
 * 주간 평균 달성률 계산
 */
export const getWeeklyAverage = (): number => {
  const stats = getStatistics();
  const dates = Object.keys(stats.dailyStats).sort().slice(-7);
  
  if (dates.length === 0) return 0;
  
  const totalRate = dates.reduce((sum, date) => {
    const dayStats = stats.dailyStats[date];
    return sum + (dayStats?.rate || 0);
  }, 0);
  
  return totalRate / dates.length;
};

/**
 * 일별 달성률 데이터 (최근 7일)
 */
export const getDailyCompletionData = (): Array<{ date: string; 달성률: number }> => {
  const stats = getStatistics();
  const dates = Object.keys(stats.dailyStats).sort().slice(-7);
  return dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    달성률: stats.dailyStats[date]?.rate || 0
  }));
};

