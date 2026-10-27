import { GoalsProvider } from "@/context/GoalsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoalsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="mealDetails/[id]"
            options={{ title: "Meal Details" }}
          />
        </Stack>
      </GoalsProvider>
    </QueryClientProvider>
  );
}
