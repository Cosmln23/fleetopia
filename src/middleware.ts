import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/marketplace(.*)',
  '/settings(.*)',
]);

const isProtectedAPIRoute = createRouteMatcher([
  '/api/marketplace(.*)',
  '/api/settings(.*)',
  '/api/user(.*)',
  '/api/cargo(.*)',
  '/api/quotes(.*)',
  '/api/deals(.*)',
  '/api/chat(.*)',
]);

const isPublicAPIRoute = createRouteMatcher([
  '/api/health',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  
  // Handle protected page routes
  if (isProtectedRoute(req)) {
    await auth.protect();
    return;
  }
  
  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    // Allow public API routes without authentication
    if (isPublicAPIRoute(req)) {
      return;
    }
    
    // Protect API routes that require authentication
    if (isProtectedAPIRoute(req)) {
      try {
        await auth.protect();
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unauthorized - Authentication required',
            timestamp: new Date().toISOString()
          },
          { status: 401 }
        );
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};