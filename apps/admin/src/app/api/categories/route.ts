import { NextResponse } from "next/server";
import { requireAdminSessionUser } from "@/lib/auth";
import { getCategories } from "@/features/categories/services/categories.service";

export async function GET() {
  await requireAdminSessionUser();
  return NextResponse.json(await getCategories());
}
