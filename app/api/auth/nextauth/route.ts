// app/api/auth/nextauth/route.ts
export const runtime = "nodejs";

import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import type { User } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | null> {
  const users = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
  return users[0] ?? null;
}

// Make TypeScript happy
const handler = (req: Request) => NextAuth(authConfig)(req);

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
