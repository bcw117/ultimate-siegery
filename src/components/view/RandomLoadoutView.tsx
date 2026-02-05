"use client";

import { LoadoutDisplay, OperatorFullLoadout } from "@/db/types";
import { isNil } from "lodash";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Save, Shield, Shuffle } from "lucide-react";
import LoadoutCard from "../LoadoutCard";
import { saveLoadout } from "@/lib/api/loadouts/mutations";
import { getRandomElement, randomizedLoadoutName } from "@/lib/utils/helpers";

type RandomLoadoutViewProps = { operators: OperatorFullLoadout[] };

export default function RandomLoadoutView({
  operators,
}: RandomLoadoutViewProps) {
  const [side, setSide] = useState<"Attacker" | "Defender">("Attacker");
  const [loadout, setLoadout] = useState<LoadoutDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomLoadout = (side: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const filteredOperators = operators.filter((op) => op.side === side);
      const randomOperator = getRandomElement(filteredOperators);

      if (isNil(randomOperator)) {
        setIsLoading(false);
        toast.error("No operators found for this side");
        return;
      }

      const primary = getRandomElement(
        randomOperator.operator_weapons.filter((w) => w.slot === "Primary")
      );
      const secondary = getRandomElement(
        randomOperator.operator_weapons.filter((w) => w.slot === "Secondary")
      );
      const gadget = getRandomElement(randomOperator.operator_gadgets);

      if (!primary || !secondary || !gadget) {
        setIsLoading(false);
        toast.error("Incomplete operator data");
        return;
      }

      const newLoadout: LoadoutDisplay = {
        id: 1,
        name: randomizedLoadoutName(),
        operator: randomOperator,
        primary_weapon: {
          ...primary,
          attachments: {
            scope: getRandomElement(
              primary.attachments.filter((a) => a.type === "Sight")
            ),
            barrel: getRandomElement(
              primary.attachments.filter((a) => a.type === "Barrel")
            ),
            grip: getRandomElement(
              primary.attachments.filter((a) => a.type === "Grip")
            ),
            underbarrel: getRandomElement(
              primary.attachments.filter((a) => a.type === "Underbarrel")
            ),
          },
        },
        secondary_weapon: {
          ...secondary,
          attachments: {
            scope: getRandomElement(
              secondary.attachments.filter((a) => a.type === "Sight")
            ),
            barrel: getRandomElement(
              secondary.attachments.filter((a) => a.type === "Barrel")
            ),
            grip: getRandomElement(
              secondary.attachments.filter((a) => a.type === "Grip")
            ),
            underbarrel: getRandomElement(
              secondary.attachments.filter((a) => a.type === "Underbarrel")
            ),
          },
        },
        gadget: gadget,
      };

      setLoadout(newLoadout);
      setIsLoading(false);
      toast.success(`Generated loadout for ${randomOperator.name}`);
    }, 800);
  };

  const handleSave = async () => {
    if (isNil(loadout)) {
      toast.error("Please generate a loadout first");
      return;
    }

    try {
      const primary_attachment_ids = Object.values(
        loadout.primary_weapon.attachments
      )
        .filter((a) => !isNil(a))
        .map((a) => a!.id);

      const secondary_attachment_ids = Object.values(
        loadout.secondary_weapon.attachments
      )
        .filter((a) => !isNil(a))
        .map((a) => a!.id);

      const result = await saveLoadout({
        name: loadout.name,
        operator_id: loadout.operator.id,
        primary_weapon_id: loadout.primary_weapon.id,
        secondary_weapon_id: loadout.secondary_weapon.id,
        gadget_id: loadout.gadget.id,
        primary_attachment_ids,
        secondary_attachment_ids,
      });

      if (result.ok) {
        toast.success("Loadout saved successfully!");
      } else {
        toast.error("Failed to save loadout: " + (result as any).error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + (error as Error).message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4">
      <div className="flex flex-wrap gap-4">
        <Button
          variant={side === "Attacker" ? "default" : "outline"}
          className={side === "Attacker" ? "bg-siege-accent" : "bg-transparent"}
          onClick={() => setSide("Attacker")}
        >
          Attacker
        </Button>
        <Button
          variant={side === "Defender" ? "default" : "outline"}
          className={
            side === "Defender" ? "bg-siege-accent" : "bg-transparent "
          }
          onClick={() => setSide("Defender")}
        >
          Defender
        </Button>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        <Button
          className="bg-siege-accent hover:bg-siege-accent/90 text-white flex items-center gap-2"
          onClick={() => generateRandomLoadout(side)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span>Generating</span>
              <span className="flex space-x-1 ml-1">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </span>
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4" />
              <span>Generate Random Loadout</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="border-white/20 hover:border-white/50 text-white bg-transparent cursor-pointer"
          disabled={isLoading}
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Loadout
        </Button>
      </div>
      {!isLoading && !isNil(loadout) ? (
        <LoadoutCard loadout={loadout} />
      ) : (
        <>
          {isLoading ? (
            <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
              <div className="flex justify-center mb-4">
                <span className="flex space-x-2 items-center">
                  <span className="loading-dot w-3 h-3"></span>
                  <span className="loading-dot w-3 h-3"></span>
                  <span className="loading-dot w-3 h-3"></span>
                </span>
              </div>
              <p className="text-white/70">
                Randomizing your tactical loadout...
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
              <Shield className="mx-auto text-white/40 mb-4 w-12 h-12" />
              <p className="text-white/70">
                Click the Generate button to create your random loadout
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
