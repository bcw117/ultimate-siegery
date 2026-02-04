import { fetchLoadout, fetchLoadouts } from "@/lib/api/loadouts/queries";
import { isNil } from "lodash";

export default async function RandomLoadout() {
  const response = await fetchLoadouts();

  if (!response.ok || isNil(response.data)) {
    return <div>Unable to retrieve data</div>;
  }

  console.log(response.data[0].primary_weapon);

  return <div>EPIC </div>;
}
