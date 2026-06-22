import { toast } from "sonner";
import type { ActionState } from "@arteesans/shared";

export function assertActionSuccess(result: ActionState) {
  if (result.error) {
    throw new Error(result.error);
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  return error instanceof Error ? error.message : fallback;
}

export function toastMutationError(error: unknown, fallback?: string) {
  toast.error(getErrorMessage(error, fallback));
}
