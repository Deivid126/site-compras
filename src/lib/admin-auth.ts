const COOKIE_NAME = "admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64Url(sig);
}

export async function signSession(secret: string): Promise<string> {
  const ts = Date.now();
  const payload = `admin:${ts}`;
  const sig = await hmac(payload, secret);
  return `${payload}:${sig}`;
}

export async function verifySession(
  token: string | undefined | null,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [user, tsStr, sig] = parts;
  if (user !== "admin") return false;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > MAX_AGE_MS) return false;
  const expected = await hmac(`${user}:${tsStr}`, secret);
  return sig === expected;
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_MS / 1000;

export const ADMIN_USER = "admin";

export function isValidCredential(user: string, password: string): boolean {
  return (
    user === ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD &&
    Boolean(process.env.ADMIN_PASSWORD)
  );
}

export function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "";
}
