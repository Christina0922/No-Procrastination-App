import React from 'react';
import type { Todo } from '../hooks/useTodos';
import { getMinutesUntil, isTimeBefore, getCurrentTimeString } from '../utils/timeUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const minutesUntilDeadline = getMinutesUntil(todo.deadline);
  const isOverdue = isTimeBefore(todo.deadline, getCurrentTimeString());
  const isUrgent = minutesUntilDeadline <= 30 && minutesUntilDeadline > 0;

  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 3: return '#ff4444';
      case 2: return '#ffaa00';
      case 1: return '#44aa44';
      default: return '#888';
    }
  };

  const getStatusColor = () => {
    if (todo.isCompleted) return '#44aa44';
    if (isOverdue) return '#ff4444';
    if (isUrgent) return '#ff8800';
    return '#888';
  };

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '12px',
        border: `2px solid ${getStatusColor()}`,
        borderRadius: '8px',
        backgroundColor: todo.isCompleted ? '#f0f0f0' : '#fff',
        opacity: todo.isCompleted ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onToggle(todo.id)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span
              style={{
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                color: todo.isCompleted ? '#888' : '#333'
              }}
            >
              {todo.text}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              마감: {todo.deadline}
            </span>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: getImportanceColor(todo.importance),
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              중요도 {todo.importance}
            </span>
            {isOverdue && !todo.isCompleted && (
              <span style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '14px' }}>
                ⚠️ 시간 초과!
              </span>
            )}
            {isUrgent && !todo.isCompleted && (
              <span style={{ color: '#ff8800', fontWeight: 'bold', fontSize: '14px' }}>
                ⏰ 긴급!
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default TodoItem;

