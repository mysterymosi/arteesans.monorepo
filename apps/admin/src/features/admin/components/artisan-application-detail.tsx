"use client";

import { useActionState } from "react";
import type { ArtisanApplicationDetail } from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  approveArtisanAction,
  rejectArtisan,
  requestMoreInfo,
} from "@/features/admin/actions/artisans";
import type { ActionState } from "@arteesans/shared";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ActionForm({
  action,
  userId,
  submitLabel,
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  userId: string;
  submitLabel: string;
  children?: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      {children}
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={isPending} variant="outline">
        {submitLabel}
      </Button>
    </form>
  );
}

export function ArtisanApplicationDetailView({
  application,
}: {
  application: ArtisanApplicationDetail;
}) {
  const canReview =
    application.verificationStatus === "pending" ||
    application.verificationStatus === "more_info";

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{application.verificationStatus}</Badge>
        <span className="text-sm text-muted-foreground">
          Submitted {formatDate(application.submittedAt)}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{application.name}</CardTitle>
            <CardDescription>{application.primarySkill ?? "No primary skill"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{application.email ?? "No email"}</div>
            <div>{application.phone ?? "No phone"}</div>
            <div>{application.state ?? "No state"}</div>
            <div>{application.address ?? "No address"}</div>
            <div>{application.availability ?? "No availability set"}</div>
            <div>{application.yearsExperience ?? "No experience listed"}</div>
            {application.bio ? <p>{application.bio}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded.</p>
            ) : (
              application.documents.map((doc) => (
                <div key={doc.id} className="rounded-lg border p-3 text-sm">
                  <div className="font-medium">{doc.docType}</div>
                  <div className="text-muted-foreground">{doc.fileName ?? "Document"}</div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-primary hover:underline"
                    >
                      View document
                    </a>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {canReview ? (
        <Card>
          <CardHeader>
            <CardTitle>Review actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <form action={approveArtisanAction}>
              <input type="hidden" name="userId" value={application.userId} />
              <Button type="submit">Approve</Button>
            </form>

            <ActionForm action={rejectArtisan} userId={application.userId} submitLabel="Reject">
              <Textarea
                name="reason"
                placeholder="Rejection reason"
                required
                rows={3}
              />
            </ActionForm>

            <ActionForm
              action={requestMoreInfo}
              userId={application.userId}
              submitLabel="Request more info"
            >
              <Textarea
                name="note"
                placeholder="What additional information is needed?"
                required
                rows={3}
              />
            </ActionForm>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
