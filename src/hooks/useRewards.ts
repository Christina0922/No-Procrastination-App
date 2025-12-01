import { useState, useEffect } from 'react';
import { getRewards, setRewards } from '../utils/storage';
import { isToday } from '../utils/timeUtils';

export interface RewardHistory {
  id: string;
  todoId: string;
  amount: number;
  date: string;
}

export const useRewards = () => {
  const [rewards, setRewardsState] = useState<RewardHistory[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const savedRewards = getRewards();
    setRewardsState(savedRewards);
    const total = savedRewards.reduce((sum: number, reward: RewardHistory) => sum + reward.amount, 0);
    setTotalPoints(total);
  }, []);

  const saveRewards = (newRewards: RewardHistory[]) => {
    setRewards(newRewards);
    setRewardsState(newRewards);
    const total = newRewards.reduce((sum, reward) => sum + reward.amount, 0);
    setTotalPoints(total);
  };

  const addReward = (todoId: string, amount: number) => {
    const newReward: RewardHistory = {
      id: Date.now().toString(),
      todoId,
      amount,
      date: new Date().toISOString()
    };
    const newRewards = [...rewards, newReward];
    saveRewards(newRewards);
    return newReward;
  };

  const getTodayRewards = () => {
    return rewards.filter(reward => isToday(reward.date));
  };

  const getTodayTotalPoints = () => {
    return getTodayRewards().reduce((sum, reward) => sum + reward.amount, 0);
  };

  /**
   * 포인트 차감 함수 (기프티콘 교환 시 사용)
   * @param amount 차감할 포인트
   * @returns 성공 여부
   */
  const deductPoints = (amount: number): boolean => {
    if (totalPoints < amount) {
      return false;
    }

    // 포인트 차감을 위해 음수 보상 추가
    const deductionReward: RewardHistory = {
      id: `deduction-${Date.now()}`,
      todoId: 'gift-exchange',
      amount: -amount, // 음수로 저장
      date: new Date().toISOString()
    };
    const newRewards = [...rewards, deductionReward];
    saveRewards(newRewards);
    return true;
  };

  return {
    rewards,
    totalPoints,
    addReward,
    getTodayRewards,
    getTodayTotalPoints,
    deductPoints
  };
};

