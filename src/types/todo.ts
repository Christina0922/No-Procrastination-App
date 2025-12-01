export interface Todo {
  id: string;
  text: string;

  amPm: "AM" | "PM";
  deadline: string;

  importance: number;
  isCompleted: boolean;

  createdAt: string;
  startedAt: string | null;
}
