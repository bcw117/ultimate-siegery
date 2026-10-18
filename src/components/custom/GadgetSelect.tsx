import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { GadgetRecord } from "@/lib/types/types";

type GadgetSelectProps = {
  selectedGadget: GadgetRecord | undefined;
  setSelectedGadget: (gadget: GadgetRecord | undefined) => void;
  gadgets: GadgetRecord[];
};

export default function GadgetSelect({
  selectedGadget,
  setSelectedGadget,
  gadgets,
}: GadgetSelectProps) {
  return (
    <RadioGroup
      aria-label="Gadget"
      value={selectedGadget?.id.toString()}
      onValueChange={(val) =>
        setSelectedGadget(
          gadgets.find((g) => g.id.toString() === val) || undefined
        )
      }
      className="grid grid-cols-2 gap-3"
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
            className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border p-4 text-center font-normal text-muted-foreground transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-muted-foreground hover:text-foreground peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-foreground"
          >
            {gadget.icon_url && (
              <div className="relative size-8">
                <Image
                  src={gadget.icon_url}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-contain opacity-90 invert"
                />
              </div>
            )}
            {gadget.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
