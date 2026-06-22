import { NextResponse, type NextRequest } from "next/server";
import { artisanApplicationFiltersSchema } from "@arteesans/shared";
import { normalizePagination } from "@/lib/pagination";
import { requireAdminSessionUser } from "@/lib/auth";
import { getArtisanApplications } from "@/features/artisans/services/artisans.service";

export async function GET(request: NextRequest) {
  await requireAdminSessionUser();
  const pagination = normalizePagination({
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
  });

  const parsed = artisanApplicationFiltersSchema.safeParse({
    status: request.nextUrl.searchParams.get("status") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  return NextResponse.json(
    await getArtisanApplications(parsed.data.status, pagination),
  );
}
