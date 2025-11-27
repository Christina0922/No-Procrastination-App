import React from 'react';
import TodoItem from './TodoItem';
import type { Todo } from '../hooks/useTodos';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
        <p style={{ fontSize: '18px' }}>오늘 할 일이 없습니다.</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>새로운 할 일을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;

