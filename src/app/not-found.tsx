import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4 animate-in fade-in duration-500">
      <div className="bg-white/5 p-6 rounded-full ring-1 ring-white/10">
        <FileQuestion className="w-12 h-12 text-slate-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Page Not Found
        </h1>
        <p className="text-slate-400 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>
      </div>
      <Button asChild size="lg" className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
