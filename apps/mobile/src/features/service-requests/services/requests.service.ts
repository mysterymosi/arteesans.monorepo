import { supabase } from "@/lib/supabase";
import type { CustomerServiceRequest } from "@/features/service-requests/types/service-request";

const REQUEST_SELECT = `
  *,
  category:service_categories(id, name, slug),
  artisan:users!service_requests_assigned_artisan_id_fkey(id, first_name, last_name, profile_photo_url)
`;

export async function fetchCustomerRequests(): Promise<CustomerServiceRequest[]> {
  const { data, error } = await supabase
    .from("service_requests")
    .select(REQUEST_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CustomerServiceRequest[];
}

export async function fetchCustomerRequest(
  requestId: string,
): Promise<CustomerServiceRequest | null> {
  const { data, error } = await supabase
    .from("service_requests")
    .select(REQUEST_SELECT)
    .eq("id", requestId)
    .maybeSingle();

  if (error) throw error;
  return (data as CustomerServiceRequest | null) ?? null;
}
