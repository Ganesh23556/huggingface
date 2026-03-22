import { randomBytes, createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export type AccessPayload = { userId: number; email: string; name: string };

export async function signAccessToken(payload: AccessPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(encoder.encode(JWT_SECRET));
}

export async function signRefreshToken(payload: AccessPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(JWT_SECRET));
}

export async function verifyToken<T = AccessPayload>(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
  return payload as T;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateOpaqueToken() {
  return randomBytes(48).toString("hex");
}
