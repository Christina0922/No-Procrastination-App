// src/api/gift.ts

export interface Reward {
  id: string;
  name: string;
  points: number;
  imageUrl: string;
  description: string;
}

// 앱 내에서 사용될 보상 상품 목록 (UI 전용, 실제 발송 없음)
export const rewards: Reward[] = [
  {
    id: "starbucks",
    name: "스타벅스 아메리카노",
    points: 100,
    imageUrl: "/images/starbucks.png",
    description: "집중 끝내고 마시는 한 잔의 여유 ☕"
  },
  {
    id: "gs25",
    name: "GS25 3000원권",
    points: 120,
    imageUrl: "/images/gs25.png",
    description: "편의점에서 간단한 리프레시 🍙"
  },
  {
    id: "cu",
    name: "CU 3000원권",
    points: 120,
    imageUrl: "/images/cu.png",
    description: "근처 편의점에서 바로 사용 가능 🏪"
  }
];

// 보상 목록 반환
export function getRewards(): Reward[] {
  return rewards;
}

// 포인트 충분 여부 체크
export function validatePoints(userPoints: number, cost: number): boolean {
  return userPoints >= cost;
}

// 교환 처리 (실제 발송은 없음. UI 성공 처리 전용)
export async function exchangeReward(rewardId: string): Promise<"SUCCESS"> {
  console.log("Mock exchangeReward:", rewardId);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return "SUCCESS";
}
