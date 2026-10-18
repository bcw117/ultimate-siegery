import type { Metadata } from "next";
import RandomLoadoutView from "@/components/view/RandomLoadoutView";
import { fetchAllOperatorLoadouts } from "@/lib/api/operators/queries";
import { OperatorFullLoadout } from "@/lib/types/types";
import { generateRandomLoadout, parseSide } from "@/lib/utils/helpers";
import { isNil } from "lodash";

export const metadata: Metadata = { title: "Random loadout" };

export const dynamic = "force-dynamic";

export default async function RandomLoadout({
  searchParams,
}: {
  searchParams: Promise<{ side?: string; operator?: string }>;
}) {
  const response = await fetchAllOperatorLoadouts();

  if (!response.ok || isNil(response.data)) {
    throw new Error("Failed to fetch operator data");
  }

  const operators = response.data as OperatorFullLoadout[];

  // Arriving from the landing page with a side (and optionally an operator)
  // rolls a loadout straight away
  const params = await searchParams;
  const side = parseSide(params.side);
  const operatorId = Number(params.operator) || undefined;
  const initialLoadout = side
    ? generateRandomLoadout(operators, side, operatorId)
    : undefined;

  return (
    <RandomLoadoutView
      operators={operators}
      initialSide={side}
      initialLoadout={initialLoadout}
    />
  );
}
