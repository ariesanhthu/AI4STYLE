import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UnauthorizedProps {
  returnPath?: string;
  returnLabel?: string;
}

export function Unauthorized({ returnPath = "/", returnLabel = "Back to Home" }: UnauthorizedProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
      <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/20">
        <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-muted-foreground max-w-[500px]">
          You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
      </div>
      <Link href={returnPath}>
        <Button variant="outline">{returnLabel}</Button>
      </Link>
    </div>
  );
}
