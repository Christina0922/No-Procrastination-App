import { useState, useEffect } from 'react';
import { getTodos, setTodos } from '../utils/storage';
import { getCurrentTimeString, isToday, getCurrentAmPm } from '../utils/timeUtils';
import type { Todo } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodosState] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = getTodos();
    // 오늘 날짜의 할 일만 필터링
    const todayTodos = savedTodos.filter((todo: Todo) => isToday(todo.createdAt));
    setTodosState(todayTodos);
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    const allTodos = getTodos();
    const otherTodos = allTodos.filter((todo: Todo) => !isToday(todo.createdAt));
    setTodos([...otherTodos, ...newTodos]);
    setTodosState(newTodos);
  };

  const addTodo = (text: string, deadline: string, importance: number, amPm?: 'AM' | 'PM') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      deadline,
      amPm: amPm || getCurrentAmPm(),
      importance,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      startedAt: null
    };
    const newTodos = [...todos, newTodo];
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    saveTodos(newTodos);
  };

  const toggleComplete = (id: string) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
          startedAt: !todo.isCompleted && !todo.startedAt ? getCurrentTimeString() : todo.startedAt
        };
      }
      return todo;
    });
    saveTodos(newTodos);
  };

  const getTodayTodos = () => todos.filter(todo => isToday(todo.createdAt));

  const getCompletedCount = () => todos.filter(todo => todo.isCompleted).length;

  const getTotalCount = () => todos.length;

  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    return (getCompletedCount() / todos.length) * 100;
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleComplete,
    getTodayTodos,
    getCompletedCount,
    getTotalCount,
    getCompletionRate
  };
};
