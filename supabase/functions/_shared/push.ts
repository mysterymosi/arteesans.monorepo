import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

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
): Promise<{ sent: number; removed: number }> {
  const { data: tokenRows, error } = await supabase
    .from("push_tokens")
    .select("id, expo_push_token")
    .in("user_id", input.user_ids);

  if (error) {
    throw new Error(error.message);
  }

  const tokens = (tokenRows ?? []) as PushTokenRow[];
  if (tokens.length === 0) {
    return { sent: 0, removed: 0 };
  }

  let sent = 0;
  let removed = 0;

  for (const batch of chunk(tokens, 100)) {
    const messages = batch.map((row) => ({
      to: row.expo_push_token,
      title: input.title,
      body: input.body,
      data: input.data ?? {},
      sound: "default",
    }));

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

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
      }
    }
  }

  return { sent, removed };
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
