export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { badRequest } from "@/lib/http";
import bcrypt from "bcryptjs";
import { setAuthCookies } from "@/lib/auth";
import { hashToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { findDemoUserByEmail } from "@/lib/demo-data";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid credentials");

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) return badRequest("Invalid credentials");

    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) return badRequest("Invalid credentials");

    const payload = { userId: user.id, email: user.email, name: user.name };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({ user: payload });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch {
    const demoUser = findDemoUserByEmail(parsed.data.email);
    if (!demoUser || demoUser.password !== parsed.data.password) {
      return badRequest("Invalid credentials");
    }

    const payload = { userId: demoUser.id, email: demoUser.email, name: demoUser.name };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);
    const response = NextResponse.json({
      user: payload,
      mode: "demo",
    });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  }
}
