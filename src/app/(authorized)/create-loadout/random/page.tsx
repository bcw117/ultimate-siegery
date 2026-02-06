import RandomLoadoutView from "@/components/view/RandomLoadoutView";
import { fetchAllOperatorLoadouts } from "@/lib/api/operators/queries";
import { isNil } from "lodash";

export const dynamic = "force-dynamic";

export default async function RandomLoadout() {
  const response = await fetchAllOperatorLoadouts();


  if (!response.ok || isNil(response.data)) {
    throw new Error("Failed to fetch operator data");
  }

  return <RandomLoadoutView operators={response.data as any} />;
}
