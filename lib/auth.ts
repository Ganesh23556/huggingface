import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const ACCESS_COOKIE = "lms_access_token";
export const REFRESH_COOKIE = "lms_refresh_token";

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function requireAuth() {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken<{ userId: number; email: string; name: string }>(token);
    const user = { userId: payload.userId, email: payload.email, name: payload.name };
    console.log("USER:", user);
    return user;
  } catch {
    return null;
  }
}
