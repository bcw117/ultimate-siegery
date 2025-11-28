"use client";
import React, { useState } from "react";
import { Gadget, Operator, WeaponSlot } from "@/lib/utils/types";
import { toast } from "sonner";
import OperatorSelect from "./custom/OperatorSelect";
import { isNil } from "lodash";
import LoadoutCustomization from "./custom/LoadoutCustomization";

export default function CustomLoadoutSection() {
  const [operator, setOperator] = useState<Operator>();
  const [weapons, setWeapons] = useState<WeaponSlot[]>([]);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);

  const handleOperatorSelect = async (selectedOp: Operator) => {
    try {
      if (!isNil(operator) && selectedOp.id === operator.id) {
        return;
      }
      setOperator(undefined);
      setWeapons([]);
      setGadgets([]);

      const response = await fetch(`/api/operator/${selectedOp.id}`, {
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch operator details");
      }

      const data = await response.json();

      // The API returns an array for operator, take the first one
      const opData = data.operator[0];
      setOperator(opData);
      setWeapons(data.weapons);
      setGadgets(data.gadgets);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load operator details");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <OperatorSelect
          onSelect={handleOperatorSelect}
          selectedOperatorId={operator?.id}
        />
        {operator && (
          <LoadoutCustomization
            operator={operator}
            weapons={weapons}
            gadgets={gadgets}
          />
        )}
      </div>
    </div>
  );
}
