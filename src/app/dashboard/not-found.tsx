import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-muted-foreground">Could not find the requested page.</p>
      <Button asChild>
        <Link href="/src/app/dashboard/page">Return to Dashboard</Link>
      </Button>
    </div>
  );
}