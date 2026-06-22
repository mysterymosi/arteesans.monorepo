import { NextResponse } from "next/server";
import { requireAdminSessionUser } from "@/lib/auth";
import { getDashboardStats } from "@/features/dashboard/services/dashboard.service";

export async function GET() {
  await requireAdminSessionUser();
  return NextResponse.json(await getDashboardStats());
}
