"use client";
import { useState } from "react";
import { OperatorRecord, OperatorFullLoadout } from "@/lib/types";
import OperatorSelect from "../custom/OperatorSelect";
import { isNil } from "lodash";
import LoadoutCustomization from "../custom/LoadoutCustomizer";

interface CustomLoadoutProps {
  operators: OperatorFullLoadout[];
}

export default function CustomLoadoutView({ operators }: CustomLoadoutProps) {
  const [selectedOperator, setSelectedOperator] =
    useState<OperatorRecord | null>(null);

  const selectedOperatorLoadout = operators.find(
    (operator) => operator.id === selectedOperator?.id
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-2xl leading-none tracking-tight">
          Custom Loadouts
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure and save loadouts for every operator
        </p>
      </div>
      <div className="flex flex-col items-center">
        <OperatorSelect
          onSelect={setSelectedOperator}
          selectedOperatorId={selectedOperator?.id}
          operators={operators}
        />
      </div>
      {!isNil(selectedOperatorLoadout) && (
        <LoadoutCustomization
          key={selectedOperatorLoadout.id}
          operator={selectedOperatorLoadout}
        />
      )}
    </div>
  );
}
