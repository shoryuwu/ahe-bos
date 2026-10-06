import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { readDB, writeDB, now } from "./db";
import { User, Session } from "@/types/db";

const COOKIE_SESSION = "ahe_session";
const COOKIE_ROLE = "ahe_role";

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function setSessionCookies(userId: string, role: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const db = readDB();
  db.sessions.push({
    id: crypto.randomUUID(),
    user_id: userId,
    token,
    expires_at: expiresAt,
    created_at: now(),
  });
  writeDB(db);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESSION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });

  cookieStore.set(COOKIE_ROLE, role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });

  return token;
}

export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_SESSION)?.value;

  if (token) {
    const db = readDB();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDB(db);
  }

  cookieStore.delete(COOKIE_SESSION);
  cookieStore.delete(COOKIE_ROLE);
}

export async function getSession(): Promise<{ user: User; session: Session } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_SESSION)?.value;
  if (!token) return null;

  const db = readDB();
  const session = db.sessions.find(
    (s) => s.token === token && new Date(s.expires_at) > new Date()
  );
  if (!session) return null;

  const user = db.users.find((u) => u.id === session.user_id && u.is_active);
  if (!user) return null;

  return { user, session };
}

export async function requireAuth(allowedRoles?: string[]): Promise<{ user: User; session: Session } | null> {
  const result = await getSession();
  if (!result) return null;
  if (allowedRoles && !allowedRoles.includes(result.user.role)) return null;
  return result;
}
