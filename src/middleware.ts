import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/onboarding', '/dashboard'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('better-auth.session_token');

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/onboarding/:path*', '/dashboard/:path*'],
};
