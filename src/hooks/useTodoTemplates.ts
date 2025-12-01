import { useState, useEffect } from 'react';
import { getTodos, setTodos } from '../utils/storage';
import { isToday } from '../utils/timeUtils';
import { defaultTemplates, type TodoTemplate } from '../data/todoTemplates';
import type { Todo } from './useTodos';

const STORAGE_KEY = 'no-procrastination-todo-templates';

/**
 * 반복 할 일 템플릿 훅
 * 매일/매주/매월 반복되는 할 일을 관리합니다.
 */
export const useTodoTemplates = () => {
  const [templates, setTemplates] = useState<TodoTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTemplates;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  /**
   * 템플릿 활성화/비활성화
   */
  const toggleTemplate = (id: string) => {
    setTemplates(prev => 
      prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
    );
  };

  /**
   * 오늘 적용할 템플릿 가져오기
   */
  const getTodayTemplates = (): TodoTemplate[] => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = 일요일
    const dayOfMonth = today.getDate();

    return templates.filter(template => {
      if (!template.enabled) return false;

      switch (template.repeatType) {
        case 'daily':
          return true;
        case 'weekly':
          // 매주 같은 요일에만 (예: 매주 월요일)
          // 간단히 매주 활성화로 처리
          return true;
        case 'monthly':
          // 매월 같은 날짜에만 (예: 매월 1일)
          return dayOfMonth === 1;
        default:
          return false;
      }
    });
  };

  /**
   * 템플릿을 실제 할 일로 변환
   */
  const applyTemplates = (): void => {
    const todayTemplates = getTodayTemplates();
    const allTodos = getTodos();
    const today = new Date().toISOString().split('T')[0];

    // 오늘 이미 생성된 할 일들
    const todayTodos = allTodos.filter((todo: Todo) => 
      isToday(todo.createdAt)
    );

    todayTemplates.forEach(template => {
      // 이미 오늘 같은 템플릿으로 생성된 할 일이 있는지 확인
      const exists = todayTodos.some((todo: Todo) => 
        todo.text === template.text && isToday(todo.createdAt)
      );

      if (!exists) {
        const newTodo: Todo = {
          id: `${template.id}-${Date.now()}`,
          text: template.text,
          deadline: template.deadline,
          importance: template.importance,
          isCompleted: false,
          createdAt: new Date().toISOString()
        };

        allTodos.push(newTodo);
      }
    });

    setTodos(allTodos);
  };

  /**
   * 새 템플릿 추가
   */
  const addTemplate = (template: Omit<TodoTemplate, 'id'>) => {
    const newTemplate: TodoTemplate = {
      ...template,
      id: Date.now().toString()
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  /**
   * 템플릿 삭제
   */
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return {
    templates,
    toggleTemplate,
    getTodayTemplates,
    applyTemplates,
    addTemplate,
    deleteTemplate
  };
};

