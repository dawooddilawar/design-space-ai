import { cookies } from "next/headers";
import { cache } from "react";

import { auth } from '@/lib/auth/lucia';

export const getPageSession = cache(async () => {
  const sessionId = (await cookies()).get(auth.sessionCookieName)?.value;
  if (!sessionId) return null;

  try {
    return await auth.validateSession(sessionId);
  } catch {
    return null;
  }
});