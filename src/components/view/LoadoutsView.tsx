import { LoadoutDisplay } from "@/lib/types/types";
import LoadoutCard from "../general/LoadoutCard";
import NoLoadouts from "../general/NoLoadouts";
import PageHeader from "../general/PageHeader";

type LoadoutViewProps = { loadouts: LoadoutDisplay[] };

export default function LoadoutsView({ loadouts }: LoadoutViewProps) {
  return (
    <>
      <PageHeader
        title="Saved loadouts"
        description="Loadouts you've saved from the random and custom builders."
      />

      {loadouts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {loadouts.map((loadout) => (
            <LoadoutCard key={loadout.id} loadout={loadout} editable />
          ))}
        </div>
      ) : (
        <NoLoadouts />
      )}
    </>
  );
}
