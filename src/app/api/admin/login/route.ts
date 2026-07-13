import { NextRequest, NextResponse } from "next/server";
import {
  isValidCredential,
  signSession,
  getSecret,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const user = String(form.get("user") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!isValidCredential(user, password)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", req.url),
    );
  }

  const secret = getSecret();
  if (!secret) {
    return NextResponse.redirect(
      new URL("/admin/login?error=2", req.url),
    );
  }

  const token = await signSession(secret);
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
