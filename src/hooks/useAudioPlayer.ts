import { useRef, useEffect } from 'react';

/**
 * 오디오 재생 훅
 * 오디오 파일 재생, 정지, 중복 재생 방지 로직을 제공합니다.
 */
export const useAudioPlayer = (audioUrl?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        isPlayingRef.current = false;
      }
    };
  }, []);

  const play = async (): Promise<void> => {
    // 중복 재생 방지
    if (isPlayingRef.current) {
      return;
    }

    if (!audioUrl) {
      console.warn('Audio URL is not provided');
      return;
    }

    try {
      // 기존 오디오 정지
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 새 오디오 생성 및 재생
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      audioRef.current = audio;
      isPlayingRef.current = true;

      await audio.play();

      // 재생 완료 시 상태 초기화
      audio.onended = () => {
        isPlayingRef.current = false;
        audioRef.current = null;
      };

      // 에러 처리
      audio.onerror = () => {
        console.error('Audio playback failed');
        isPlayingRef.current = false;
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Failed to play audio:', error);
      isPlayingRef.current = false;
      audioRef.current = null;
    }
  };

  const stop = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      isPlayingRef.current = false;
    }
  };

  const isPlaying = (): boolean => {
    return isPlayingRef.current;
  };

  return {
    play,
    stop,
    isPlaying
  };
};

