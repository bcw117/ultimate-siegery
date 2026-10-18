import Link from "next/link";
import { Button } from "../ui/button";

export default function NoLoadouts() {
  return (
    <div className="space-y-4 rounded-lg border border-dashed p-8">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">No saved loadouts yet</h2>
        <p className="text-muted-foreground">
          Roll a random loadout or build your own, then save it to see it here.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/create-loadout/random">Roll a random loadout</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/create-loadout/custom">Build a custom loadout</Link>
        </Button>
      </div>
    </div>
  );
}
