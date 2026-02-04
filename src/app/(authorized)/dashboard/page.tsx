import DashboardView from "@/components/view/DashboardView";
import { fetchAllOperators } from "@/lib/db/operators/queries";

export default async function Dashboard() {
  const { data } = await fetchAllOperators();

  return <DashboardView operators={data ?? []} />;
}
