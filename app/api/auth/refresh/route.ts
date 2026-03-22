export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { REFRESH_COOKIE, setAuthCookies } from "@/lib/auth";
import { hashToken, signAccessToken, signRefreshToken, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/http";

export async function POST() {
  const refreshToken = cookies().get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return unauthorized();

  try {
    const payload = await verifyToken<{ userId: number; email: string; name: string }>(refreshToken);
    try {
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          userId: payload.userId,
          tokenHash: hashToken(refreshToken),
          expiresAt: { gt: new Date() },
        },
      });

      if (!tokenRecord) return unauthorized();

      const newPayload = { userId: payload.userId, email: payload.email, name: payload.name };
      const newAccessToken = await signAccessToken(newPayload);
      const newRefreshToken = await signRefreshToken(newPayload);

      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      await prisma.refreshToken.create({
        data: {
          userId: payload.userId,
          tokenHash: hashToken(newRefreshToken),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const response = NextResponse.json({ ok: true });
      setAuthCookies(response, newAccessToken, newRefreshToken);
      return response;
    } catch {
      const newPayload = { userId: payload.userId, email: payload.email, name: payload.name };
      const newAccessToken = await signAccessToken(newPayload);
      const newRefreshToken = await signRefreshToken(newPayload);
      const response = NextResponse.json({ ok: true, mode: "demo" });
      setAuthCookies(response, newAccessToken, newRefreshToken);
      return response;
    }
  } catch {
    return unauthorized();
  }
}
