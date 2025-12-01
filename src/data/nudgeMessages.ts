/**
 * @deprecated 이 파일은 motivationMessages.ts로 이동되었습니다.
 * 기존 호환성을 위해 유지되지만, 새로운 코드는 motivationMessages를 사용하세요.
 */
import { motivationMessages } from './motivationMessages';

export interface NudgeMessage {
  id: string;
  type: "soft" | "direct" | "funny" | "strong" | "emotional";
  text: string;
  audio?: string;
}

// 기존 호환성을 위해 motivationMessages를 재export
export const nudgeMessages: NudgeMessage[] = motivationMessages as NudgeMessage[];
