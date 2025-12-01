export interface Todo {
  id: string;
  text: string;

  // 시간 관련
  amPm: "AM" | "PM";
  deadline: string; // "18:00" 같은 문자열

  // 중요도
  importance: number; // 1~3

  // 완료 여부
  isCompleted: boolean;

  // 생성/시작 시간
  createdAt: string;  // ISO string
  startedAt: string | null;  // 최초 시작 시간
}

