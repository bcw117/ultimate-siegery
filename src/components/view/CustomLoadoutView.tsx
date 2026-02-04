"use client";
import { useState } from "react";
import { OperatorRecord, OperatorFullLoadout } from "@/db/types";
import OperatorSelect from "../dashboard/custom/OperatorSelect";
import { isNil } from "lodash";
import LoadoutCustomization from "../dashboard/custom/LoadoutCustomization";

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
    <div className="flex flex-col justify-center items-center space-y-8 w-full">
      <OperatorSelect
        onSelect={setSelectedOperator}
        selectedOperatorId={selectedOperator?.id}
        operators={operators}
      />
      {!isNil(selectedOperatorLoadout) && (
        <LoadoutCustomization operator={selectedOperatorLoadout} />
      )}
    </div>
  );
}
