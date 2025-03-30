"use client";

import LoadoutGenerator from "@/components/LoadoutGenerator";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadoutGenerator />
    </div>
  );
}
