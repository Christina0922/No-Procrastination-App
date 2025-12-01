import React from 'react';
import { setSettings, type Settings } from '../utils/storage';
import { requestNotificationPermission } from '../utils/notification';

interface ReminderSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * 리마인더 설정 컴포넌트
 * 마감 시간 기준 알림 옵션을 설정합니다.
 */
const ReminderSettings: React.FC<ReminderSettingsProps> = ({ settings, onSettingsChange }) => {
  const handleReminderTimingChange = async (timing: '10min' | '30min' | 'deadline' | 'all') => {
    const newSettings = { ...settings, reminderTiming: timing };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    // 알림 권한 요청 (처음 설정할 때)
    if (timing !== 'deadline') {
      await requestNotificationPermission();
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>리마인더 시간 설정</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {([
          { value: '10min' as const, label: '마감 10분 전' },
          { value: '30min' as const, label: '마감 30분 전' },
          { value: 'deadline' as const, label: '마감 시간에' },
          { value: 'all' as const, label: '모두 (10분 전, 30분 전, 마감 시간)' }
        ]).map(({ value, label }) => (
          <label
            key={value}
            style={{
              padding: '16px',
              border: `2px solid ${settings.reminderTiming === value ? '#2196f3' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: settings.reminderTiming === value ? '#e3f2fd' : '#fff'
            }}
          >
            <input
              type="radio"
              name="reminderTiming"
              value={value}
              checked={settings.reminderTiming === value}
              onChange={() => handleReminderTimingChange(value)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: 'bold' }}>{label}</span>
          </label>
        ))}
      </div>
      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '8px', fontSize: '14px', color: '#856404' }}>
        💡 브라우저 알림 권한을 허용하면 백그라운드에서도 알림을 받을 수 있어요.
      </div>
    </div>
  );
};

export default ReminderSettings;

