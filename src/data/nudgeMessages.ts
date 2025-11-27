export interface NudgeMessage {
  id: string;
  type: "soft" | "direct" | "funny" | "strong";
  text: string;
  audio?: string;
}

export const nudgeMessages: NudgeMessage[] = [
  { id: "1", type: "soft", text: "지금 잠깐만 하면 끝나요." },
  { id: "2", type: "soft", text: "조금만 집중해 볼까요?" },
  { id: "3", type: "direct", text: "지금 안 하면 보상 사라져요." },
  { id: "4", type: "direct", text: "미루면 손해입니다. 지금 처리하세요." },
  { id: "5", type: "funny", text: "이거 미루면 내일의 당신이 화내요." },
  { id: "6", type: "funny", text: "아 왜 미뤄요? 귀찮아도 해요!" },
  { id: "7", type: "strong", text: "진짜로 안 할 거예요?" },
  { id: "8", type: "strong", text: "미루면 오늘 보상 없습니다." },
  { id: "9", type: "direct", text: "5분만 시작해도 절반 끝난 거예요." },
  { id: "10", type: "funny", text: "미루면 나 오늘 삐질 거예요." },
  { id: "11", type: "soft", text: "천천히, 하지만 지금 시작해요." },
  { id: "12", type: "strong", text: "지금 시작하세요. 바로요." }
];

