import React, { useRef, useEffect } from 'react';
import { characterVoices } from '../data/characterVoices';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface CharacterVoicePlayerProps {
  message: string;
  characterVoice?: string;
  enabled: boolean;
}

/**
 * 캐릭터 음성 재생 컴포넌트
 * 리마인더 알림 시 선택된 캐릭터의 음성을 재생합니다.
 */
const CharacterVoicePlayer: React.FC<CharacterVoicePlayerProps> = ({
  message,
  characterVoice = '1',
  enabled
}) => {
  const voice = characterVoices.find(v => v.id === characterVoice);
  const audioPlayer = useAudioPlayer(voice?.audioUrl);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (enabled && message) {
      // 오디오 파일이 있는 경우 우선 재생
      if (voice?.audioUrl) {
        audioPlayer.play().then(() => {
          // 재생 성공
        }).catch(() => {
          // 오디오 재생 실패 시 Web Speech API로 폴백
          playWithSpeechSynthesis(message, characterVoice);
        });
      } else {
        // 오디오 파일이 없으면 Web Speech API 사용
        playWithSpeechSynthesis(message, characterVoice);
      }
    }

    return () => {
      audioPlayer.stop();
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [enabled, message, characterVoice, voice?.audioUrl]);

  const playWithSpeechSynthesis = (text: string, voiceId: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.volume = 0.8;
      
      // 캐릭터별 음성 특성 조정
      switch (voiceId) {
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

      speechSynthesisRef.current = window.speechSynthesis;
      speechSynthesisRef.current.speak(utterance);
    }
  };

  return <div style={{ display: 'none' }} />;
};

export default CharacterVoicePlayer;
