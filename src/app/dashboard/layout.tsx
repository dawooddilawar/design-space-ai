import { redirect } from "next/navigation";
import React from 'react';

import { getPageSession } from "@/lib/auth/utils";

export default async function DashboardLayout({ children, }: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">{children}</div>
    </div>
  );
}