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
import { CategoryIcon } from "@/components/category-icon";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetailBackButton } from "@/components/detail-back-button";
import { VerificationStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
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
import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  MapPinIcon,
} from "lucide-react";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 text-sm">
      <dt className="text-muted-foreground font-medium text-[13px]">{label}</dt>
      <dd className="min-w-0 font-medium">{value}</dd>
    </div>
  );
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
    defaultValues: { userId, reason: "" },
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
                placeholder="Explain why this application is being rejected"
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
    defaultValues: { userId, note: "" },
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
              <FieldLabel htmlFor={field.name}>Information needed</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={3}
                placeholder="Tell the applicant what to provide"
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
    <div className="flex flex-col gap-5 px-4 lg:px-6">
      <DetailBackButton href="/artisans/applications">
        Applications
      </DetailBackButton>
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-muted text-xl font-semibold">
              {application.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold">{application.name}</h1>
                <VerificationStatusBadge status={application.verificationStatus} />
              </div>
              <div className="mt-1 flex flex-wrap gap-5 text-[13px] font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CategoryIcon
                    categoryName={application.primarySkill}
                    className="size-4"
                  />
                  {application.primarySkill ?? "No skill"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4" />
                  {application.state ?? "No state"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-4" />
                  Submitted {formatDate(application.submittedAt)}
                </span>
              </div>
            </div>
          </div>
          {canReview ? (
            <ConfirmDialog
              trigger={
                <Button
                  type="button"
                  disabled={approveMutation.isPending}
                  className="px-9"
                >
                  Approve
                </Button>
              }
              title="Approve artisan?"
              description={`This will approve ${application.name} and allow the artisan profile to move forward.`}
              confirmLabel="Approve"
              isPending={approveMutation.isPending}
              onConfirm={() => approveMutation.mutate(application.userId)}
            />
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Panel title="Profile">
            <dl className="grid gap-4 md:grid-cols-2">
              <Row label="Full name" value={application.name} />
              <Row label="Email" value={application.email ?? "No email"} />
              <Row label="Phone" value={application.phone ?? "No phone"} />
              <Row label="State" value={application.state ?? "No state"} />
              <Row label="Address" value={application.address ?? "No address"} />
              <Row
                label="Availability"
                value={application.availability ?? "No availability set"}
              />
              <Row
                label="Experience"
                value={application.yearsExperience ?? "No experience listed"}
              />
              <Row
                label="Bio"
                value={application.bio ?? "No bio provided"}
              />
            </dl>
          </Panel>

          <Panel title="Verification documents">
            {application.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents uploaded. Request more information before approving.
              </p>
            ) : (
              <div className="grid gap-3">
                {application.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-md border p-3 text-sm hover:bg-accent"
                  >
                    <FileTextIcon className="size-5 text-primary" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {doc.fileName ?? doc.docType}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {doc.docType}
                      </div>
                    </div>
                    <DownloadIcon className="ml-auto size-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <aside className="flex flex-col gap-5">
          <Panel title="Decision">
            <div className="grid gap-5">
              {canReview ? (
                <>
                  <ConfirmDialog
                    trigger={
                      <Button
                        type="button"
                        disabled={approveMutation.isPending}
                        className="w-full"
                      >
                        Approve artisan
                      </Button>
                    }
                    title="Approve artisan?"
                    description={`This will approve ${application.name} and allow the artisan profile to move forward.`}
                    confirmLabel="Approve artisan"
                    isPending={approveMutation.isPending}
                    onConfirm={() => approveMutation.mutate(application.userId)}
                  />
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
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This application is no longer pending review.
                </p>
              )}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
