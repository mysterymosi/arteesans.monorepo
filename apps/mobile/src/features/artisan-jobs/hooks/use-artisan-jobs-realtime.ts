import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useAuthSession } from "@/providers/auth-provider";

/** Live updates for service_requests assigned to the artisan. Mount once per artisan session. */
export function useArtisanJobsRealtime() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`artisan-jobs:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_requests",
          filter: `assigned_artisan_id=eq.${userId}`,
        },
        (payload) => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.artisanJobs.list(userId),
          });

          const updatedId =
            (payload.new as { id?: string } | null)?.id ??
            (payload.old as { id?: string } | null)?.id;

          if (updatedId) {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.artisanJobs.detail(updatedId),
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
