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

  return {
    rewards,
    totalPoints,
    addReward,
    getTodayRewards,
    getTodayTotalPoints
  };
};

