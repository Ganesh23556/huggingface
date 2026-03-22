export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies, REFRESH_COOKIE } from "@/lib/auth";
import { hashToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const refreshToken = cookies().get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          tokenHash: hashToken(refreshToken),
        },
      });
    } catch {
      // Ignore in demo mode when database is unavailable.
    }
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
