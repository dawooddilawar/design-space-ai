import { cookies } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return new Response(JSON.stringify({
      error: "Invalid input"
    }), { status: 400 });
  }

  try {
    const key = await auth.useKey(
      "email",
      result.data.email.toLowerCase(),
      result.data.password
    );
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}
    });
    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Invalid credentials"
    }), { status: 400 });
  }
}