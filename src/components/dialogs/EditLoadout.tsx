"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilLine } from "lucide-react";
import { Gadget, Loadout, Operator, WeaponSelection } from "@/lib/utils/types";
import LoadoutCustomization from "../dashboard/custom/LoadoutCustomization";
import { isNil } from "lodash";

export default function EditLoadoutDialog({ loadout }: { loadout: Loadout }) {
  const selectedLoadout = {
    loadoutName: loadout.name,
    primary: loadout.primary_weapon,
    secondary: loadout.secondary_weapon,
    gadget: loadout.gadget,
  };

  const [operatorData, setOperatorData] = useState<{
    operator: Operator;
    weapons: WeaponSelection[];
    gadgets: Gadget[];
  } | null>(null);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      const operatorId = loadout.operator.id;
      try {
        const res = await fetch(`/api/operator/${operatorId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch operators");
        }
        const data = await res.json();

        setOperatorData(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex flex-row items-center gap-x-2">
          <PencilLine />
          <span>Edit</span>
        </span>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Loadout</DialogTitle>
          <DialogDescription>
            Customize your operator loadout details below.
          </DialogDescription>
        </DialogHeader>
        <div>
          {operatorData && !isLoading && isNil(error) ? (
            <LoadoutCustomization
              preSelected={selectedLoadout}
              operator={operatorData.operator}
              weapons={operatorData.weapons}
              gadgets={operatorData.gadgets}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
