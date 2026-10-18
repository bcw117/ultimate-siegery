import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardView from "@/components/view/DashboardView";
import LandingView from "@/components/view/LandingView";
import { fetchLoadouts } from "@/lib/api/loadouts/queries";
import { fetchOperatorRoster } from "@/lib/api/operators/queries";
import { LoadoutDisplay, OperatorRosterEntry, Side } from "@/lib/types/types";
import { getRandomElement } from "@/lib/utils/helpers";

export const metadata: Metadata = {
  title: { absolute: "Ultimate Siegery - Rainbow Six Siege Loadout Generator" },
  alternates: { canonical: "/" },
};

// The operator picks are random on every visit
export const dynamic = "force-dynamic";

function pickPerSide(operators: OperatorRosterEntry[]) {
  return Object.fromEntries(
    Object.values(Side).map((side) => [
      side,
      getRandomElement(operators.filter((op) => op.side === side)),
    ])
  );
}

// Signed-out visitors get the landing page; signed-in users get their dashboard
export default async function Home() {
  const { userId } = await auth();
  const rosterResponse = await fetchOperatorRoster();

  // The roster only powers the operator wall, so the page renders without it
  const roster = rosterResponse.ok ? rosterResponse.data : undefined;
  const picks = roster ? pickPerSide(roster.operators) : {};

  if (!userId) {
    return <LandingView roster={roster} picks={picks} />;
  }

  const [user, loadoutsResponse] = await Promise.all([
    currentUser(),
    fetchLoadouts(),
  ]);

  if ("error" in loadoutsResponse) {
    throw new Error("Unable to fetch loadouts");
  }

  return (
    <DashboardView
      firstName={user?.firstName ?? undefined}
      loadouts={loadoutsResponse.data as LoadoutDisplay[]}
      roster={roster}
      picks={picks}
    />
  );
}
