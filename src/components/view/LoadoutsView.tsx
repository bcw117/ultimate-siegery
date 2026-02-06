import { LoadoutDisplay } from "@/lib/types";
import LoadoutCard from "../general/LoadoutCard";

type LoadoutViewProps = { loadouts: LoadoutDisplay[] };

export default function LoadoutsView({ loadouts }: LoadoutViewProps) {
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

        {loadouts.length > 0 ? (
          <div className="grid w-full gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {loadouts.map((loadout, idx: number) => (
              <div key={loadout.id}>
                <LoadoutCard
                  loadout={
                    {
                      ...loadout,
                      name: loadout.name ?? `Loadout ${idx + 1}`,
                    } as LoadoutDisplay
                  }
                  editable
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
      </div>
    </div>
  );
}
