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
import { removeUnderscores } from "@/lib/utils/helpers";

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
        "sight" | "barrel" | "grip" | "underbarrel";
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
        <Label htmlFor={`${slot}-weapon`}>Weapon</Label>
        <Select
          value={selectedWeapon?.id.toString()}
          onValueChange={(val) => handleWeaponUpdate(val)}
        >
          <SelectTrigger id={`${slot}-weapon`} className="w-full sm:max-w-sm">
            <SelectValue placeholder={`Choose ${slot} weapon`} />
          </SelectTrigger>
          <SelectContent>
            {weapons.map((w) => (
              <SelectItem key={w.id} value={w.id.toString()}>
                {removeUnderscores(w.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWeapon && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {!isNil(sights) && (
            <AttachmentSelect
              id={`${slot}-sight`}
              type="sight"
              selectedAttachment={selectedWeapon.attachments.sight}
              attachments={sights}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(barrels) && (
            <AttachmentSelect
              id={`${slot}-barrel`}
              type="barrel"
              selectedAttachment={selectedWeapon.attachments.barrel}
              attachments={barrels}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(grips) && (
            <AttachmentSelect
              id={`${slot}-grip`}
              type="grip"
              selectedAttachment={selectedWeapon.attachments.grip}
              attachments={grips}
              handleAttachmentChange={handleAttachmentChange}
            />
          )}

          {!isNil(underbarrels) && (
            <AttachmentSelect
              id={`${slot}-underbarrel`}
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
