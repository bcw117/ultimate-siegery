"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function PaginationControls({
  prev_cursor,
  next_cursor,
}: {
  prev_cursor: string | null;
  next_cursor: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ?? "10";

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={!prev_cursor}
        onClick={() => {
          if (prev_cursor) {
            router.push(
              `loadouts/?cursor=${prev_cursor}&limit=${limit}&forward=false`
            );
          }
        }}
      >
        Previous Page
      </Button>
      <Button
        variant="outline"
        disabled={!next_cursor}
        onClick={() => {
          if (next_cursor) {
            router.push(
              `loadouts/?cursor=${next_cursor}&limit=${limit}&forward=true`
            );
          }
        }}
      >
        Next Page
      </Button>
    </div>
  );
}
