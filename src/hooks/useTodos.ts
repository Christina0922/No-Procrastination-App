// src/hooks/useTodos.ts

import { useState, useEffect } from "react";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  period: "AM" | "PM";
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, period: "AM" | "PM") => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false, period }
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
  };
}
