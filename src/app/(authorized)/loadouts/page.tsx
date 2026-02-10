import LoadoutsView from "@/components/view/LoadoutsView";
import { fetchLoadouts } from "@/lib/api/loadouts/queries";
import { LoadoutDisplay } from "@/lib/types/types";

export const dynamic = "force-dynamic";

export default async function Loadouts() {
  const response = await fetchLoadouts();

  if ("error" in response) {
    throw new Error("Unable to fetch loadouts");
  }

  return <LoadoutsView loadouts={response.data as LoadoutDisplay[]} />;
}
