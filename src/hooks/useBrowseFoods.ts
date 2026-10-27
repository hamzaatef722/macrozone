import { useDebounce } from "@/hooks/useDebounce";
import { getPopularFoods, searchFoods } from "@/services/data";
import { useQuery } from "@tanstack/react-query";

export function useBrowseFoods(query: string) {
  const debouncedQuery = useDebounce(query.trim());
  const isSearching = debouncedQuery.length >= 2;

  const popular = useQuery({
    queryKey: ["foods", "popular"],
    queryFn: getPopularFoods,
    staleTime: 1000 * 60 * 60,
  });

  const search = useQuery({
    queryKey: ["foods", debouncedQuery.toLowerCase()],
    queryFn: () => searchFoods(debouncedQuery),
    enabled: isSearching,
    staleTime: 1000 * 60 * 10,
  });

  const active = isSearching ? search : popular;

  return {
    foods: active.data ?? [],
    isLoading: active.isLoading,
    isError: active.isError,
    refetch: active.refetch,
    isSearching,
  };
}
