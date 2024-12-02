"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/forms/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AuthForm
          mode="register"
          onSubmit={async (data) => {
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error);
            }

            if (result.redirect) {
              router.push(result.redirect);
              router.refresh();
            }
          }}
        />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Link
          href="/auth/login"
          className="text-sm text-center text-primary hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </CardContent>
    </Card>
  );
}