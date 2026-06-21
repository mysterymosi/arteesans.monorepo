import { DashboardPage } from "@/components/dashboard-shell";
import { CategoriesManager, getCategories } from "@/features/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <DashboardPage title="Service categories">
      <CategoriesManager categories={categories} />
    </DashboardPage>
  );
}
