export interface CharacterVoice {
  id: string;
  name: string;
  type: "cute" | "serious" | "funny" | "gentle";
  audioUrl?: string;
}

export const characterVoices: CharacterVoice[] = [
  { id: "1", name: "귀여운 친구", type: "cute" },
  { id: "2", name: "진지한 코치", type: "serious" },
  { id: "3", name: "유쾌한 파트너", type: "funny" },
  { id: "4", name: "온화한 멘토", type: "gentle" }
];

