import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/server';

const PUBLIC_ROUTES = new Set<string>(['/', '/login', '/signup', '/auth/callback']);
const AUTH_ROUTES = new Set<string>(['/login', '/signup']);

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/dashboard')
  );
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname);
}

export async function middleware(req: NextRequest) {
  // Skip special API webhook route explicitly (also excluded in matcher)
  if (req.nextUrl.pathname === '/api/stripe/webhook') {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient(req, res);

  // Trigger session fetch/refresh; cookies will be updated on `res` when needed
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // If user is authenticated, prevent access to auth routes (login/signup)
  if (session?.user && AUTH_ROUTES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/marketplace';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Protect specific routes; redirect unauthenticated users to login with return path
  if (!session?.user && isProtectedRoute(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // For public and other routes, continue normally
  // If there was an auth error, proceed gracefully (protected routes handled above)
  return res;
}

// Optimize: exclude static assets, images, icons, and API (except we explicitly bypass webhook above)
export const config = {
  matcher: [
    // Match all paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - api (API routes)
    // - public files by extension (basic patterns)
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|avif|css|js|map)$).*)',
  ],
};



