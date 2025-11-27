import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, setSettings } from '../utils/storage';
import { nudgeMessages } from '../data/nudgeMessages';
import { characterVoices } from '../data/characterVoices';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, updateSettings] = useState(getSettings());

  useEffect(() => {
    updateSettings(getSettings());
  }, []);

  const handleNudgeTypeChange = (type: 'soft' | 'direct' | 'funny' | 'strong') => {
    const newSettings = { ...settings, nudgeType: type };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleCharacterVoiceChange = (voiceId: string) => {
    const newSettings = { ...settings, characterVoice: voiceId };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleNotificationTypeChange = (type: 'popup' | 'voice' | 'vibration') => {
    const newSettings = { ...settings, notificationType: type };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const selectedNudgeMessages = nudgeMessages.filter(msg => msg.type === settings.nudgeType);

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

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>유도 문구 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['soft', 'direct', 'funny', 'strong'] as const).map((type) => (
            <label
              key={type}
              style={{
                padding: '16px',
                border: `2px solid ${settings.nudgeType === type ? '#2196f3' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: settings.nudgeType === type ? '#e3f2fd' : '#fff'
              }}
            >
              <input
                type="radio"
                name="nudgeType"
                value={type}
                checked={settings.nudgeType === type}
                onChange={() => handleNudgeTypeChange(type)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                {type === 'soft' && '부드러운'}
                {type === 'direct' && '직설적인'}
                {type === 'funny' && '유쾌한'}
                {type === 'strong' && '강한'}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                ({selectedNudgeMessages.length}개 메시지)
              </span>
            </label>
          ))}
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>예시 메시지:</div>
          {selectedNudgeMessages.slice(0, 3).map((msg) => (
            <div key={msg.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
              • {msg.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>캐릭터 음성 선택</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {characterVoices.map((voice) => (
            <label
              key={voice.id}
              style={{
                padding: '16px',
                border: `2px solid ${settings.characterVoice === voice.id ? '#2196f3' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: settings.characterVoice === voice.id ? '#e3f2fd' : '#fff'
              }}
            >
              <input
                type="radio"
                name="characterVoice"
                value={voice.id}
                checked={settings.characterVoice === voice.id}
                onChange={() => handleCharacterVoiceChange(voice.id)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold' }}>{voice.name}</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                ({voice.type === 'cute' && '귀여운'} {voice.type === 'serious' && '진지한'} {voice.type === 'funny' && '유쾌한'} {voice.type === 'gentle' && '온화한'})
              </span>
            </label>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default SettingsPage;

