import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSessionUser } from "@/lib/auth";
import { getMatchSuggestions } from "@/features/matching/services/matching.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  await requireAdminSessionUser();

  const { requestId } = await params;
  const suggestions = await getMatchSuggestions(requestId);

  return NextResponse.json(suggestions);
}
