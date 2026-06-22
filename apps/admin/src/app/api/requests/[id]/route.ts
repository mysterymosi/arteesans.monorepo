import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSessionUser } from "@/lib/auth";
import { getServiceRequestDetail } from "@/features/requests/services/requests.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdminSessionUser();

  const { id } = await params;
  const request = await getServiceRequestDetail(id);

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json(request);
}
