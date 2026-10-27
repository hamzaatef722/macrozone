import AsyncStorage from "@react-native-async-storage/async-storage";

export type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const DEFAULT_GOALS: Goals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

const GOALS_KEY = "daily_goals";

export const getGoals = async (): Promise<Goals> => {
  try {
    const raw = await AsyncStorage.getItem(GOALS_KEY);
    return raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
};

export const saveGoals = async (goals: Goals): Promise<void> => {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};