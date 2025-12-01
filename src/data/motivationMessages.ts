/**
 * 유도 문구 데이터
 * 카테고리별로 10개씩 구성 (총 50개)
 * 각 카테고리: soft, direct, funny, strong, emotional
 */
export interface MotivationMessage {
  id: string;
  type: "soft" | "direct" | "funny" | "strong" | "emotional";
  text: string;
  audio?: string;
}

export const motivationMessages: MotivationMessage[] = [
  // 부드러운 (10개)
  { id: "1", type: "soft", text: "지금 잠깐만 하면 끝나요." },
  { id: "2", type: "soft", text: "조금만 집중해 볼까요?" },
  { id: "3", type: "soft", text: "천천히, 하지만 지금 시작해요." },
  { id: "4", type: "soft", text: "5분만 투자해보세요. 괜찮아요." },
  { id: "5", type: "soft", text: "지금 시작하면 금방 끝날 거예요." },
  { id: "6", type: "soft", text: "조금씩이라도 해보면 좋을 것 같아요." },
  { id: "7", type: "soft", text: "지금이 가장 좋은 타이밍이에요." },
  { id: "8", type: "soft", text: "천천히 시작해도 괜찮아요." },
  { id: "9", type: "soft", text: "작은 걸음부터 시작해볼까요?" },
  { id: "10", type: "soft", text: "지금 하면 나중에 후회 안 해요." },
  
  // 직설적 (10개)
  { id: "11", type: "direct", text: "지금 안 하면 보상 사라져요." },
  { id: "12", type: "direct", text: "미루면 손해입니다. 지금 처리하세요." },
  { id: "13", type: "direct", text: "5분만 시작해도 절반 끝난 거예요." },
  { id: "14", type: "direct", text: "지금 안 하면 나중에 더 힘들어요." },
  { id: "15", type: "direct", text: "미루면 시간만 낭비예요." },
  { id: "16", type: "direct", text: "지금 바로 시작하세요." },
  { id: "17", type: "direct", text: "미루지 말고 지금 하세요." },
  { id: "18", type: "direct", text: "시간이 없어요. 지금 하세요." },
  { id: "19", type: "direct", text: "지금 안 하면 기회 놓쳐요." },
  { id: "20", type: "direct", text: "미루면 안 돼요. 지금 처리하세요." },
  
  // 유쾌한 (10개)
  { id: "21", type: "funny", text: "이거 미루면 내일의 당신이 화내요." },
  { id: "22", type: "funny", text: "아 왜 미뤄요? 귀찮아도 해요!" },
  { id: "23", type: "funny", text: "미루면 나 오늘 삐질 거예요." },
  { id: "24", type: "funny", text: "지금 안 하면 나중에 후회할 거예요~" },
  { id: "25", type: "funny", text: "미루는 거 보니까 나도 게을러져요!" },
  { id: "26", type: "funny", text: "지금 하면 나중에 쉴 수 있어요!" },
  { id: "27", type: "funny", text: "미루면 할 일이 쌓여서 더 힘들어요~" },
  { id: "28", type: "funny", text: "지금 하면 오늘 저녁 편하게 쉴 수 있어요!" },
  { id: "29", type: "funny", text: "미루지 말고 지금 해요! 제발~" },
  { id: "30", type: "funny", text: "지금 안 하면 나중에 더 귀찮아져요!" },
  
  // 강한 (10개)
  { id: "31", type: "strong", text: "진짜로 안 할 거예요?" },
  { id: "32", type: "strong", text: "미루면 오늘 보상 없습니다." },
  { id: "33", type: "strong", text: "지금 시작하세요. 바로요." },
  { id: "34", type: "strong", text: "미루지 마세요. 지금 하세요." },
  { id: "35", type: "strong", text: "더 이상 미룰 수 없어요." },
  { id: "36", type: "strong", text: "지금 바로 시작하세요. 끝까지요." },
  { id: "37", type: "strong", text: "미루면 모든 게 망가져요." },
  { id: "38", type: "strong", text: "지금 안 하면 후회할 거예요." },
  { id: "39", type: "strong", text: "더 이상 기다리지 마세요." },
  { id: "40", type: "strong", text: "지금 시작하세요. 당장요." },
  
  // 감성적인 (10개)
  { id: "41", type: "emotional", text: "지금 시작하면 오늘 하루가 의미 있어져요." },
  { id: "42", type: "emotional", text: "작은 걸음이 큰 변화를 만들어요." },
  { id: "43", type: "emotional", text: "지금의 노력이 미래의 당신을 만들어요." },
  { id: "44", type: "emotional", text: "지금 시작하면 자신에게 자랑스러워질 거예요." },
  { id: "45", type: "emotional", text: "작은 성취가 큰 만족을 줘요." },
  { id: "46", type: "emotional", text: "지금의 선택이 내일을 바꿔요." },
  { id: "47", type: "emotional", text: "지금 시작하면 오늘 하루가 빛나요." },
  { id: "48", type: "emotional", text: "작은 노력이 큰 결과를 만들어요." },
  { id: "49", type: "emotional", text: "지금 시작하면 자신을 사랑할 수 있어요." },
  { id: "50", type: "emotional", text: "지금의 한 걸음이 미래를 바꿔요." }
];

/**
 * 카테고리별 메시지 가져오기
 */
export const getMessagesByCategory = (category: "soft" | "direct" | "funny" | "strong" | "emotional"): MotivationMessage[] => {
  return motivationMessages.filter(msg => msg.type === category);
};

/**
 * 모든 카테고리 목록
 */
export const categories = ["soft", "direct", "funny", "strong", "emotional"] as const;

