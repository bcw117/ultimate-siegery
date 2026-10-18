"use client";
import { useState } from "react";
import {
  OperatorRecord,
  OperatorFullLoadout,
  LoadoutDisplay,
} from "@/lib/types/types";
import OperatorSelect from "../custom/OperatorSelect";
import { isNil } from "lodash";
import { toast } from "sonner";
import LoadoutCustomization from "../custom/LoadoutCustomizer";
import PageHeader from "../general/PageHeader";
import { saveLoadout } from "@/lib/api/loadouts/mutations";
import { useRouter } from "next/navigation";

type CreateLoadoutRequest = Omit<LoadoutDisplay, "operator" | "id"> & {
  operatorId: number;
};

interface CustomLoadoutProps {
  operators: OperatorFullLoadout[];
}

export default function CustomLoadoutView({ operators }: CustomLoadoutProps) {
  const router = useRouter();
  const [selectedOperator, setSelectedOperator] =
    useState<OperatorRecord | null>(null);

  const selectedOperatorLoadout = operators.find(
    (operator) => operator.id === selectedOperator?.id
  );

  const onSubmit = async (loadoutDetails: CreateLoadoutRequest) => {
    try {
      const result = await saveLoadout(loadoutDetails);
      if ("error" in result) {
        toast.error("Couldn't save this loadout. Try again.");
        return false;
      }

      toast.success("Loadout saved");
      router.push(result.redirectTo);
      return true;
    } catch {
      toast.error("Couldn't save this loadout. Try again.");
      return false;
    }
  };

  return (
    <>
      <PageHeader
        title="Custom loadout"
        description="Choose an operator, then pick their weapons, attachments and gadget."
      />
      <div className="max-w-md">
        <OperatorSelect
          onSelect={setSelectedOperator}
          selectedOperatorId={selectedOperator?.id}
          operators={operators}
        />
      </div>
      {!isNil(selectedOperatorLoadout) ? (
        <LoadoutCustomization
          key={selectedOperatorLoadout.id}
          operator={selectedOperatorLoadout}
          onSubmit={onSubmit}
        />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-muted-foreground">
          Choose an operator to start building a loadout.
        </div>
      )}
    </>
  );
}
