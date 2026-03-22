export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const user = await requireAuth();
  if (!user) return unauthorized();

  return NextResponse.json({ user });
}
