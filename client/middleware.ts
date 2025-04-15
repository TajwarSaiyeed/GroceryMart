import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/get-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSession();

  const publicRoutes = ["/", "/products", "/payment"];

  if (publicRoutes.includes(pathname) || !pathname.startsWith("/user")) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"], 
};
