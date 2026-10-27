import { addMeal, deleteMeal, getMealById } from "@/storage/meals";
import { colors, globalStyles } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function MealDetailsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    source?: "saved" | "api";
    name?: string;
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  }>();

  const isSaved = params.source !== "api";

  const [meal, setMeal] = useState<Meal | null>(
    isSaved
      ? null
      : {
          name: params.name ?? "",
          calories: Number(params.calories) || 0,
          protein: Number(params.protein) || 0,
          carbs: Number(params.carbs) || 0,
          fat: Number(params.fat) || 0,
        },
  );
  const [loading, setLoading] = useState(isSaved);
  const [adding, setAdding] = useState(false);

  // بيعيد تحميل الوجبة كل ما الصفحة ترجع تاخد focus (بعد الـ edit مثلاً)
  useFocusEffect(
    useCallback(() => {
      if (!isSaved) return;
      let active = true;

      (async () => {
        const found = await getMealById(params.id);
        if (!active) return;
        setMeal(found);
        setLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [isSaved, params.id]),
  );

  const handleAdd = async () => {
    if (!meal || adding) return;
    setAdding(true);

    await addMeal({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Meal added to your meals!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete "${meal?.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMeal(params.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ],
    );
  };

  if (loading) return null;

  if (!meal) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Meal not found</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{meal.name}</Text>
      {!isSaved && <Text style={styles.hint}>Values per 100g</Text>}

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>{meal.calories} cal</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>{meal.protein} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Carbs</Text>
          <Text style={styles.value}>{meal.carbs} g</Text>
        </View>
        <View style={[styles.row, styles.lastRow]}>
          <Text style={styles.label}>Fat</Text>
          <Text style={styles.value}>{meal.fat} g</Text>
        </View>
      </View>

      {isSaved ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/editMeal/[id]",
                params: { id: params.id },
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.button, adding && styles.disabled]}
          onPress={handleAdd}
          disabled={adding}
        >
          <Text style={styles.buttonText}>Add to your meals</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textSecondary,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#E53935",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButtonText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "bold",
  },
});
