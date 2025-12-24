import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Proxy: redirect to /login if no token cookie present
export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Allow unauthenticated access to login, API auth endpoints, and static files
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  // Accept either `token` (JWT) or legacy `auth` flag cookie
  const hasToken = /(?:^|;\s*)(?:token|auth)=/.test(cookieHeader);

  if (!hasToken) {
    // quick redirect to /login before the request completes
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except api, _next, and the login page itself
  matcher: ['/((?!api|_next|static|favicon.ico|public|login).*)'],
};
