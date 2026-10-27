const API_KEY = process.env.EXPO_PUBLIC_USDA_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export type FoodResult = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const NUTRIENT_ID = { calories: 1008, protein: 1003, fat: 1004, carbs: 1005 };

type UsdaNutrient = { nutrientId: number; value?: number };
type UsdaFood = {
  fdcId: number;
  description: string;
  foodNutrients: UsdaNutrient[];
};

const getNutrient = (nutrients: UsdaNutrient[], id: number) =>
  Math.round(nutrients.find((n) => n.nutrientId === id)?.value ?? 0);

// الـ API بيرجّع fdcId كـ number، واحنا بنحوله لـ id كـ string
const mapFood = (f: UsdaFood): FoodResult => ({
  id: String(f.fdcId),
  name: f.description,
  calories: getNutrient(f.foodNutrients, NUTRIENT_ID.calories),
  protein: getNutrient(f.foodNutrients, NUTRIENT_ID.protein),
  carbs: getNutrient(f.foodNutrients, NUTRIENT_ID.carbs),
  fat: getNutrient(f.foodNutrients, NUTRIENT_ID.fat),
});

export async function searchFoods(
  query: string,
  pageSize = 25,
): Promise<FoodResult[]> {
  if (!API_KEY) throw new Error("Missing EXPO_PUBLIC_USDA_KEY in .env");

  const url =
    `${BASE_URL}/foods/search?query=${encodeURIComponent(query)}` +
    `&dataType=Foundation,SR%20Legacy&pageSize=${pageSize}&api_key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const data: { foods: UsdaFood[] } = await res.json();
  return data.foods.map(mapFood);
}

const POPULAR_QUERIES = [
  "chicken breast",
  "egg",
  "rice",
  "banana",
  "salmon",
  "oats",
  "avocado",
  "bread",
];

export async function getPopularFoods(): Promise<FoodResult[]> {
  const results = await Promise.all(
    POPULAR_QUERIES.map((q) => searchFoods(q, 2)),
  );

  // flat + شيل أي تكرار
  const unique = new Map<string, FoodResult>();
  results.flat().forEach((f) => unique.set(f.id, f));
  return [...unique.values()];
}
