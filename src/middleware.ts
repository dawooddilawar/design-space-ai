// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/lib/auth/lucia';

export async function middleware(request: NextRequest) {
  // Get the session cookie name from auth configuration
  const sessionCookie = request.cookies.get(auth.sessionCookieName);

  if (!sessionCookie?.value && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/register).*)',
  ],
};