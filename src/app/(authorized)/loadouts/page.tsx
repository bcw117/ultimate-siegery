import LoadoutsView from "@/components/view/LoadoutsView";
import { fetchLoadouts } from "@/lib/api/loadouts/queries";
import { isNil } from "lodash";

export default async function Loadouts() {
  const response = await fetchLoadouts();

  if (!response.ok || isNil(response.data)) {
    throw Error("Unable to fetch loadouts");
  }

  return <LoadoutsView loadouts={response.data} />;
}
