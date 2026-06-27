import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { queryKeys } from "@/lib/query-keys";
import { useAuthSession } from "@/providers/auth-provider";

/** Live updates for all customer-owned service_requests rows. Mount once per customer session. */
export function useCustomerRequestsListRealtime() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`customer-requests:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_requests",
          filter: `customer_id=eq.${userId}`,
        },
        (payload) => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.customerRequests.list(userId),
          });

          const updatedId =
            (payload.new as { id?: string } | null)?.id ??
            (payload.old as { id?: string } | null)?.id;

          if (updatedId) {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.customerRequests.detail(updatedId),
            });
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);
}
