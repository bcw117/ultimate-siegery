"use client";
import React, { useState } from "react";
import { Gadget, Operator, WeaponSelection} from "@/lib/utils/types";
import { toast } from "sonner";
import OperatorSelect from "./custom/OperatorSelect";
import { isNil } from "lodash";
import LoadoutCustomization from "./custom/LoadoutCustomization";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomLoadoutSection() {
  const [operator, setOperator] = useState<Operator>();
  const [weapons, setWeapons] = useState<WeaponSelection[]>([]);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOperatorSelect = async (selectedOp: Operator) => {
    try {
      if (!isNil(operator) && selectedOp.id === operator.id) {
        return;
      }

      setIsLoading(true);
      setOperator(undefined);
      setWeapons([]);
      setGadgets([]);

      const response = await fetch(`/api/operator/${selectedOp.id}`
      );

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <OperatorSelect
          onSelect={handleOperatorSelect}
          selectedOperatorId={operator?.id}
        />

        {isLoading ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64 bg-slate-800/50" />
              <Skeleton className="h-10 w-32 bg-slate-800/50" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[200px] rounded-xl bg-slate-800/50" />
              <Skeleton className="h-[200px] rounded-xl bg-slate-800/50" />
              <Skeleton className="h-[300px] md:col-span-2 rounded-xl bg-slate-800/50" />
              <Skeleton className="h-[300px] md:col-span-2 rounded-xl bg-slate-800/50" />
            </div>
          </div>
        ) : operator ? (
          <LoadoutCustomization
            operator={operator}
            weapons={weapons}
            gadgets={gadgets}
          />
        ) : null}
      </div>
    </div>
  );
}
