import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, setSettings } from '../utils/storage';
import ReminderSettings from '../components/ReminderSettings';
import MessageSelector from '../components/MessageSelector';
import CharacterVoiceSelector from '../components/CharacterVoiceSelector';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, updateSettings] = useState(getSettings());

  useEffect(() => {
    updateSettings(getSettings());
  }, []);

  const handleNotificationTypeChange = (type: 'popup' | 'voice' | 'vibration') => {
    const newSettings = { ...settings, notificationType: type };
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
    </div>
  );
};

export default SettingsPage;

