import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants/index";
import { PATH } from "./constants/paths";

const AUTH_ROUTER = [PATH.LOGIN, PATH.REGISTER];

export function middleware(request: NextRequest) {
  const token = cookies().get(ACCESS_TOKEN)?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
  }

  if (token && AUTH_ROUTER.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...AUTH_ROUTER, "/user/:path*"],
};
