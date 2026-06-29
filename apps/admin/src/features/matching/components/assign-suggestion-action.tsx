"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { MatchSuggestion } from "@arteesans/shared";
import { CheckIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAssignArtisan } from "@/features/matching/hooks/use-matching";

export function AssignSuggestionAction({
  requestId,
  suggestion,
}: {
  requestId: string;
  suggestion: MatchSuggestion;
}) {
  const router = useRouter();
  const assignMutation = useAssignArtisan();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Admin override — assign artisan?"
      description={
        <>
          Manually assign <span className="font-medium">{suggestion.artisanName}</span> to
          this request. The request will move from matching to matched and bypass the
          marketplace flow.
        </>
      }
      confirmLabel="Assign (override)"
      isPending={assignMutation.isPending}
      onConfirm={() => {
        assignMutation.mutate(
          {
            requestId,
            artisanId: suggestion.artisanId,
          },
          {
            onSuccess: () => {
              router.push(`/requests/${requestId}`);
            },
          },
        );
      }}
      trigger={
        <Button size="sm" disabled={assignMutation.isPending}>
          <CheckIcon data-icon="inline-start" />
          Assign
        </Button>
      }
    />
  );
}
