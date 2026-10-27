import MealItem from "@/Components/MealItem";
import { clearAllMeals, getMeals, Meal } from "@/storage/meals";
import { globalStyles } from "@/styles/global";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AllMealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
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

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, []),
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>All Meals</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 30 }}>
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
              // onDelete={loadMeals}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = {
  clearButton: {
    color: "red",
    fontSize: 16,
  },
};
