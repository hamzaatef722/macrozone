import { getMealById, updateMeal } from "@/storage/meals";
import { colors, globalStyles } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditMealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  useEffect(() => {
    const load = async () => {
      const meal = await getMealById(id);
      if (!meal) {
        setNotFound(true);
      } else {
        setName(meal.name);
        setCalories(String(meal.calories));
        setProtein(String(meal.protein));
        setCarbs(String(meal.carbs));
        setFat(String(meal.fat));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleConfirmEdit = async () => {
    if (!name || !calories) {
      Alert.alert("Error", "Please enter a meal name and calories.");
      return;
    }

    await updateMeal(id, {
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  if (loading) return null;

  if (notFound) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Meal not found</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Edit Meal</Text>

      <TextInput
        style={styles.input}
        placeholder="Meal name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Protein (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={protein}
          onChangeText={setProtein}
        />
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Carbs (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={carbs}
          onChangeText={setCarbs}
        />
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Fat (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={fat}
          onChangeText={setFat}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmEdit}>
        <Text style={styles.buttonText}>Confirm Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
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
