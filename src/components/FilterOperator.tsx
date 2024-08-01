"use client";
import * as React from "react";
import { OperatorFilter } from "@/types/operator";
import "@styles/filter.css";

import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "./ui/input";

import { cn } from "@/lib/utils";
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
import { Label } from "./ui/label";

type Props = {
  data: OperatorFilter[];
  handleClick: Function;
};

const filters = [
  {
    value: "attackers",
    label: "Attackers",
  },
  {
    value: "defenders",
    label: "Defenders",
  },
];

const FilterOperator = (props: Props) => {
  const filterOperators = props.data;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col ">
      <div className="flex w-full max-w-sm items-end space-x-2 mb-2">
        <div className="flex flex-col gap-[5px] w-full">
          <Label className="text-lg" htmlFor="filter">
            Search
          </Label>
          <Input id="filter" type="text" placeholder="Filter operators..." />
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? filters.find((framework) => framework.value === value)?.label
                : "Select Filter..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Filters" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {filters.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="filter-container">
        {filterOperators.map((operator: OperatorFilter, i) => {
          return (
            <img
              className={
                "grid-icon " +
                (operator.selected ? "opacity-50" : "opacity-100")
              }
              src={`/icons/${operator.name}.svg`}
              alt={operator + "Icon"}
              onClick={() => props.handleClick(operator.name)}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterOperator;
