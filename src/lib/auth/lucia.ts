// src/lib/auth/lucia.ts
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from '@/lib/db';
import { sessions, users } from "@/lib/db/schema";
import { env } from '@/lib/env';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role
    };
  }
});

declare module "lucia" {
  interface DatabaseUserAttributes {
    email: string;
    role: "free" | "professional" | "business";
  }
  interface DatabaseSessionAttributes {}
}

// Export type
export type Auth = typeof auth;