import { useEffect, type ReactNode } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import type { PushNotificationData } from "@arteesans/shared";
import { routes, artisanJobRoute, customerBookingArtisansRoute, customerBookingRoute, customerBookingTrackingRoute } from "@/lib/routes";
import { useAuthProfile, useAuthSession } from "@/providers/auth-provider";
import { syncPushTokenForUser } from "@/features/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function isPushNotificationData(value: unknown): value is PushNotificationData {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.type === "string";
}

function routeFromPushData(
  data: PushNotificationData,
  role: "customer" | "artisan" | "admin" | null | undefined,
) {
  switch (data.type) {
    case "request_received":
    case "matching_started":
      router.push(routes.customer.bookings);
      return;
    case "artisan_matched":
    case "job_acceptance_required":
      if (role === "artisan") {
        if (data.entity_id) {
          router.push(artisanJobRoute(data.entity_id));
          return;
        }
        router.push(routes.artisan.home);
        return;
      }
      if (data.entity_id) {
        router.push(customerBookingRoute(data.entity_id));
        return;
      }
      router.push(routes.customer.bookings);
      return;
    case "job_status_updated":
      if (role === "artisan") {
        if (data.entity_id) {
          router.push(artisanJobRoute(data.entity_id));
          return;
        }
        router.push(routes.artisan.jobs);
        return;
      }
      if (data.entity_id) {
        router.push(customerBookingTrackingRoute(data.entity_id));
        return;
      }
      router.push(routes.customer.bookings);
      return;
    case "job_reassigned":
      return;
    case "request_interest_received":
      if (data.entity_id) {
        router.push(customerBookingArtisansRoute(data.entity_id));
        return;
      }
      router.push(routes.customer.bookings);
      return;
    case "artisan_selected":
      if (role === "artisan") {
        if (data.entity_id) {
          router.push(artisanJobRoute(data.entity_id));
          return;
        }
        router.push(routes.artisan.home);
        return;
      }
      if (data.entity_id) {
        router.push(customerBookingTrackingRoute(data.entity_id));
      }
      return;
    case "verification_approved":
    case "verification_rejected":
      router.push(routes.artisan.home);
      return;
    case "artisan_application":
      return;
    default:
      return;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { session } = useAuthSession();
  const { profile, isProfileLoading } = useAuthProfile();

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;
    void syncPushTokenForUser(userId).catch((error) => {
      // Permission denied, simulator, or transient network errors are non-fatal.
    });
  }, [session?.user.id]);

  useEffect(() => {
    if (isProfileLoading) return;

    const routeNotificationResponse = (
      response: Notifications.NotificationResponse,
    ) => {
      const rawData = response.notification.request.content.data;
      if (!isPushNotificationData(rawData)) return;
      routeFromPushData(rawData, profile?.role);
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(routeNotificationResponse);

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      routeNotificationResponse(response);
    });

    return () => {
      subscription.remove();
    };
  }, [isProfileLoading, profile?.role]);

  return children;
}
