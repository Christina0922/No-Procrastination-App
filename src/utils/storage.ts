const STORAGE_KEYS = {
  TODOS: 'no-procrastination-todos',
  REWARDS: 'no-procrastination-rewards',
  SETTINGS: 'no-procrastination-settings',
  STATISTICS: 'no-procrastination-statistics'
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

export const getSettings = () => storage.get(STORAGE_KEYS.SETTINGS, {
  nudgeType: 'soft',
  characterVoice: '1',
  notificationType: 'popup'
});
export const setSettings = (settings: any) => storage.set(STORAGE_KEYS.SETTINGS, settings);

export const getStatistics = () => storage.get(STORAGE_KEYS.STATISTICS, {
  dailyStats: {},
  weeklyStats: {},
  monthlyStats: {},
  streakDays: 0,
  lastCompletedDate: null
});
export const setStatistics = (stats: any) => storage.set(STORAGE_KEYS.STATISTICS, stats);

