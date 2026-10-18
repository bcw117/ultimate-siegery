"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import Image from "next/image";
import { OperatorRecord } from "@/lib/types/types";

interface OperatorSelectProps {
  onSelect?: (operator: OperatorRecord) => void;
  selectedOperatorId?: number;
  operators: OperatorRecord[];
}

function OperatorIcon({ operator }: { operator: OperatorRecord }) {
  if (!operator.icon_url) {
    return <div className="size-8 shrink-0 rounded-sm bg-muted" />;
  }

  return (
    <div className="relative size-8 shrink-0">
      <Image
        src={operator.icon_url}
        alt=""
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
}

export default function OperatorSelect({
  onSelect,
  selectedOperatorId,
  operators,
}: OperatorSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedOperator = operators.find((op) => op.id === selectedOperatorId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Operator"
          className="h-14 w-full justify-between px-3"
        >
          {selectedOperator ? (
            <span className="flex items-center gap-3">
              <OperatorIcon operator={selectedOperator} />
              <span className="text-lg font-semibold font-display">
                {selectedOperator.name}
              </span>
              <span
                data-side={selectedOperator.side}
                className="text-sm font-normal text-side"
              >
                {selectedOperator.side}
              </span>
            </span>
          ) : (
            <span className="font-normal text-muted-foreground">
              Choose an operator
            </span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search operators" />
          <CommandList className="max-h-80">
            <CommandEmpty>No operator with that name.</CommandEmpty>
            <CommandGroup>
              {operators.map((op) => (
                <CommandItem
                  key={op.id}
                  value={op.name}
                  onSelect={() => {
                    onSelect?.(op);
                    setOpen(false);
                  }}
                  className="gap-3"
                >
                  <Check
                    className={cn(
                      selectedOperatorId === op.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <OperatorIcon operator={op} />
                  <span className="font-medium">{op.name}</span>
                  <span
                    data-side={op.side}
                    className="ml-auto text-xs text-side"
                  >
                    {op.side}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
