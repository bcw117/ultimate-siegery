import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ALL_SIDES, Side, SideFilter } from "@/lib/types/types";

type SideToggleProps = {
  value: SideFilter;
  onValueChange: (side: SideFilter) => void;
};

const OPTIONS: SideFilter[] = [ALL_SIDES, ...Object.values(Side)];

export default function SideToggle({ value, onValueChange }: SideToggleProps) {
  return (
    <RadioGroupPrimitive.Root
      aria-label="Side"
      orientation="horizontal"
      value={value}
      onValueChange={(val) => onValueChange(val as SideFilter)}
      className="inline-flex rounded-md border p-1"
    >
      {OPTIONS.map((side) => (
        <RadioGroupPrimitive.Item
          key={side}
          value={side}
          data-side={side}
          className="rounded-sm px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:bg-side data-[state=checked]:text-background"
        >
          {side}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
