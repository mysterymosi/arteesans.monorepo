import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MenuButton } from "@/components/navigation";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/cn";
import type { VerificationStatus } from "@arteesans/shared";
import { colors } from "@/theme";

type ArtisanHomeDashboardProps = {
  firstName: string;
  city?: string | null;
  verificationStatus: VerificationStatus;
};

function StatCard({
  value,
  label,
  icon,
  iconBgClassName,
}: {
  value: string;
  label: string;
  icon: number;
  iconBgClassName: string;
}) {
  return (
    <View className="min-w-[87px] flex-1 rounded-xl border border-line/40 bg-surface p-2.5 shadow-sm">
      <View className="flex-row items-start justify-between gap-2">
        <View className="gap-1">
          <Text className="font-semibold text-sm text-ink">{value}</Text>
          <Text className="text-xs text-ink-secondary">{label}</Text>
        </View>
        <View className={cn("rounded-full p-1.5", iconBgClassName)}>
          <Image source={icon} style={{ width: 16, height: 16 }} contentFit="contain" />
        </View>
      </View>
    </View>
  );
}

/** Artisan home dashboard — Figma 36:2476 with approval-pending gate per Phase 1.4 */
export function ArtisanHomeDashboard({
  firstName,
  city,
  verificationStatus,
}: ArtisanHomeDashboardProps) {
  const isApproved = verificationStatus === "approved";
  const greeting = firstName ? `Hello ${firstName},` : "Hello,";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-8 px-5 pb-10 pt-4"
      className="flex-1 bg-surface"
    >
      <View className="flex-row items-center justify-between">
        <MenuButton />
        <View className="flex-row items-center gap-3">
          <Image source={icons.notificationNewDot} style={{ width: 16, height: 16 }} contentFit="contain" />
          <View className="h-[30px] w-[30px] rounded-full bg-surface-muted" />
        </View>
      </View>

      {!isApproved ? (
        <View className="rounded-2xl border border-warning/30 bg-warning-muted px-4 py-3">
          <Text className="font-medium text-sm text-ink">Application under review</Text>
          <Text className="mt-1 text-sm text-ink-secondary">
            Your documents are pending admin approval. You will be notified once verified and can
            start receiving jobs.
          </Text>
        </View>
      ) : null}

      <View className="gap-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-medium text-2xl text-ink">{greeting}</Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Image source={icons.location} style={{ width: 20, height: 20 }} contentFit="contain" />
              <Text className="text-base text-ink-secondary">{city ?? "Location"}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 rounded-full border border-success/40 bg-success-subtle px-2.5 py-1">
            <View className="h-3 w-3 rounded-full bg-success" />
            <Text className="font-medium text-base text-success">
              {isApproved ? "Available" : "Pending"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <StatCard
            value="₦10,000"
            label="Today's earnings"
            icon={icons.orderApprove}
            iconBgClassName="bg-success-subtle"
          />
          <StatCard
            value="3"
            label="Jobs done"
            icon={icons.categories.repair}
            iconBgClassName="bg-primary-subtle"
          />
          <StatCard
            value="4.8"
            label="Rating"
            icon={icons.categories.hammer}
            iconBgClassName="bg-warning-subtle"
          />
        </View>
      </View>

      {isApproved ? (
        <>
          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-base text-ink">New Requests</Text>
              <Text className="font-light text-sm text-ink-secondary">Just now</Text>
            </View>

            <View className="gap-3 rounded-[20px] bg-surface-muted p-5 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <View className="rounded-full bg-danger-subtle px-2.5 py-1">
                    <Text className="font-medium text-sm text-danger">Emergency</Text>
                  </View>
                  <Text className="text-base text-ink-secondary">Plumbing</Text>
                </View>
                <Text className="font-semibold text-base text-primary">₦3,000</Text>
              </View>
              <View>
                <Text className="font-medium text-sm text-ink">Folake Adesina</Text>
                <Text className="text-xs text-ink-secondary">Lekki, Lagos</Text>
              </View>
              <Text className="text-xs text-ink">
                Kitchen sink is leaking badly under the cabinet. Water is pooling on...
              </Text>
              <View className="flex-row items-center gap-3">
                <LinearGradient
                  colors={[...colors.primaryGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, borderRadius: 4 }}
                >
                  <View className="items-center py-1.5">
                    <Text className="font-medium text-xs text-white">View details</Text>
                  </View>
                </LinearGradient>
                <View className="h-6 w-6 items-center justify-center rounded bg-surface">
                  <Image source={icons.xMark} style={{ width: 12, height: 12 }} contentFit="contain" />
                </View>
              </View>
            </View>
          </View>

          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-base text-ink">Recent Jobs</Text>
              <Text className="font-semibold text-sm text-primary underline">See All</Text>
            </View>

            <JobRow
              title="Plumbing"
              subtitle="Kitchen sink"
              status="In Process"
              statusBgClassName="bg-warning-subtle"
              statusTextClassName="text-warning"
              icon={icons.categories.water}
            />
            <JobRow
              title="Electrical"
              subtitle="Electronics"
              status="Delivered"
              statusBgClassName="bg-success-subtle"
              statusTextClassName="text-success"
              icon={icons.categories.electricBolt}
            />
            <JobRow
              title="Driving"
              subtitle="Chauffeur"
              status="Cancelled"
              statusBgClassName="bg-danger-subtle"
              statusTextClassName="text-danger"
              icon={icons.categories.steering}
            />
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

function JobRow({
  title,
  subtitle,
  status,
  statusBgClassName,
  statusTextClassName,
  icon,
}: {
  title: string;
  subtitle: string;
  status: string;
  statusBgClassName: string;
  statusTextClassName: string;
  icon: number;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-line bg-surface-muted p-2.5 shadow-sm">
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-muted">
          <Image source={icon} style={{ width: 14, height: 14 }} contentFit="contain" />
        </View>
        <View>
          <Text className="font-medium text-sm text-ink">{title}</Text>
          <Text className="text-[10px] text-ink-secondary">{subtitle}</Text>
        </View>
      </View>
      <View className={cn("rounded-full px-2.5 py-1", statusBgClassName)}>
        <Text className={cn("font-semibold text-xs", statusTextClassName)}>{status}</Text>
      </View>
    </View>
  );
}
