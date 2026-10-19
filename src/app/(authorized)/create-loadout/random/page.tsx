import type { Metadata } from "next";
import RandomLoadoutView from "@/components/view/RandomLoadoutView";
import { fetchAllOperatorLoadouts } from "@/lib/api/operators/queries";
import { ALL_SIDES, OperatorFullLoadout } from "@/lib/types/types";
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

    // Always roll a loadout up front. The landing page can link here with a side
    // (and optionally an operator); otherwise roll across both sides.
    const params = await searchParams;
    const side = parseSide(params.side) ?? ALL_SIDES;
    const operatorId = Number(params.operator) || undefined;
    const initialLoadout = generateRandomLoadout(operators, side, operatorId);

    return (
        <RandomLoadoutView
            operators={operators}
            initialSide={side}
            initialLoadout={initialLoadout}
        />
    );
}
