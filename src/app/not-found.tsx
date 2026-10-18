import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center gap-4 px-4">
      <h1 className="text-4xl font-semibold font-display md:text-5xl">
        Page not found
      </h1>
      <p className="max-w-prose text-muted-foreground">
        There&apos;s nothing at this address. It may have moved, or the link may
        be wrong.
      </p>
      <div>
        <Button asChild>
          <Link href="/">Go to home page</Link>
        </Button>
      </div>
    </div>
  );
}
