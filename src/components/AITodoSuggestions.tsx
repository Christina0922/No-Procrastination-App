import React, { useState } from 'react';
import { todoSuggestions, getRandomSuggestion, getRandomSuggestionFromAll, type TodoSuggestion } from '../data/todoSuggestions';
import { useTodos } from '../hooks/useTodos';
import { timeStringToDate } from '../utils/timeUtils';

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
      // deadline 시간을 기준으로 AM/PM 결정
      const deadlineDate = timeStringToDate(deadline, 'PM'); // 기본값 PM으로 변환 시도
      const hours = deadlineDate.getHours();
      const amPm: 'AM' | 'PM' = hours < 12 ? 'AM' : 'PM';
      addTodo(suggestedTodo.text, deadline, suggestedTodo.importance, amPm);
      setShowSuggestions(false);
      setSuggestedTodo(null);
    }
  };

  const handleDismiss = () => {
    setShowSuggestions(false);
    setSuggestedTodo(null);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={handleDismiss}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px', color: '#333' }}>
              ✨ 추천 할 일
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2196f3' }}>
                {suggestedTodo.text}
              </div>
              {suggestedTodo.reason && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  💡 {suggestedTodo.reason}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>카테고리: {categoryLabels[suggestedTodo.category]}</span>
                <span>중요도: {suggestedTodo.importance === 1 ? '낮음' : suggestedTodo.importance === 2 ? '보통' : '높음'}</span>
                <span>마감: {suggestedTodo.defaultDeadline || '18:00'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddSuggestion}
                style={{
                  flex: 1,
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
                오늘 할 일에 추가하기
              </button>
              <button
                onClick={handleDismiss}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITodoSuggestions;

