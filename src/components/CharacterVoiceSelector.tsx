import React from 'react';
import { getSettings, setSettings, type Settings } from '../utils/storage';
import { characterVoices } from '../data/characterVoices';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface CharacterVoiceSelectorProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * 캐릭터 음성 선택 컴포넌트
 * 각 캐릭터 선택 시 미리듣기 버튼을 제공합니다.
 */
const CharacterVoiceSelector: React.FC<CharacterVoiceSelectorProps> = ({ settings, onSettingsChange }) => {
  const selectedVoice = characterVoices.find(v => v.id === settings.characterVoice);
  const audioPlayer = useAudioPlayer(selectedVoice?.audioUrl);

  const handleCharacterVoiceChange = (voiceId: string) => {
    const newSettings = { ...settings, characterVoice: voiceId };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handlePreview = async () => {
    if (selectedVoice?.audioUrl) {
      await audioPlayer.play();
    } else if (selectedVoice?.sampleText) {
      // 오디오 파일이 없으면 Web Speech API 사용
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(selectedVoice.sampleText);
        utterance.lang = 'ko-KR';
        utterance.volume = 0.8;
        
        // 캐릭터별 음성 특성 조정
        switch (selectedVoice.id) {
          case '1': // 귀여운 친구
            utterance.rate = 1.1;
            utterance.pitch = 1.3;
            break;
          case '2': // 진지한 코치
            utterance.rate = 0.95;
            utterance.pitch = 0.9;
            break;
          case '3': // 유쾌한 파트너
            utterance.rate = 1.15;
            utterance.pitch = 1.1;
            break;
          case '4': // 온화한 멘토
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            break;
          default:
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
        }

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const typeLabels: Record<string, string> = {
    cute: '귀여운',
    serious: '진지한',
    funny: '유쾌한',
    gentle: '온화한'
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>캐릭터 음성 선택</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {characterVoices.map((voice) => (
          <div
            key={voice.id}
            style={{
              padding: '16px',
              border: `2px solid ${settings.characterVoice === voice.id ? '#2196f3' : '#ddd'}`,
              borderRadius: '8px',
              backgroundColor: settings.characterVoice === voice.id ? '#e3f2fd' : '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <label
              style={{
                flex: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
              <div>
                <span style={{ fontWeight: 'bold' }}>{voice.name}</span>
                <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                  ({typeLabels[voice.type]})
                </span>
                {voice.sampleText && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    "{voice.sampleText}"
                  </div>
                )}
              </div>
            </label>
            {settings.characterVoice === voice.id && (
              <button
                onClick={handlePreview}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                미리듣기
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedVoice?.audioUrl && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px', fontSize: '14px', color: '#1976d2' }}>
          💡 오디오 파일이 설정되어 있습니다. 미리듣기 버튼을 눌러 확인하세요.
        </div>
      )}
    </div>
  );
};

export default CharacterVoiceSelector;

