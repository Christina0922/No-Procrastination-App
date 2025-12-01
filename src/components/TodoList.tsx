import React, { useMemo } from 'react';
import TodoItem from './TodoItem';
import type { Todo } from '../hooks/useTodos';
import { compareTimeWithAmPm } from '../utils/timeUtils';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  // 정렬: 1순위 마감시간, 2순위 중요도, 3순위 완료된 항목은 아래로
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      // 완료된 항목은 아래로
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      
      // 완료되지 않은 항목들만 시간과 중요도로 정렬
      if (!a.isCompleted && !b.isCompleted) {
        // 1순위: 마감 시간 오름차순
        const amPmA = a.amPm || 'AM';
        const amPmB = b.amPm || 'AM';
        const timeCompare = compareTimeWithAmPm(a.deadline, amPmA, b.deadline, amPmB);
        if (timeCompare !== 0) {
          return timeCompare;
        }
        
        // 2순위: 중요도 높은 순 (3 > 2 > 1)
        return b.importance - a.importance;
      }
      
      return 0;
    });
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: '0', color: '#888' }}>
        <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>오늘 할 일이 없습니다.</p>
        <p style={{ fontSize: '14px', margin: '0' }}>새로운 할 일을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '0', paddingBottom: '0' }}>
      {sortedTodos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isLast={index === sortedTodos.length - 1}
        />
      ))}
    </div>
  );
};

export default TodoList;

