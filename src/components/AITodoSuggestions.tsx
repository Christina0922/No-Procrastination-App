import React, { useState } from 'react';
import { todoSuggestions, getRandomSuggestion, getRandomSuggestionFromAll, type TodoSuggestion } from '../data/todoSuggestions';
import { useTodos } from '../hooks/useTodos';

/**
 * AI 추천 할 일 생성기 컴포넌트
 * 카테고리별로 할 일을 추천하고 자동으로 추가할 수 있습니다.
 */
const AITodoSuggestions: React.FC = () => {
  const { addTodo } = useTodos();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof todoSuggestions | 'all'>('all');
  const [suggestedTodo, setSuggestedTodo] = useState<TodoSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categoryLabels: Record<keyof typeof todoSuggestions | 'all', string> = {
    health: '건강',
    study: '공부',
    organization: '정리',
    habit: '습관',
    goal: '목표',
    all: '랜덤'
  };

  const handleGetSuggestion = () => {
    let suggestion: TodoSuggestion | null = null;
    
    if (selectedCategory === 'all') {
      suggestion = getRandomSuggestionFromAll();
    } else {
      suggestion = getRandomSuggestion(selectedCategory);
    }

    if (suggestion) {
      setSuggestedTodo(suggestion);
      setShowSuggestions(true);
    }
  };

  const handleAddSuggestion = () => {
    if (suggestedTodo) {
      const deadline = suggestedTodo.defaultDeadline || '18:00';
      addTodo(suggestedTodo.text, deadline, suggestedTodo.importance);
      setShowSuggestions(false);
      setSuggestedTodo(null);
    }
  };

  const handleDismiss = () => {
    setShowSuggestions(false);
    setSuggestedTodo(null);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#333' }}>
          🤖 오늘 할 일 추천받기
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {(['all', 'health', 'study', 'organization', 'habit', 'goal'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#2196f3' : '#e0e0e0',
                color: selectedCategory === category ? '#fff' : '#333',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: selectedCategory === category ? 'bold' : 'normal'
              }}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
        <button
          onClick={handleGetSuggestion}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          추천받기
        </button>
      </div>

      {showSuggestions && suggestedTodo && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '2px solid #2196f3'
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              {suggestedTodo.text}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              카테고리: {categoryLabels[suggestedTodo.category]} | 
              중요도: {suggestedTodo.importance === 1 ? '낮음' : suggestedTodo.importance === 2 ? '보통' : '높음'} |
              마감: {suggestedTodo.defaultDeadline || '18:00'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddSuggestion}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              추가하기
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITodoSuggestions;

