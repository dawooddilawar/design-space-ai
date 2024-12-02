"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/forms/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    router.push("/dashboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <AuthForm mode="login" onSubmit={handleSubmit} />
        <div className="mt-4 text-center">
          <Link href="/auth/register" className="text-sm text-blue-600 hover:text-blue-500">
            Don't have an account? Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}