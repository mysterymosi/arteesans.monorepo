import { NextResponse, type NextRequest } from "next/server";
import { artisanApplicationFiltersSchema } from "@arteesans/shared";
import { requireAdminSessionUser } from "@/lib/auth";
import { getArtisanApplications } from "@/features/artisans/services/artisans.service";

export async function GET(request: NextRequest) {
  await requireAdminSessionUser();

  const parsed = artisanApplicationFiltersSchema.safeParse({
    status: request.nextUrl.searchParams.get("status") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  return NextResponse.json(await getArtisanApplications(parsed.data.status));
}
