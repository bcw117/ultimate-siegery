"use client";

import { LoadoutDisplay, OperatorFullLoadout, Side } from "@/lib/types/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dices, Save } from "lucide-react";
import LoadoutCard from "../general/LoadoutCard";
import PageHeader from "../general/PageHeader";
import SideToggle from "../custom/SideToggle";
import { saveLoadout } from "@/lib/api/loadouts/mutations";
import { generateRandomLoadout } from "@/lib/utils/helpers";

type RandomLoadoutViewProps = {
  operators: OperatorFullLoadout[];
  initialSide?: Side;
  initialLoadout?: LoadoutDisplay;
};

export default function RandomLoadoutView({
  operators,
  initialSide,
  initialLoadout,
}: RandomLoadoutViewProps) {
  const router = useRouter();
  const [side, setSide] = useState<Side>(initialSide ?? Side.Attacker);
  const [loadout, setLoadout] = useState(initialLoadout);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const roll = (rollSide: Side) => {
    const newLoadout = generateRandomLoadout(operators, rollSide);
    if (!newLoadout) {
      toast.error(
        `Couldn't roll a ${rollSide.toLowerCase()} loadout. Try again.`
      );
      return;
    }

    setLoadout(newLoadout);
    setIsSaved(false);
  };

  const handleSideChange = (newSide: Side) => {
    setSide(newSide);
    roll(newSide);
  };

  const handleSave = async () => {
    if (!loadout) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveLoadout({
        name: loadout.name,
        operatorId: loadout.operator.id,
        primaryWeapon: loadout.primaryWeapon,
        secondaryWeapon: loadout.secondaryWeapon,
        gadget: loadout.gadget,
      });

      if ("error" in result) {
        toast.error("Couldn't save this loadout. Try again.");
        return;
      }

      setIsSaved(true);
      toast.success("Loadout saved", {
        action: { label: "View", onClick: () => router.push("/loadouts") },
      });
    } catch {
      toast.error("Couldn't save this loadout. Check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Random loadout"
        description="Pick a side and get a random operator, weapons, attachments and gadget."
      />

      <div className="flex flex-wrap items-center gap-3">
        <SideToggle value={side} onValueChange={handleSideChange} />
        <Button onClick={() => roll(side)}>
          <Dices />
          {loadout ? "Roll again" : "Roll loadout"}
        </Button>
        <Button
          variant="outline"
          disabled={!loadout || isSaving || isSaved}
          onClick={handleSave}
        >
          <Save />
          {isSaved ? "Saved" : isSaving ? "Saving..." : "Save loadout"}
        </Button>
      </div>

      {loadout ? (
        <div className="max-w-3xl">
          <LoadoutCard loadout={loadout} />
        </div>
      ) : (
        <div className="max-w-3xl rounded-lg border border-dashed p-8 text-muted-foreground">
          Pick a side and roll to get a loadout.
        </div>
      )}
    </>
  );
}
