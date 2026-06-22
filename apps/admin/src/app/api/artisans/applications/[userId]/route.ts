import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSessionUser } from "@/lib/auth";
import { getArtisanApplicationDetail } from "@/features/artisans/services/artisans.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  await requireAdminSessionUser();

  const { userId } = await params;
  const application = await getArtisanApplicationDetail(userId);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}
