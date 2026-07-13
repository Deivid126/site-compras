import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, getSecret, SESSION_COOKIE } from "@/lib/admin-auth";

const VISITOR_COOKIE = "vid";
const ONE_YEAR = 60 * 60 * 24 * 365;

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isLoginPage(pathname: string): boolean {
  return pathname === "/admin/login";
}

function isAdminApi(pathname: string): boolean {
  return pathname.startsWith("/api/admin/");
}

function isLoginApi(pathname: string): boolean {
  return pathname === "/api/admin/login";
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get(VISITOR_COOKIE)?.value) {
    res.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: ONE_YEAR,
      path: "/",
    });
  }

  const { pathname } = req.nextUrl;
  const secret = getSecret();

  if (
    (isAdminPath(pathname) && !isLoginPage(pathname)) ||
    (isAdminApi(pathname) && !isLoginApi(pathname))
  ) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const ok = await verifySession(token, secret);
    if (!ok) {
      if (isAdminApi(pathname)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (isLoginPage(pathname) && req.method === "GET") {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const ok = await verifySession(token, secret);
    if (ok) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
