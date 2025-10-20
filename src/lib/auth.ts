import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "access-secret-key-change-in-production"
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "refresh-secret-key-change-in-production"
);

const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

export interface CustomJWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function generateAccessToken(
  payload: CustomJWTPayload
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(
  payload: CustomJWTPayload
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<CustomJWTPayload | null> {
  try {
    const verified = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return verified.payload as unknown as CustomJWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<CustomJWTPayload | null> {
  try {
    const verified = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return verified.payload as unknown as CustomJWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value || null;
}

export async function getCurrentUser(): Promise<CustomJWTPayload | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  return await verifyAccessToken(accessToken);
}

// For API routes with Bearer token authentication
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
