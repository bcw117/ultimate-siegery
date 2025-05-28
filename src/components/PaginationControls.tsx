"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

export default function PaginationControls({
  new_cursor,
}: {
  new_cursor: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ?? "10";

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          router.push(`loadouts/?cursor=${new_cursor}&limit=${limit}`);
        }}
      >
        Previous Page
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          router.push(`loadouts/?cursor=${new_cursor}&limit=${limit}`);
        }}
      >
        Next Page
      </Button>
    </div>
  );
}
