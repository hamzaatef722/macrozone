import MealItem from "@/Components/MealItem";
import { useBrowseFoods } from "@/hooks/useBrowseFoods";
import { getMeals } from "@/storage/meals"; // غيّر الاسم لدالة جلب كل الوجبات عندك
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type SavedMeal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function BrowseMealScreen() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { foods, isLoading, isError, refetch, isSearching } =
    useBrowseFoods(query);

  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMeals().then(setSavedMeals);
    }, []),
  );

  const savedByName = useMemo(() => {
    const map = new Map<string, SavedMeal>();
    savedMeals.forEach((m) => map.set(m.name.trim().toLowerCase(), m));
    return map;
  }, [savedMeals]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Browse Meals</Text>
      </View>

      <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search meals..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel="Search meals"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => {
              setQuery("");
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <Text style={globalStyles.sectionTitle}>
        {isSearching ? "Search results" : "Popular meals"}
      </Text>

      {isLoading ? (
        <ActivityIndicator
          style={styles.center}
          size="large"
          color={colors.primary}
        />
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={40}
            color={colors.alert}
          />
          <Text style={styles.errorText}>
            Couldn't load meals. Check your connection and try again.
          </Text>
          <Pressable
            onPress={() => refetch()}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const saved = savedByName.get(item.name.trim().toLowerCase());

            return saved ? (
              <MealItem {...saved} source="saved" showSavedBadge />
            ) : (
              <MealItem {...item} source="api" />
            );
          }}
          ListEmptyComponent={
            <Text style={[globalStyles.empty, styles.empty]}>
              {isSearching
                ? `No meals found for "${query.trim()}". Try a simpler name, like "chicken" or "rice".`
                : "No meals to show right now."}
            </Text>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 16,
    minHeight: 48,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchBoxFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  center: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: { opacity: 0.6 },
  empty: {
    textAlign: "center",
    marginTop: 40,
    lineHeight: 20,
  },
});
