/**
 * 캐릭터 음성 데이터
 * 각 캐릭터의 음성 파일 경로와 샘플 텍스트를 정의합니다.
 * 
 * 음성 파일 경로 예시:
 * - public/voice/cute.mp3
 * - public/voice/serious.mp3
 * - public/voice/funny.mp3
 * - public/voice/gentle.mp3
 */
export interface CharacterVoice {
  id: string;
  name: string;
  type: "cute" | "serious" | "funny" | "gentle";
  audioUrl?: string; // 예: "/voice/cute.mp3" 또는 "voice/cute.mp3"
  sampleText?: string;
}

export const characterVoices: CharacterVoice[] = [
  { 
    id: "1", 
    name: "귀여운 친구", 
    type: "cute",
    audioUrl: "/voice/cute.mp3", // 실제 파일 경로 (나중에 추가 예정)
    sampleText: "잠깐만 하면 된다구!"
  },
  { 
    id: "2", 
    name: "진지한 코치", 
    type: "serious",
    audioUrl: "/voice/coach.mp3", // 실제 파일 경로 (나중에 추가 예정)
    sampleText: "지금 시작하면 끝난다."
  },
  { 
    id: "3", 
    name: "유쾌한 파트너", 
    type: "funny",
    audioUrl: "/voice/partner.mp3", // 실제 파일 경로 (나중에 추가 예정)
    sampleText: "에이~ 오늘만 해보자!"
  },
  { 
    id: "4", 
    name: "온화한 멘토", 
    type: "gentle",
    audioUrl: "/voice/mentor.mp3", // 실제 파일 경로 (나중에 추가 예정)
    sampleText: "작은 걸음이 큰 변화를 만들어요."
  }
];

