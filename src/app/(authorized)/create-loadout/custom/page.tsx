import CustomLoadoutView from "@/components/view/CustomLoadoutView";
import { fetchAllOperatorLoadouts } from "@/lib/api/operators/queries";
import { OperatorFullLoadout } from "@/lib/types/types";

export const dynamic = "force-dynamic";

export default async function CustomLoadout() {
  const response = await fetchAllOperatorLoadouts();

  if ("error" in response) {
    throw new Error(`Failed to fetch operator data: ${response.error}`);
  }

  return (
    <CustomLoadoutView operators={response.data as OperatorFullLoadout[]} />
  );
}
