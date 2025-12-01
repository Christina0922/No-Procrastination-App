import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import { useRewards } from '../hooks/useRewards';
import { useNudge } from '../hooks/useNudge';
import TodoList from '../components/TodoList';
import RewardPopup from '../components/RewardPopup';
import NudgeMessagePopup from '../components/NudgeMessagePopup';
import CharacterVoicePlayer from '../components/CharacterVoicePlayer';
import AITodoSuggestions from '../components/AITodoSuggestions';
import TodoTemplateManager from '../components/TodoTemplateManager';
import AdBanner from '../components/AdBanner';
import CoupangRandomLink from '../components/CoupangRandomLink';
import { getSettings } from '../utils/storage';
import { getCurrentAmPm } from '../utils/timeUtils';
import { useTodoTemplates } from '../hooks/useTodoTemplates';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { todos, addTodo, toggleComplete, deleteTodo, getCompletionRate } = useTodos();
  const { addReward, getTodayTotalPoints } = useRewards();
  const { nudgeTriggered, currentNudge, dismissNudge } = useNudge(todos);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');
  const [newTodoAmPm, setNewTodoAmPm] = useState<'AM' | 'PM'>(getCurrentAmPm());
  const [newTodoImportance, setNewTodoImportance] = useState(1);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);

  const handleAddTodo = () => {
    if (newTodoText.trim() && newTodoDeadline) {
      addTodo(newTodoText, newTodoDeadline, newTodoImportance, newTodoAmPm);
      setNewTodoText('');
      setNewTodoDeadline('');
      setNewTodoAmPm(getCurrentAmPm());
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

      // 축하 애니메이션
      const completedCount = todos.filter(t => t.isCompleted).length + 1;
      setCelebrationCount(completedCount);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);

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

  const [isMobile, setIsMobile] = useState(false);
  const settings = getSettings();
  const completionRate = getCompletionRate();
  const todayPoints = getTodayTotalPoints();
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.isCompleted).length;
  const { getTodayTemplates } = useTodoTemplates();
  const appliedTemplatesCount = getTodayTemplates().length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 요약 카드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #2196f3'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>오늘 할 일</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>{totalTodos}개</div>
        </div>
        <div style={{
          padding: '16px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #4caf50'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>완료</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>{completedTodos}개</div>
        </div>
        <div style={{
          padding: '16px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ff9800'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>완료율</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>{completionRate.toFixed(0)}%</div>
        </div>
        <div style={{
          padding: '16px',
          backgroundColor: '#f3e5f5',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #9c27b0'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>템플릿</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>{appliedTemplatesCount}개</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
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

      <AITodoSuggestions />
      <TodoTemplateManager />

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
            marginBottom: '16px'
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
            marginBottom: '16px'
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
          <div style={{ marginBottom: '12px' }}>
            {settings.timeFormat === '12h' ? (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={newTodoDeadline ? parseInt(newTodoDeadline.split(':')[0]) || 12 : 12}
                    onChange={(e) => {
                      const hours = Math.max(1, Math.min(12, parseInt(e.target.value) || 12));
                      const minutes = newTodoDeadline ? newTodoDeadline.split(':')[1] || '00' : '00';
                      setNewTodoDeadline(`${String(hours).padStart(2, '0')}:${minutes}`);
                    }}
                    style={{
                      width: '80px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={newTodoDeadline ? parseInt(newTodoDeadline.split(':')[1]) || 0 : 0}
                    onChange={(e) => {
                      const minutes = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                      const hours = newTodoDeadline ? newTodoDeadline.split(':')[0] || '12' : '12';
                      setNewTodoDeadline(`${hours}:${String(minutes).padStart(2, '0')}`);
                    }}
                    style={{
                      width: '80px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setNewTodoAmPm('AM')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: newTodoAmPm === 'AM' ? '#8ECFFF' : '#f5f5f5',
                      color: newTodoAmPm === 'AM' ? '#fff' : '#333',
                      border: `2px solid ${newTodoAmPm === 'AM' ? '#8ECFFF' : '#ddd'}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTodoAmPm('PM')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: newTodoAmPm === 'PM' ? '#FFA85A' : '#f5f5f5',
                      color: newTodoAmPm === 'PM' ? '#fff' : '#333',
                      border: `2px solid ${newTodoAmPm === 'PM' ? '#FFA85A' : '#ddd'}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    PM
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="time"
                value={newTodoDeadline}
                onChange={(e) => setNewTodoDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            )}
          </div>
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
                setNewTodoAmPm(getCurrentAmPm());
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

      {/* 쿠팡 파트너스 랜덤 링크 */}
      <CoupangRandomLink />

      {/* Google AdSense 광고 */}
      <AdBanner slot="HOME_01" style={{ marginTop: '12px', marginBottom: '0' }} />

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
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

      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'fadeOut 2s ease-out forwards'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'rgba(76, 175, 80, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transform: 'scale(1)',
              animation: 'scaleIn 0.5s ease-out, scaleOut 1.5s ease-in 0.5s'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
              오늘 {celebrationCount}번째 성공!
            </div>
            <div style={{ fontSize: '18px', color: '#fff' }}>훌륭해요! 계속 화이팅! 💪</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;

