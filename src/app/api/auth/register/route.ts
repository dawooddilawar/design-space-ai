// src/app/api/auth/register/route.ts
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

import { auth as lucia } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: Request) {
  const formData = await request.json();
  const { email, password } = formData;

  // validate email and password
  if (
    typeof email !== "string" ||
    email.length < 3 ||
    email.length > 255 ||
    !email.includes("@")
  ) {
    return Response.json(
      {
        error: "Invalid email",
      },
      {
        status: 400,
      }
    );
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return Response.json(
      {
        error: "Invalid password",
      },
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    // check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return Response.json(
        {
          error: "Email already in use",
        },
        {
          status: 400,
        }
      );
    }

    // create user
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword,
      role: "free",
    });

    // create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return Response.json(
      {
        error: "An error occurred while creating your account",
      },
      {
        status: 500,
      }
    );
  }
}