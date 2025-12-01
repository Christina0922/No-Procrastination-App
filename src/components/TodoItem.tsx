import React, { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { formatTimeKorean, timeStringToDate, formatRemainingTime } from '../utils/timeUtils';
import { getSettings } from '../utils/storage';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, isLast = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [remainingTime, setRemainingTime] = useState<{ text: string; color: string; status: 'normal' | 'urgent' | 'overdue' } | null>(null);
  const settings = getSettings();
  const amPm = todo.amPm || 'AM';
  const deadlineDate = timeStringToDate(todo.deadline, amPm);
  
  // 시간 표시 형식 결정
  const displayTime = settings.timeFormat === '12h' 
    ? formatTimeKorean(todo.deadline, amPm)
    : todo.deadline;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 남은 시간 계산 및 업데이트
  useEffect(() => {
    if (todo.isCompleted) {
      setRemainingTime(null);
      return;
    }
    
    const updateRemainingTime = () => {
      const timeInfo = formatRemainingTime(deadlineDate, todo.isCompleted);
      setRemainingTime(timeInfo);
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000); // 1분마다 업데이트
    
    return () => clearInterval(interval);
  }, [deadlineDate, todo.isCompleted]);

  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 3: return '#f44336'; // 높음 - 빨강
      case 2: return '#ff9800'; // 보통 - 주황
      case 1: return '#4caf50'; // 낮음 - 초록
      default: return '#888';
    }
  };

  const getBorderColor = () => {
    // 중요도에 따라 테두리 색상 결정
    return getImportanceColor(todo.importance);
  };

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: isLast ? '0' : '12px',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '8px',
        backgroundColor: todo.isCompleted ? '#f0f0f0' : '#fff',
        opacity: todo.isCompleted ? 0.7 : 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'flex-start',
        gap: '12px'
      }}>
        <div style={{ flex: 1, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onToggle(todo.id)}
              style={{ 
                width: '20px', 
                height: '20px', 
                cursor: 'pointer',
                minWidth: '20px',
                flexShrink: 0
              }}
            />
            <span
              style={{
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 'bold',
                color: todo.isCompleted ? '#888' : '#333',
                wordBreak: 'break-word',
                flex: 1
              }}
            >
              {todo.text}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center', 
            marginTop: '8px', 
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
            alignSelf: 'flex-start'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              flexWrap: 'wrap',
              flexDirection: 'row'
            }}>
              {settings.timeFormat === '12h' && (
                <span
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: amPm === 'AM' ? '#8ECFFF' : '#FFA85A',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {amPm === 'AM' ? '오전' : '오후'}
                </span>
              )}
              <span style={{ 
                color: '#666', 
                fontSize: isMobile ? '13px' : '14px', 
                whiteSpace: 'nowrap',
                fontWeight: '500'
              }}>
                마감: {displayTime}
              </span>
              {remainingTime && !todo.isCompleted && (
                <span style={{ 
                  color: remainingTime.color, 
                  fontWeight: 'bold', 
                  fontSize: isMobile ? '12px' : '13px',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px'
                }}>
                  {remainingTime.text}
                </span>
              )}
            </div>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: getImportanceColor(todo.importance),
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              중요도 {todo.importance}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          style={{
            padding: isMobile ? '10px 16px' : '8px 12px',
            backgroundColor: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            alignSelf: isMobile ? 'stretch' : 'flex-start',
            minWidth: isMobile ? '100%' : 'auto'
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default TodoItem;

