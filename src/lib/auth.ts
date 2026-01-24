import { cookies } from "next/headers";

const GUEST_SESSION_KEY = "bs_guest_session";
const ADMIN_SESSION_KEY = "bs_admin_session";
const SESSION_EXPIRY_DAYS = 7;

export type SessionType = "guest" | "admin" | null;

export async function getSession(): Promise<SessionType> {
  const cookieStore = await cookies();

  if (cookieStore.get(ADMIN_SESSION_KEY)?.value === "authenticated") {
    return "admin";
  }

  if (cookieStore.get(GUEST_SESSION_KEY)?.value === "authenticated") {
    return "guest";
  }

  return null;
}

export async function setGuestSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_KEY, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
    path: "/",
  });
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_KEY, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_SESSION_KEY);
  cookieStore.delete(ADMIN_SESSION_KEY);
}
