import { cookies } from "next/headers";

import { auth as lucia } from "@/lib/auth/lucia";

export async function POST(request: Request) {
  const sessionId = await cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return Response.json(
    {
      success: true,
    },
    {
      status: 200,
    }
  );
}