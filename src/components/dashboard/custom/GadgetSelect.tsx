import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Gadget } from "@/lib/utils/types";

type GadgetSelectProps = {
  selectedGadget: Gadget | null;
  setSelectedGadget: (gadget: Gadget | null) => void;
  gadgets: Gadget[];
};

export default function GadgetSelect({
  selectedGadget,
  setSelectedGadget,
  gadgets,
}: GadgetSelectProps) {
  return (
    <div>
      <RadioGroup
        value={selectedGadget?.id.toString()}
        onValueChange={(val) =>
          setSelectedGadget(
            gadgets.find((g) => g.id.toString() === val) || null
          )
        }
        className="grid grid-cols-2 gap-4"
      >
        {gadgets.map((gadget) => (
          <div key={gadget.id}>
            <RadioGroupItem
              value={gadget.id.toString()}
              id={`gadget-${gadget.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`gadget-${gadget.id}`}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-siege-accent [&:has([data-state=checked])]:border-siege-accent cursor-pointer"
            >
              {gadget.icon_url && (
                <div className="relative w-8 h-8 mb-2">
                  <Image
                    src={gadget.icon_url}
                    alt={gadget.name}
                    fill
                    className="object-contain invert"
                  />
                </div>
              )}
              {gadget.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
