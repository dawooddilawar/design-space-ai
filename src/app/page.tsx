import { redirect } from "next/navigation";

import { getPageSession } from "@/lib/auth/utils";

export default async function HomePage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/auth/login");
  }

  redirect("/dashboard");

}