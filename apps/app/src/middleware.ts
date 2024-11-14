import { NextResponse } from "next/server";

import { middleware as auth } from "@mott/auth/middleware";

import { paths } from "~/routes/paths";

export default auth((req) => {
  try {
    console.log("Middleware started:", req.nextUrl.pathname);

    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path),
    );
    if (isPublicRoute) {
      console.log("Public route detected");

      return NextResponse.next();
    }
    if (!req.auth?.user) {
      console.log("No auth user, redirecting to login");

      return NextResponse.redirect(new URL(paths.login, req.url));
    }
    console.log("Middleware completed successfully");

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|assets|_next/static|_next/image|favicon.ico).*)"],
};
