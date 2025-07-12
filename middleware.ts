import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/projects(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId && isProtectedRoutes(req)) {
    return authResult.redirectToSignIn();
  }

  const path = req.nextUrl.pathname;

  if (
    authResult.userId &&
    !authResult.orgId &&
    ["/", "/onboarding"].includes(path)
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
