import MealItem from "@/Components/MealItem";
import { useGoals } from "@/context/GoalsContext";
import { clearAllMeals, getMeals, Meal } from "@/storage/meals";
import { Goals } from "@/storage/profile";
import { colors, globalStyles } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GOAL_FIELDS: { key: keyof Goals; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "cal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

export default function ProfileScreen() {
  const { goals, setGoals } = useGoals();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [draft, setDraft] = useState<Record<keyof Goals, string>>({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  // بيملا الـ inputs بالقيم الحالية (ولما تتحمّل من الـ storage)
  useEffect(() => {
    setDraft({
      calories: String(goals.calories),
      protein: String(goals.protein),
      carbs: String(goals.carbs),
      fat: String(goals.fat),
    });
  }, [goals]);

  const loadMeals = async () => {
    setMeals(await getMeals());
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, []),
  );

  const handleSaveGoals = async () => {
    const parsed: Goals = {
      calories: Math.round(Number(draft.calories)),
      protein: Math.round(Number(draft.protein)),
      carbs: Math.round(Number(draft.carbs)),
      fat: Math.round(Number(draft.fat)),
    };

    if (Object.values(parsed).some((v) => !Number.isFinite(v) || v <= 0)) {
      Alert.alert("Error", "Please enter valid goals greater than 0.");
      return;
    }

    await setGoals(parsed);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved", "Your daily goals have been updated.");
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Meals",
      "Are you sure you want to delete all meals? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            await clearAllMeals();
            loadMeals();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={globalStyles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Profile</Text>
      </View>

      <Text style={styles.sectionTitle}>Daily Goals</Text>
      <View style={styles.goalsGrid}>
        {GOAL_FIELDS.map(({ key, label, unit }) => (
          <View key={key} style={styles.goalField}>
            <Text style={styles.goalLabel}>
              {label} ({unit})
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={draft[key]}
              onChangeText={(text) =>
                setDraft((prev) => ({ ...prev, [key]: text }))
              }
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoals}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>

      <View style={styles.mealsHeader}>
        <Text style={styles.sectionTitle}>My Meals</Text>
        {meals.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {meals.length === 0 ? (
        <Text style={globalStyles.empty}>No meals logged yet.</Text>
      ) : (
        meals.map((meal) => (
          <MealItem
            key={meal.id}
            id={meal.id}
            name={meal.name}
            calories={meal.calories}
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  goalField: {
    width: "47%",
  },
  goalLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  mealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearButton: {
    color: "red",
    fontSize: 16,
    marginTop: 24,
  },
});
