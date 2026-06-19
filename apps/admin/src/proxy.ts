import type { Tables } from "@arteesans/supabase";
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isPublicPath) {
      return response;
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as Pick<Tables<"users">, "role" | "status"> | null;
  const isAdmin = profile?.role === "admin" && profile?.status === "active";

  if (!isAdmin) {
    await supabase.auth.signOut();
    if (isPublicPath) {
      return response;
    }
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url),
    );
  }

  if (isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
