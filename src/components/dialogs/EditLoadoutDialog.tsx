"use client";
import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadoutDisplay, OperatorFullLoadout } from "@/db/types";
import LoadoutCustomization from "../custom/LoadoutCustomization";
import { isNil } from "lodash";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

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

  const {
    isLoading,
    data: operator,
    error,
  } = useSWR(`/api/operators/${loadout.operator.id}`, fetcher);

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
