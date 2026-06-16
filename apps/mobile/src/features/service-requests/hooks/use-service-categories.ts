import { useQuery } from "@tanstack/react-query";
import { fetchServiceCategories } from "@/features/service-requests/services/categories.service";
import { queryKeys } from "@/lib/query-keys";

export function useServiceCategories() {
  return useQuery({
    queryKey: queryKeys.serviceCategories.all,
    queryFn: fetchServiceCategories,
  });
}
