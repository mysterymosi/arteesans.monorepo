"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  rejectArtisanSchema,
  requestMoreInfoSchema,
  type ArtisanApplicationDetail,
  type RejectArtisanInput,
  type RequestMoreInfoInput,
} from "@arteesans/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveArtisan,
  useRejectArtisan,
  useRequestMoreInfo,
} from "@/features/artisans/hooks/use-artisan-applications";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function RejectArtisanForm({
  userId,
  isPending,
  onSubmit,
}: {
  userId: string;
  isPending: boolean;
  onSubmit: (input: RejectArtisanInput, onSuccess: () => void) => void;
}) {
  const form = useForm<RejectArtisanInput>({
    resolver: zodResolver(rejectArtisanSchema),
    defaultValues: {
      userId,
      reason: "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((input) =>
        onSubmit(input, () => form.reset({ userId, reason: "" })),
      )}
    >
      <FieldGroup>
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Rejection reason</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={3}
                placeholder="Rejection reason"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Button type="submit" disabled={isPending} variant="outline">
          {isPending ? <Spinner /> : "Reject"}
        </Button>
      </FieldGroup>
    </form>
  );
}

function RequestMoreInfoForm({
  userId,
  isPending,
  onSubmit,
}: {
  userId: string;
  isPending: boolean;
  onSubmit: (input: RequestMoreInfoInput, onSuccess: () => void) => void;
}) {
  const form = useForm<RequestMoreInfoInput>({
    resolver: zodResolver(requestMoreInfoSchema),
    defaultValues: {
      userId,
      note: "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((input) =>
        onSubmit(input, () => form.reset({ userId, note: "" })),
      )}
    >
      <FieldGroup>
        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>More information needed</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={3}
                placeholder="What additional information is needed?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Button type="submit" disabled={isPending} variant="outline">
          {isPending ? <Spinner /> : "Request more info"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function ArtisanApplicationDetailView({
  application,
}: {
  application: ArtisanApplicationDetail;
}) {
  const approveMutation = useApproveArtisan();
  const rejectMutation = useRejectArtisan();
  const moreInfoMutation = useRequestMoreInfo();
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
            <div>
              <Button
                type="button"
                disabled={approveMutation.isPending}
                onClick={() => approveMutation.mutate(application.userId)}
              >
                {approveMutation.isPending ? <Spinner /> : "Approve"}
              </Button>
            </div>
            <RejectArtisanForm
              userId={application.userId}
              isPending={rejectMutation.isPending}
              onSubmit={(input, onSuccess) =>
                rejectMutation.mutate(input, { onSuccess })
              }
            />
            <RequestMoreInfoForm
              userId={application.userId}
              isPending={moreInfoMutation.isPending}
              onSubmit={(input, onSuccess) =>
                moreInfoMutation.mutate(input, { onSuccess })
              }
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
