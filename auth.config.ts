// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login', // custom login page
  },
  callbacks: {
    // Protect routes with Middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      // Only allow logged-in users on /dashboard
      if (isOnDashboard) {
        return isLoggedIn;
      }

      // Redirect logged-in users away from public pages
      if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true; // allow access to other pages
    },
  },
  providers: [], // will add Credentials provider in auth.ts
};
