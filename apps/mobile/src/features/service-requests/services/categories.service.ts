import { supabase } from "@/lib/supabase";
import type { ServiceCategory } from "@/features/service-requests/types/service-request";

export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
