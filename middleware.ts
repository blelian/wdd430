// middleware.ts
import { auth } from './auth';

export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], // protects all routes except static files
  runtime: 'nodejs',
};
