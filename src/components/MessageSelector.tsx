import React from 'react';
import { getSettings, setSettings, type Settings } from '../utils/storage';
import { motivationMessages, getMessagesByCategory, categories } from '../data/motivationMessages';

interface MessageSelectorProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * 유도 문구 선택 컴포넌트
 * 카테고리별로 문구를 선택할 수 있습니다.
 */
const MessageSelector: React.FC<MessageSelectorProps> = ({ settings, onSettingsChange }) => {
  const handleCategoryChange = (category: 'soft' | 'direct' | 'funny' | 'strong' | 'emotional') => {
    const newSettings = { ...settings, nudgeType: category };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const selectedMessages = getMessagesByCategory(settings.nudgeType);
  const categoryLabels: Record<typeof categories[number], string> = {
    soft: '부드러운',
    direct: '직설적인',
    funny: '유쾌한',
    strong: '강한',
    emotional: '감성적인'
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>유도 문구 선택</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map((category) => (
          <label
            key={category}
            style={{
              padding: '16px',
              border: `2px solid ${settings.nudgeType === category ? '#2196f3' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: settings.nudgeType === category ? '#e3f2fd' : '#fff'
            }}
          >
            <input
              type="radio"
              name="nudgeType"
              value={category}
              checked={settings.nudgeType === category}
              onChange={() => handleCategoryChange(category)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
              {categoryLabels[category]}
            </span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              ({getMessagesByCategory(category).length}개 메시지)
            </span>
          </label>
        ))}
      </div>
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>예시 메시지:</div>
        {selectedMessages.slice(0, 3).map((msg) => (
          <div key={msg.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
            • {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSelector;

