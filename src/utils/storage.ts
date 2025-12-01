const STORAGE_KEYS = {
  TODOS: 'no-procrastination-todos',
  REWARDS: 'no-procrastination-rewards',
  SETTINGS: 'no-procrastination-settings',
  STATISTICS: 'no-procrastination-statistics',
  EXCHANGE_HISTORY: 'no-procrastination-exchange-history'
};

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export const getTodos = () => storage.get(STORAGE_KEYS.TODOS, []);
export const setTodos = (todos: any[]) => storage.set(STORAGE_KEYS.TODOS, todos);

export const getRewards = () => storage.get(STORAGE_KEYS.REWARDS, []);
export const setRewards = (rewards: any[]) => storage.set(STORAGE_KEYS.REWARDS, rewards);

export interface Settings {
  nudgeType: 'soft' | 'direct' | 'funny' | 'strong' | 'emotional';
  characterVoice: string;
  notificationType: 'popup' | 'voice' | 'vibration';
  reminderTiming: '10min' | '30min' | 'deadline' | 'all';
}

export const getSettings = (): Settings => storage.get<Settings>(STORAGE_KEYS.SETTINGS, {
  nudgeType: 'soft',
  characterVoice: '1',
  notificationType: 'popup',
  reminderTiming: 'all'
});
export const setSettings = (settings: Settings) => storage.set(STORAGE_KEYS.SETTINGS, settings);

export interface DailyStat {
  completed: number;
  total: number;
  rate: number;
}

export interface Statistics {
  dailyStats: { [key: string]: DailyStat };
  weeklyStats: { [key: string]: DailyStat };
  monthlyStats: { [key: string]: DailyStat };
  streakDays: number;
  lastCompletedDate: string | null;
}

export const getStatistics = (): Statistics => storage.get<Statistics>(STORAGE_KEYS.STATISTICS, {
  dailyStats: {},
  weeklyStats: {},
  monthlyStats: {},
  streakDays: 0,
  lastCompletedDate: null
});
export const setStatistics = (stats: Statistics) => storage.set(STORAGE_KEYS.STATISTICS, stats);

export interface ExchangeHistory {
  id: string;
  rewardName: string;
  pointsUsed: number;
  exchangedAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export const getExchangeHistory = (): ExchangeHistory[] => storage.get<ExchangeHistory[]>(STORAGE_KEYS.EXCHANGE_HISTORY, []);
export const setExchangeHistory = (history: ExchangeHistory[]) => storage.set(STORAGE_KEYS.EXCHANGE_HISTORY, history);
export const addExchangeHistory = (exchange: ExchangeHistory) => {
  const history = getExchangeHistory();
  history.push(exchange);
  setExchangeHistory(history);
};

