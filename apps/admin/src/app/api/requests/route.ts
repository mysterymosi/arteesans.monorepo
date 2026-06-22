import { NextResponse, type NextRequest } from "next/server";
import { requestFiltersSchema } from "@arteesans/shared";
import { normalizePagination } from "@/lib/pagination";
import { requireAdminSessionUser } from "@/lib/auth";
import { getServiceRequests } from "@/features/requests/services/requests.service";

export async function GET(request: NextRequest) {
  await requireAdminSessionUser();

  const searchParams = request.nextUrl.searchParams;
  const pagination = normalizePagination({
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
  });
  const parsed = requestFiltersSchema.safeParse({
    status: searchParams.get("status") || undefined,
    urgency: searchParams.get("urgency") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  return NextResponse.json(await getServiceRequests(parsed.data, pagination));
}
