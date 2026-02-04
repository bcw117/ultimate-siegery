"use client";
import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadoutDisplay, OperatorFullLoadout } from "@/db/types";
import LoadoutCustomization from "../dashboard/custom/LoadoutCustomization";
import { isNil } from "lodash";

export default function EditLoadoutDialog({
  loadout,
}: {
  loadout: LoadoutDisplay;
}) {
  const loadoutDetails = {
    name: loadout.name,
    primaryWeapon: loadout.primary_weapon,
    secondaryWeapon: loadout.secondary_weapon,
    gadget: loadout.gadget,
  };
  const [operator, setOperatorData] = useState<OperatorFullLoadout | null>(
    null
  );

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      const operatorId = loadout.operator.id;
      try {
        const res = await fetch(`/api/operators/${operatorId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch operators");
        }
        const data = await res.json();

        setOperatorData(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  return (
    <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Loadout</DialogTitle>
        <DialogDescription>
          Customize your operator loadout details below.
        </DialogDescription>
      </DialogHeader>
      <div>
        {operator && !isLoading && isNil(error) ? (
          <LoadoutCustomization
            selectedLoadout={loadoutDetails}
            operator={operator}
          />
        ) : (
          <>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>Error getting operator details. Please try again later.</div>
            )}
          </>
        )}
      </div>
    </DialogContent>
  );
}
