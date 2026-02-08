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
          className="w-full justify-between h-14 px-4 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-accent/50"
        >
          {selectedOperator ? (
            <div className="flex items-center gap-3">
              {selectedOperator.icon_url ? (
                <div className="relative w-8 h-8">
                  <Image
                    src={selectedOperator.icon_url}
                    alt={selectedOperator.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-[10px] text-muted-foreground">
                  NA
                </div>
              )}
              <span className="font-medium text-lg">
                {selectedOperator.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {"Select An Operator"}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 bg-slate-950 border-white/10">
        <Command className="flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-popover-foreground">
          <CommandInput
            placeholder="Search operator..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          <CommandList className="max-h-75 overflow-y-auto overflow-x-hidden p-1">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No operator found.
            </CommandEmpty>
            <CommandGroup>
              {operators.map((op) => (
                <CommandItem
                  key={op.id}
                  value={op.name}
                  onSelect={() => {
                    onSelect?.(op);
                    setOpen(false);
                  }}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent/50 transition-colors"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOperatorId === op.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    {op.icon_url ? (
                      <div className="relative w-8 h-8">
                        <Image
                          src={op.icon_url}
                          alt={op.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-[10px] text-muted-foreground">
                        NA
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{op.name}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
