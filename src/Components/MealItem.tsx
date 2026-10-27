import { colors } from "@/styles/global";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MealItemProps = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source?: "saved" | "api";
  showSavedBadge?: boolean;
};

export default function MealItem({
  id,
  name,
  calories,
  protein,
  carbs,
  fat,
  source = "saved",
  showSavedBadge = false,
}: MealItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (source === "api") {
      router.push({
        pathname: "/mealDetails/[id]",
        params: {
          id,
          source: "api",
          name,
          calories: String(calories),
          protein: String(protein),
          carbs: String(carbs),
          fat: String(fat),
        },
      });
    } else {
      router.push({
        pathname: "/mealDetails/[id]",
        params: { id, source: "saved" },
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.titleRow}>
        <Text style={styles.name}>{name}</Text>
        {showSavedBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Saved</Text>
          </View>
        )}
      </View>
      <Text style={styles.macros}>
        {calories} cal • {protein}g P • {carbs}g C • {fat}g F
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  macros: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});