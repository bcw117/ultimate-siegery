import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-10">
      <span className="font-semibold text-5xl"> Page Not Found</span>
      <Button variant="secondary" size="lg">
        <Link href="/">
          <span className="text-2xl">Return to home</span>
        </Link>
      </Button>
    </div>
  );
}
