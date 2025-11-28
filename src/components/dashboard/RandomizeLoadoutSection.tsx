"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Save, Shield, Shuffle } from "lucide-react";
import LoadoutCard from "../LoadoutCard";
import { isNil } from "lodash";
import { toast } from "sonner";
import { Loadout } from "@/lib/utils/types";
import { saveLoadout } from "@/lib/api/db/loadouts/mutations";

export default function LoadoutSection() {
  const [side, setSide] = useState<"A" | "D">("A");
  const [loadout, setLoadout] = useState<Loadout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const generateLoadout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/operator/random?side=${side}`);
      const loadout = await response.json();

      setLoadout(loadout);
    } catch (e) {
      throw Error((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isNil(loadout)) {
      toast.error("Please generate a loadout first");
      return;
    }

    try {
      const result = await saveLoadout(loadout);

      if (result.success) {
        toast.success("Loadout saved successfully!");
      } else {
        toast.error("Failed to save loadout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred:" + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant={side === "A" ? "default" : "outline"}
          className={side === "A" ? "bg-siege-accent" : "bg-transparent"}
          onClick={() => setSide("A")}
        >
          Attacker
        </Button>
        <Button
          variant={side === "D" ? "default" : "outline"}
          className={side === "D" ? "bg-siege-accent" : "bg-transparent "}
          onClick={() => setSide("D")}
        >
          Defender
        </Button>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        <Button
          className="bg-siege-accent hover:bg-siege-accent/90 text-white flex items-center gap-2"
          onClick={generateLoadout}
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
        <LoadoutCard
          name={loadout.name}
          operator={loadout.operator}
          primary={loadout.primary_weapon}
          secondary={loadout.secondary_weapon}
          gadget={loadout.gadget}
        />
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
