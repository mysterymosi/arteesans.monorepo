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
