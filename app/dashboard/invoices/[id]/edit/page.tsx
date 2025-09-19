// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Helper: fetch user from database
async function getUser(email: string): Promise<User | null> {
  const users = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
  return users[0] ?? null;
}

// Build authOptions by extending your authConfig with a Credentials provider
const authOptions = {
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
} as const;

// Create NextAuth handler and export as named route handlers for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
