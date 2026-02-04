import CustomLoadoutView from "@/components/view/CustomLoadoutView";
import { fetchAllOperatorLoadouts } from "@/lib/api/operators/queries";
import { isNil } from "lodash";

export default async function CustomLoadout() {
  const response = await fetchAllOperatorLoadouts();

  if (!response.ok || isNil(response.data)) {
    return <div>Unable to retrieve data</div>;
  }

  return <CustomLoadoutView operators={response.data as any} />;
}
