import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, setSettings } from '../utils/storage';
import ReminderSettings from '../components/ReminderSettings';
import MessageSelector from '../components/MessageSelector';
import CharacterVoiceSelector from '../components/CharacterVoiceSelector';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [settings, updateSettings] = useState(getSettings());

  useEffect(() => {
    updateSettings(getSettings());
  }, []);

  const handleNotificationTypeChange = (type: 'popup' | 'voice' | 'vibration') => {
    const newSettings = { ...settings, notificationType: type };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleTimeFormatChange = (format: '12h' | '24h') => {
    const newSettings = { ...settings, timeFormat: format };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>설정</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          홈으로
        </button>
      </div>

      <MessageSelector settings={settings} onSettingsChange={updateSettings} />

      <CharacterVoiceSelector settings={settings} onSettingsChange={updateSettings} />

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>알림 방식 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['popup', 'voice', 'vibration'] as const).map((type) => (
            <label
              key={type}
              style={{
                padding: '16px',
                border: `2px solid ${settings.notificationType === type ? '#2196f3' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: settings.notificationType === type ? '#e3f2fd' : '#fff'
              }}
            >
              <input
                type="radio"
                name="notificationType"
                value={type}
                checked={settings.notificationType === type}
                onChange={() => handleNotificationTypeChange(type)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold' }}>
                {type === 'popup' && '팝업 알림'}
                {type === 'voice' && '음성 알림'}
                {type === 'vibration' && '진동 알림'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <ReminderSettings settings={settings} onSettingsChange={updateSettings} />

      {/* 조합 미리듣기 기능 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>현재 조합 미리듣기</h2>
        <button
          onClick={async () => {
            const { getMessagesByCategory } = await import('../data/motivationMessages');
            const { characterVoices } = await import('../data/characterVoices');
            const messages = getMessagesByCategory(settings.nudgeType);
            const voice = characterVoices.find(v => v.id === settings.characterVoice);
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            if (voice?.audioUrl) {
              // 오디오 파일 재생
              const audio = new Audio(voice.audioUrl);
              await audio.play();
              // 메시지도 TTS로 재생
              setTimeout(() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(randomMessage.text);
                  utterance.lang = 'ko-KR';
                  window.speechSynthesis.speak(utterance);
                }
              }, audio.duration * 1000);
            } else {
              // TTS만 사용
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(randomMessage.text);
                utterance.lang = 'ko-KR';
                utterance.volume = 0.8;
                window.speechSynthesis.speak(utterance);
              }
            }
          }}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#9c27b0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔊 조합 미리듣기
        </button>
      </div>

      {/* 데이터 백업/복구 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>데이터 관리</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const data = {
                todos: localStorage.getItem('no-procrastination-todos'),
                rewards: localStorage.getItem('no-procrastination-rewards'),
                settings: localStorage.getItem('no-procrastination-settings'),
                statistics: localStorage.getItem('no-procrastination-statistics'),
                exchangeHistory: localStorage.getItem('no-procrastination-exchange-history'),
                templates: localStorage.getItem('no-procrastination-todo-templates')
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `no-procrastination-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              alert('백업이 완료되었습니다!');
            }}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '12px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            💾 데이터 백업
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      if (data.todos) localStorage.setItem('no-procrastination-todos', data.todos);
                      if (data.rewards) localStorage.setItem('no-procrastination-rewards', data.rewards);
                      if (data.settings) localStorage.setItem('no-procrastination-settings', data.settings);
                      if (data.statistics) localStorage.setItem('no-procrastination-statistics', data.statistics);
                      if (data.exchangeHistory) localStorage.setItem('no-procrastination-exchange-history', data.exchangeHistory);
                      if (data.templates) localStorage.setItem('no-procrastination-todo-templates', data.templates);
                      alert('복구가 완료되었습니다! 페이지를 새로고침하세요.');
                      window.location.reload();
                    } catch (error) {
                      alert('복구 실패: 파일 형식이 올바르지 않습니다.');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '12px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📥 데이터 복구
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>시간 형식 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['12h', '24h'] as const).map((format) => (
            <label
              key={format}
              style={{
                padding: '16px',
                border: `2px solid ${settings.timeFormat === format ? '#2196f3' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: settings.timeFormat === format ? '#e3f2fd' : '#fff'
              }}
            >
              <input
                type="radio"
                name="timeFormat"
                value={format}
                checked={settings.timeFormat === format}
                onChange={() => handleTimeFormatChange(format)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold' }}>
                {format === '12h' && '12시간제 (오전/오후)'}
                {format === '24h' && '24시간제'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 다크 모드 설정 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>테마 설정</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['light', 'dark', 'system'] as const).map((themeOption) => (
            <label
              key={themeOption}
              style={{
                padding: '16px',
                border: `2px solid ${theme === themeOption ? '#2196f3' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: theme === themeOption ? '#e3f2fd' : '#fff'
              }}
            >
              <input
                type="radio"
                name="theme"
                value={themeOption}
                checked={theme === themeOption}
                onChange={() => setTheme(themeOption)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold' }}>
                {themeOption === 'light' && '라이트 모드'}
                {themeOption === 'dark' && '다크 모드'}
                {themeOption === 'system' && '시스템 자동'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

