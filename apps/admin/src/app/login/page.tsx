import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError =
    params.error === "unauthorized"
      ? "This account does not have admin access"
      : undefined;

  return (
    <div className="grid min-h-svh w-full place-items-center bg-muted p-6 md:p-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border bg-card md:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="hidden border-r bg-accent/70 p-8 md:flex md:flex-col md:justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">
              Arteesans Admin
            </div>
            <h1 className="mt-6 max-w-sm text-2xl font-semibold leading-tight">
              Operations desk for requests, artisans, and service categories.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Review work queues, verify applications, and keep marketplace
              operations moving from one focused surface.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Internal access only
          </div>
        </div>
        <div className="p-4 md:p-6">
        <LoginForm initialError={initialError} />
        </div>
      </div>
    </div>
  );
}
