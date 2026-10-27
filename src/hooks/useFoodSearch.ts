import { useQuery } from '@tanstack/react-query';
import { searchFoods } from '@/services/data';
import { useDebounce } from '@/hooks/useDebounce';

export function useFoodSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim());

  return useQuery({
    queryKey: ['foods', debouncedQuery.toLowerCase()],
    queryFn: () => searchFoods(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}