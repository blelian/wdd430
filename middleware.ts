// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({ req });

  // Define the paths that should be protected
  const protectedPaths = ['/dashboard', '/profile'];

  // Check if the requested path is protected and if the user is authenticated
  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      // Redirect to the login page if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow the request to proceed if not protected or if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
