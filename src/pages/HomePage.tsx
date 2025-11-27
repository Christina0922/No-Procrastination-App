import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import { useRewards } from '../hooks/useRewards';
import { useNudge } from '../hooks/useNudge';
import TodoList from '../components/TodoList';
import RewardPopup from '../components/RewardPopup';
import NudgeMessagePopup from '../components/NudgeMessagePopup';
import CharacterVoicePlayer from '../components/CharacterVoicePlayer';
import { getSettings } from '../utils/storage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { todos, addTodo, toggleComplete, deleteTodo, getCompletionRate } = useTodos();
  const { addReward, getTodayTotalPoints } = useRewards();
  const { nudgeTriggered, currentNudge, dismissNudge } = useNudge(todos);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');
  const [newTodoImportance, setNewTodoImportance] = useState(1);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() && newTodoDeadline) {
      addTodo(newTodoText, newTodoDeadline, newTodoImportance);
      setNewTodoText('');
      setNewTodoDeadline('');
      setNewTodoImportance(1);
      setShowAddForm(false);
    }
  };

  const handleToggleComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.isCompleted) {
      // 완료 시 포인트 지급
      const points = 5;
      addReward(id, points);
      setRewardPoints(points);
      setRewardMessage('할 일을 완료했습니다!');
      setShowRewardPopup(true);

      // 오늘 목표 100% 완료 체크
      setTimeout(() => {
        const completionRate = getCompletionRate();
        if (completionRate === 100) {
          const bonusPoints = 20;
          addReward(id, bonusPoints);
          setRewardPoints(bonusPoints);
          setRewardMessage('오늘 목표를 100% 달성했습니다! 보너스 포인트!');
          setShowRewardPopup(true);
        }
      }, 1000);
    }
    toggleComplete(id);
  };

  const handleNudgeStart = () => {
    dismissNudge();
    setShowAddForm(true);
  };

  const settings = getSettings();
  const completionRate = getCompletionRate();
  const todayPoints = getTodayTotalPoints();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>오늘의 할 일</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>오늘 포인트</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {todayPoints} P
            </div>
          </div>
          <button
            onClick={() => navigate('/rewards')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            보상
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>달성률</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
            {completionRate.toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${completionRate}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          + 할 일 추가
        </button>
      ) : (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            marginBottom: '24px'
          }}
        >
          <h3 style={{ marginTop: 0 }}>새 할 일 추가</h3>
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <input
            type="time"
            value={newTodoDeadline}
            onChange={(e) => setNewTodoDeadline(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              중요도:
            </label>
            <select
              value={newTodoImportance}
              onChange={(e) => setNewTodoImportance(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value={1}>낮음</option>
              <option value={2}>보통</option>
              <option value={3}>높음</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddTodo}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTodoText('');
                setNewTodoDeadline('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      <TodoList todos={todos} onToggle={handleToggleComplete} onDelete={deleteTodo} />

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/rewards')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          보상 내역
        </button>
        <button
          onClick={() => navigate('/statistics')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#9c27b0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          통계
        </button>
        <button
          onClick={() => navigate('/settings')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#607d8b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          설정
        </button>
      </div>

      {showRewardPopup && (
        <RewardPopup
          points={rewardPoints}
          message={rewardMessage}
          onClose={() => setShowRewardPopup(false)}
        />
      )}

      {nudgeTriggered && currentNudge && (
        <>
          <NudgeMessagePopup
            message={currentNudge}
            onDismiss={dismissNudge}
            onStart={handleNudgeStart}
          />
          <CharacterVoicePlayer
            message={currentNudge}
            characterVoice={settings.characterVoice}
            enabled={settings.notificationType === 'voice' || settings.notificationType === 'popup'}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;

