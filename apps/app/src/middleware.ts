import { NextResponse } from "next/server";

import { middleware as auth } from "@mott/auth/middleware";

import { paths } from "~/routes/paths";

export default auth((req) => {
  const publicRoutes = ["/login", "/onboarding"];
  const isPublicRoute = publicRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }
  if (!req.auth?.user) {
    return NextResponse.redirect(new URL(paths.login, req.url));
  }
  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
