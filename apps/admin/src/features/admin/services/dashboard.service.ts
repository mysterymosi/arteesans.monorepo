import type { DashboardStats } from "@arteesans/shared";
import { createServiceClient } from "@/lib/supabase/server";

export async function getDashboardStats(): Promise<DashboardStats> {
  const service = createServiceClient();

  const [matchingResult, pendingResult, activeResult] = await Promise.all([
    service
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "matching"),
    service
      .from("artisan_profiles")
      .select("id", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    service
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .in("status", [
        "matched",
        "confirmed",
        "accepted",
        "on_the_way",
        "arrived",
        "in_progress",
      ]),
  ]);

  return {
    matchingRequests: matchingResult.count ?? 0,
    pendingArtisans: pendingResult.count ?? 0,
    activeJobs: activeResult.count ?? 0,
  };
}
