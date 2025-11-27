import React, { useRef, useEffect } from 'react';

interface CharacterVoicePlayerProps {
  message: string;
  characterVoice?: string;
  enabled: boolean;
}

const CharacterVoicePlayer: React.FC<CharacterVoicePlayerProps> = ({
  message,
  characterVoice,
  enabled
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (enabled && message) {
      // Web Speech API를 사용한 음성 재생
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        
        // 언어 설정
        utterance.lang = 'ko-KR';
        
        // 음성 속도 및 피치 조정
        utterance.rate = 1.0;
        utterance.pitch = characterVoice === '1' ? 1.2 : characterVoice === '2' ? 0.9 : 1.0;
        utterance.volume = 0.8;

        // 음성 재생
        speechSynthesis.speak(utterance);

        return () => {
          speechSynthesis.cancel();
        };
      }
    }
  }, [enabled, message, characterVoice]);

  // 오디오 파일이 있는 경우 사용 (추후 구현)
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Audio play error:', error);
      });
    }
  };

  return (
    <div style={{ display: 'none' }}>
      <audio ref={audioRef} />
    </div>
  );
};

export default CharacterVoicePlayer;

