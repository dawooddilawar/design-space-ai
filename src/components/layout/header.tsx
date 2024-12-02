// src/components/layout/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    // Add more navigation items here as needed
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Interior AI
          </Link>
          <nav className="flex items-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <form action="/api/auth/logout" method="POST">
          <Button variant="outline" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}