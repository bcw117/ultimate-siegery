import React from "react";
import PaginationControls from "@/components/PaginationControls";
import { fetchLoadouts } from "@/lib/api/db/loadouts/queries";
import LoadoutCard from "@/components/LoadoutCard";
import { Gadget, Loadout, Operator, Weapon } from "@/lib/utils/types";

type SingleLoadout = {
  details: { name: string | null; id: number; timestamp: Date };
  operator: Operator;
  primary_weapon: Weapon;
  secondary_weapon: Weapon;
  gadget: Gadget;
};

export default async function Loadouts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const cursor = params["cursor"] ?? null;
  const forward = params["forward"] ?? "true";

  const response = await fetchLoadouts(cursor, forward);

  const { result: loadouts, prev_cursor, next_cursor } = response;

  return (
    <div className="min-h-screen w-full px-4 py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Loadouts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-prose">
            Browse your generated loadouts.
          </p>
        </div>

        {loadouts && loadouts.length > 0 ? (
          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loadouts.map((loadout, idx: number) => (
              <div key={loadout.id}>
                <LoadoutCard
                  id={loadout.id}
                  loadout={
                    {
                      ...loadout,
                      name: loadout.name ?? `Loadout ${idx + 1}`,
                    } as Loadout
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start justify-center rounded-lg border border-dashed border-slate-300/40 p-10 text-left dark:border-slate-700/50">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-1">
              You currently have no loadouts
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate some loadouts to see them listed here.
            </p>
          </div>
        )}

        <div className="flex w-full items-center justify-center pt-4">
          <PaginationControls
            prev_cursor={prev_cursor}
            next_cursor={next_cursor}
          />
        </div>
      </div>
    </div>
  );
}
