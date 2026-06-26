import { View } from "react-native";
import { Text } from "@/components/ui";
import { getNextArtisanJobStatus, type RequestStatus } from "@arteesans/shared";
import { cn } from "@/lib/cn";

const STEPS = [
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
] as const satisfies readonly RequestStatus[];

const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  accepted: "Accepted",
  on_the_way: "On the way",
  arrived: "Arrived",
  in_progress: "In progress",
  completed: "Completed",
};

type JobStatusStepperProps = {
  status: RequestStatus;
};

export function JobStatusStepper({ status }: JobStatusStepperProps) {
  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);
  const nextStatus = getNextArtisanJobStatus(status);

  return (
    <View className="gap-4">
      {STEPS.map((step, index) => {
        const isComplete = currentIndex > index;
        const isCurrent = status === step;
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
                {STEP_LABELS[step]}
              </Text>
              {isCurrent && nextStatus ? (
                <Text className="text-xs text-ink-muted">
                  Next: {STEP_LABELS[nextStatus as (typeof STEPS)[number]]}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
