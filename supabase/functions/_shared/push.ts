import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_PUSH_TIMEOUT_MS = 10_000;

export type PushPayload = {
  user_ids: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

type ExpoPushTicket = {
  status: "ok" | "error";
  details?: { error?: string };
};

type PushTokenRow = {
  id: string;
  expo_push_token: string;
};

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function sendExpoPushBatch(messages: unknown[]): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EXPO_PUSH_TIMEOUT_MS);

  try {
    return await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Expo push request timed out after ${EXPO_PUSH_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createServiceSupabase(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isServiceRoleRequest(req: Request): boolean {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.slice("Bearer ".length);
  return token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}

export async function sendPushToUsers(
  supabase: SupabaseClient,
  input: PushPayload,
): Promise<{ sent: number; removed: number; failed: number; failures: string[] }> {
  const { data: tokenRows, error } = await supabase
    .from("push_tokens")
    .select("id, expo_push_token")
    .in("user_id", input.user_ids);

  if (error) {
    throw new Error(error.message);
  }

  const tokens = (tokenRows ?? []) as PushTokenRow[];
  if (tokens.length === 0) {
    return { sent: 0, removed: 0, failed: 0, failures: [] };
  }

  let sent = 0;
  let removed = 0;
  let failed = 0;
  const failures = new Set<string>();

  for (const batch of chunk(tokens, 100)) {
    const messages = batch.map((row) => ({
      to: row.expo_push_token,
      title: input.title,
      body: input.body,
      data: input.data ?? {},
      sound: "default",
    }));

    const response = await sendExpoPushBatch(messages);

    if (!response.ok) {
      throw new Error(
        `Expo push request failed with status ${response.status}`,
      );
    }

    const tickets = (await response.json()) as { data?: ExpoPushTicket[] };
    const results = tickets.data ?? [];

    for (let index = 0; index < results.length; index += 1) {
      const ticket = results[index];
      const tokenRow = batch[index];
      if (!ticket || !tokenRow) continue;

      if (ticket.status === "ok") {
        sent += 1;
        continue;
      }

      if (ticket.details?.error === "DeviceNotRegistered") {
        const { error: deleteError } = await supabase
          .from("push_tokens")
          .delete()
          .eq("id", tokenRow.id);

        if (!deleteError) {
          removed += 1;
        }
        continue;
      }

      failed += 1;
      failures.add(ticket.details?.error ?? "unknown");
    }
  }

  return { sent, removed, failed, failures: [...failures] };
}

export async function fetchActiveAdminUserIds(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin")
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.id);
}
