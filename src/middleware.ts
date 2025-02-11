import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { PATH } from "./constants/paths";
import path from "path";

const AUTH_ROUTES = [PATH.LOGIN, PATH.REGISTER];

export function middleware(request: NextRequest) {
  const jwt = cookies().get("jwt")?.value;
  const { pathname } = request.nextUrl;

  if (
    !jwt &&
    (pathname.startsWith("/user") ||
      pathname.startsWith("/chat") ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
  }

  if (jwt && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", ...AUTH_ROUTES],
};
