import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Attachment, WeaponSlot } from "@/lib/utils/types";
import React from "react";
import { Label } from "@/components/ui/label";

type WeaponSelectProps = {
  slot: "primary" | "secondary";
  selectedWeapon: WeaponSlot | null;
  setSelectedWeapon: (weapon: WeaponSlot | null) => void;
  setAttachments: React.Dispatch<
    React.SetStateAction<{
      scope?: Attachment;
      barrel?: Attachment;
      grip?: Attachment;
      underbarrel?: Attachment;
    }>
  >;
  weapons: WeaponSlot[];
  handleAttachmentChange: (
    slot: "primary" | "secondary",
    type: "scope" | "barrel" | "grip" | "underbarrel",
    attachmentId: string
  ) => void;
};

export default function WeaponSelect({
  slot,
  selectedWeapon,
  setSelectedWeapon,
  setAttachments,
  weapons,
  handleAttachmentChange,
}: WeaponSelectProps) {
  const weaponType = slot === "primary" ? "Primary" : "Secondary";

  return (
    <>
      <div className="space-y-2">
        <Label className="text-slate-300">Select Weapon</Label>
        <Select
          value={selectedWeapon?.id.toString()}
          onValueChange={(val) => {
            const weapon = weapons.find((w) => w.id.toString() === val);
            setSelectedWeapon(weapon || null);
            setAttachments({}); // Reset attachments on weapon change
          }}
        >
          <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
            <SelectValue placeholder={`Select ${slot} weapon`} />
          </SelectTrigger>
          <SelectContent>
            {weapons
              .filter((w) => w.type === weaponType)
              .map((w) => (
                <SelectItem key={w.id} value={w.id.toString()}>
                  {w.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWeapon && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedWeapon.attachments.scope &&
            selectedWeapon.attachments.scope.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Sight</Label>
                <Select
                  onValueChange={(val) =>
                    handleAttachmentChange(slot, "scope", val)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedWeapon.attachments.scope.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Barrels */}
          {selectedWeapon.attachments.barrel &&
            selectedWeapon.attachments.barrel.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Barrel</Label>
                <Select
                  onValueChange={(val) =>
                    handleAttachmentChange(slot, "barrel", val)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedWeapon.attachments.barrel.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Grips */}
          {selectedWeapon.attachments.grip &&
            selectedWeapon.attachments.grip.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Grip</Label>
                <Select
                  onValueChange={(val) =>
                    handleAttachmentChange(slot, "grip", val)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedWeapon.attachments.grip.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Underbarrel */}
          {selectedWeapon.attachments.underbarrel &&
            selectedWeapon.attachments.underbarrel.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Underbarrel</Label>
                <Select
                  onValueChange={(val) =>
                    handleAttachmentChange(slot, "underbarrel", val)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedWeapon.attachments.underbarrel.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>
      )}
    </>
  );
}
