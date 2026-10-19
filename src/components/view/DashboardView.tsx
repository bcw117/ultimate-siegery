import Link from "next/link";
import Image from "next/image";
import { countBy, maxBy } from "lodash";
import { Dices, Hammer, Swords } from "lucide-react";
import LoadoutCard from "../general/LoadoutCard";
import NoLoadouts from "../general/NoLoadouts";
import PageHeader from "../general/PageHeader";
import StatStrip from "../general/StatStrip";
import { LoadoutDisplay, Side } from "@/lib/types/types";

const RECENT_COUNT = 4;

const tileClass =
  "group flex flex-col justify-between gap-8 rounded-lg border bg-card p-4 transition outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring sm:gap-10 sm:p-5";

type DashboardViewProps = {
  firstName: string | undefined;
  loadouts: LoadoutDisplay[];
};

function favoriteOperator(loadouts: LoadoutDisplay[]) {
  const counts = countBy(loadouts, (loadout) => loadout.operator.id);
  const id = maxBy(Object.keys(counts), (key) => counts[key]);
  return loadouts.find((loadout) => String(loadout.operator.id) === id)
    ?.operator;
}

// Home page for signed-in users
export default function DashboardView({
  firstName,
  loadouts,
}: DashboardViewProps) {
  const favorite = favoriteOperator(loadouts);
  const sideCount = countBy(loadouts, (loadout) => loadout.operator.side);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 md:py-14">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Roll something new, or pick up one of your saved loadouts."
      />

      <nav
        aria-label="Quick actions"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {Object.values(Side).map((side) => (
          <Link
            key={side}
            data-side={side}
            href={`/create-loadout/random?side=${side.toLowerCase()}`}
            className={`${tileClass} border-l-4 border-l-side hover:bg-side/10`}
          >
            <Dices className="size-6 text-side transition group-hover:-rotate-12" />
            <span className="space-y-1">
              <span className="block text-2xl leading-none font-extrabold sm:text-3xl text-side font-display">
                {side}
              </span>
              <span className="block text-sm text-muted-foreground">
                Roll a random {side.toLowerCase()} loadout
              </span>
            </span>
          </Link>
        ))}
        <Link
          href="/create-loadout/custom"
          className={`${tileClass} hover:bg-accent`}
        >
          <Hammer className="size-6 transition group-hover:-rotate-12" />
          <span className="space-y-1">
            <span className="block text-2xl leading-none font-extrabold sm:text-3xl font-display">
              Custom
            </span>
            <span className="block text-sm text-muted-foreground">
              Build a loadout slot by slot
            </span>
          </span>
        </Link>
        <Link href="/challenges" className={`${tileClass} hover:bg-accent`}>
          <Swords className="size-6 transition group-hover:-rotate-12" />
          <span className="space-y-1">
            <span className="block text-2xl leading-none font-extrabold sm:text-3xl font-display">
              Challenge
            </span>
            <span className="block text-sm text-muted-foreground">
              Roll a house rule for your squad
            </span>
          </span>
        </Link>
      </nav>

      {/* Stats only mean something once there's a saved loadout */}
      {favorite && (
        <StatStrip
          stats={[
            { label: "Saved loadouts", value: loadouts.length },
            {
              label: "Attacker / defender",
              value: (
                <>
                  <span className="text-attack">
                    {sideCount[Side.Attacker] ?? 0}
                  </span>
                  <span className="text-muted-foreground"> / </span>
                  <span className="text-defend">
                    {sideCount[Side.Defender] ?? 0}
                  </span>
                </>
              ),
            },
            {
              label: "Most saved operator",
              value: (
                <span className="flex items-center gap-3">
                  {favorite.icon_url && (
                    <span className="relative size-10 shrink-0">
                      <Image
                        src={favorite.icon_url}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </span>
                  )}
                  <span className="truncate">{favorite.name}</span>
                </span>
              ),
            },
          ]}
        />
      )}

      <section aria-labelledby="recent-loadouts" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="recent-loadouts"
            className="text-3xl leading-none font-bold font-display"
          >
            Recent loadouts
          </h2>
          {loadouts.length > 0 && (
            <Link
              href="/loadouts"
              className="rounded-sm text-sm text-muted-foreground underline underline-offset-4 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all {loadouts.length} saved loadouts
            </Link>
          )}
        </div>
        {loadouts.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {loadouts.slice(0, RECENT_COUNT).map((loadout) => (
              <LoadoutCard key={loadout.id} loadout={loadout} editable />
            ))}
          </div>
        ) : (
          <NoLoadouts />
        )}
      </section>
    </div>
  );
}
