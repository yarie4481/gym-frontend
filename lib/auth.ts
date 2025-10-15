import { cookies } from "next/headers";

// Token storage in HTTP-only cookies
export async function setAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

// User data storage in session storage (non-sensitive data)
export function setUserData(user: any) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("user", JSON.stringify(user));
  }
}

export function getUserData() {
  if (typeof window !== "undefined") {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearUserData() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user");
  }
}
