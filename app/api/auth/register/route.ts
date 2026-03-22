export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { badRequest } from "@/lib/http";
import bcrypt from "bcryptjs";
import { setAuthCookies } from "@/lib/auth";
import { hashToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { createDemoUser } from "@/lib/demo-data";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.flatten().formErrors.join(", ") || "Invalid input");

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return badRequest("Email already in use");

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        name: parsed.data.name,
      },
    });

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

    const response = NextResponse.json({ user: payload }, { status: 201 });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch {
    const user = createDemoUser({
      email: parsed.data.email,
      name: parsed.data.name,
      password: parsed.data.password,
    });
    if (!user) return badRequest("Email already in use");

    const payload = { userId: user.id, email: user.email, name: user.name };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);
    const response = NextResponse.json({ user: payload, mode: "demo" }, { status: 201 });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  }
}
