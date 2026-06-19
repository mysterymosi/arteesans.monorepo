import { DashboardPage } from "@/components/dashboard-shell";
import { CategoriesManager } from "@/features/admin/components/categories-manager";
import { getCategories } from "@/features/admin/queries";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <DashboardPage title="Service categories">
      <CategoriesManager categories={categories} />
    </DashboardPage>
  );
}
