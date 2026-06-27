import { View } from "react-native";
import { Text } from "@/components/ui";
import { ARTISAN_JOB_STATUS_LABELS, type RequestStatus } from "@arteesans/shared";
import { cn } from "@/lib/cn";

const STEPS = [
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
] as const satisfies readonly RequestStatus[];

type CustomerJobStatusStepperProps = {
  status: RequestStatus;
  awaitingCustomerConfirmation?: boolean;
};

export function CustomerJobStatusStepper({
  status,
  awaitingCustomerConfirmation = false,
}: CustomerJobStatusStepperProps) {
  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <View className="gap-4">
      {STEPS.map((step, index) => {
        const isComplete =
          currentIndex > index || (status === "completed" && awaitingCustomerConfirmation);
        const isCurrent = status === step && !awaitingCustomerConfirmation;
        const isUpcoming = currentIndex < index;

        return (
          <View key={step} className="flex-row items-center gap-3">
            <View
              className={cn(
                "h-8 w-8 items-center justify-center rounded-full border",
                isComplete && "border-success bg-success-subtle",
                isCurrent && "border-primary bg-primary-subtle",
                isUpcoming && "border-line bg-surface-muted",
              )}
            >
              <Text
                className={cn(
                  "font-semibold text-xs",
                  isComplete && "text-success",
                  isCurrent && "text-primary",
                  isUpcoming && "text-ink-muted",
                )}
              >
                {index + 1}
              </Text>
            </View>
            <View className="flex-1">
              <Text
                className={cn(
                  "font-medium text-sm",
                  isCurrent ? "text-ink" : "text-ink-secondary",
                )}
              >
                {ARTISAN_JOB_STATUS_LABELS[step]}
              </Text>
              {isCurrent ? (
                <Text className="text-xs text-ink-muted">In progress</Text>
              ) : null}
            </View>
          </View>
        );
      })}
      {awaitingCustomerConfirmation ? (
        <View className="rounded-2xl border border-primary/20 bg-primary-subtle px-4 py-3">
          <Text className="font-medium text-sm text-primary">Awaiting your confirmation</Text>
          <Text className="mt-1 text-sm text-ink-secondary">
            The artisan marked this job complete. Confirm when you are satisfied with the work.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
