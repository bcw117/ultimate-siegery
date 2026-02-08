import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AttachmentRecord,
  WeaponWithAllAttachments,
  WeaponWithAttachments,
} from "@/lib/types/types";
import { Label } from "@/components/ui/label";
import AttachmentSelect from "./AttachmentSelect";
import { isNil } from "lodash";
import { useCallback } from "react";

type WeaponSelectProps = {
  slot: "primary" | "secondary";
  selectedWeapon: WeaponWithAttachments | undefined;
  setSelectedWeapon: (weapon: WeaponWithAttachments | undefined) => void;
  weapons: WeaponWithAllAttachments[];
};

export default function WeaponSelect({
  slot,
  selectedWeapon,
  setSelectedWeapon,
  weapons,
}: WeaponSelectProps) {
  const weaponAttachments = weapons
    .filter((weapon) => weapon.id === selectedWeapon?.id)
    .flatMap(({ attachments }) => attachments);

  const sights = weaponAttachments.filter(
    (attachment) => attachment.type === "Sight"
  );
  const grips = weaponAttachments.filter(
    (attachment) => attachment.type === "Grip"
  );
  const barrels = weaponAttachments.filter(
    (attachment) => attachment.type === "Barrel"
  );
  const underbarrels = weaponAttachments.filter(
    (attachment) => attachment.type === "Underbarrel"
  );

  const handleWeaponUpdate = (val: string) => {
    const weapon = weapons.find((w) => w.id.toString() === val);
    if (isNil(weapon)) {
      setSelectedWeapon(undefined);
      return;
    }

    setSelectedWeapon({
      ...weapon,
      attachments: {
        sight: undefined,
        grip: undefined,
        barrel: undefined,
        underbarrel: undefined,
      },
    });
  };

  const handleAttachmentChange = useCallback(
    (attachment: AttachmentRecord | undefined) => {
      if (isNil(selectedWeapon) || isNil(attachment)) {
        return;
      }
      const attachmentType = attachment.type.toLowerCase() as
        | "sight"
        | "barrel"
        | "grip"
        | "underbarrel";
      setSelectedWeapon({
        ...selectedWeapon,
        attachments: {
          ...selectedWeapon.attachments,
          [attachmentType]: attachment,
        },
      });
    },
    [selectedWeapon, setSelectedWeapon]
  );

  return (
    <>
      <div className="space-y-2">
        <Label className="text-slate-300">Select Weapon</Label>
        <Select
          value={selectedWeapon?.id.toString()}
          onValueChange={(val) => handleWeaponUpdate(val)}
        >
          <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
            <SelectValue placeholder={`Select ${slot} weapon`} />
          </SelectTrigger>
          <SelectContent>
            {weapons.map((w) => (
              <SelectItem key={w.id} value={w.id.toString()}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWeapon && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!isNil(sights) && (
            <AttachmentSelect
              type="sight"
              selectedAttachment={selectedWeapon.attachments.sight}
              attachments={sights}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(barrels) && (
            <AttachmentSelect
              type="barrel"
              selectedAttachment={selectedWeapon.attachments.barrel}
              attachments={barrels}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(grips) && (
            <AttachmentSelect
              type="grip"
              selectedAttachment={selectedWeapon.attachments.grip}
              attachments={grips}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(underbarrels) && (
            <AttachmentSelect
              type="underbarrel"
              selectedAttachment={selectedWeapon.attachments.underbarrel}
              attachments={underbarrels}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}
        </div>
      )}
    </>
  );
}
