"use client";

import React, { useEffect, useState } from "react";
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

type Operator = {
  id: number;
  name: string;
  side: string;
  health: number;
  speed: number;
  difficulty: number;
  unique_ability: string;
  icon_url: string | null;
  portrait_url: string | null;
};

interface OperatorSelectProps {
  onSelect?: (operator: Operator) => void;
  selectedOperatorId?: number;
}

export default function OperatorSelect({
  onSelect,
  selectedOperatorId,
}: OperatorSelectProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await fetch("/api/operator", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to fetch operators");
        const data = await res.json();
        setOperators(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOperators();
  }, []);

  const selectedOperator = operators.find((op) => op.id === selectedOperatorId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 px-4 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-accent/50"
          disabled={loading}
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
              {loading ? "Loading operators..." : "Select operator..."}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-950 border-white/10">
        <Command className="flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent text-popover-foreground">
          <CommandInput
            placeholder="Search operator..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
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
