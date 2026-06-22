import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardPage } from "@/components/dashboard-shell";
import { createQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { CategoriesManager, getCategories } from "@/features/categories";

export default async function CategoriesPage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: getCategories,
  });

  return (
    <DashboardPage title="Service categories">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoriesManager />
      </HydrationBoundary>
    </DashboardPage>
  );
}
