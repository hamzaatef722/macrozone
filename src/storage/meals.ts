import AsyncStorage from "@react-native-async-storage/async-storage";

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};

const MEALS_KEY = "meals";

export const getMeals = async (): Promise<Meal[]> => {
  const data = await AsyncStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addMeal = async (
  meal: Omit<Meal, "id" | "createdAt">,
): Promise<Meal> => {
  const meals = await getMeals();
  const newMeal: Meal = {
    ...meal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify([newMeal, ...meals]));
  return newMeal;
};

export const deleteMeal = async (id: string): Promise<void> => {
  const meals = await getMeals();
  const filtered = meals.filter((meal) => meal.id !== id);
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(filtered));
};

export const clearAllMeals = async (): Promise<void> => {
  await AsyncStorage.removeItem(MEALS_KEY);
};

export async function getMealById(id: string) {
  const raw = await AsyncStorage.getItem(MEALS_KEY);
  const meals = raw ? JSON.parse(raw) : [];
  return meals.find((m: { id: string }) => m.id === id) ?? null;
}

export async function updateMeal(
  id: string,
  updates: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  },
) {
  const raw = await AsyncStorage.getItem(MEALS_KEY);
  const meals = raw ? JSON.parse(raw) : [];
  const updated = meals.map((m: { id: string }) =>
    m.id === id ? { ...m, ...updates } : m,
  );
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(updated));
}
