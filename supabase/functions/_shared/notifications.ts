export function buildRequestReceivedPush(requestId: string) {
  return {
    title: "Request received",
    body: "We're finding an artisan for your service request.",
    data: { type: "request_received", entity_id: requestId },
  };
}

export function buildArtisanApplicationPush(profileId: string) {
  return {
    title: "New artisan application",
    body: "A new artisan application is ready for review.",
    data: { type: "artisan_application", entity_id: profileId },
  };
}

export function buildJobAcceptanceRequiredPush(requestId: string) {
  return {
    title: "Job ready to accept",
    body: "A customer confirmed your matched job. Accept or decline within 15 minutes.",
    data: { type: "job_acceptance_required", entity_id: requestId },
  };
}

export function buildJobStatusUpdatedPush(
  requestId: string,
  status: string,
) {
  return {
    title: "Job update",
    body: `Your job status is now ${status.replaceAll("_", " ")}.`,
    data: { type: "job_status_updated", entity_id: requestId, status },
  };
}

export function buildJobReassignedPush(requestId: string) {
  return {
    title: "Job needs rematch",
    body: "A service request was returned to matching and needs a new artisan.",
    data: { type: "job_reassigned", entity_id: requestId },
  };
}
