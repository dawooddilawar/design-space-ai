import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

import { auth as lucia } from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: Request) {
  const formData = await request.json();
  const { email, password } = formData;

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!existingUser) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 400,
        }
      );
    }

    const validPassword = await new Argon2id().verify(
      existingUser.hashedPassword,
      password
    );

    if (!validPassword) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 400,
        }
      );
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    await cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

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
        error: "An error occurred while signing in",
      },
      {
        status: 500,
      }
    );
  }
}