import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Attachment, WeaponSelection } from "@/lib/utils/types";
import React from "react";
import { Label } from "@/components/ui/label";
import AttachmentSelect from "./AttachmentSelect";

type WeaponSelectProps = {
  slot: "primary" | "secondary";
  selectedWeapon: WeaponSelection | null;
  setSelectedWeapon: (weapon: WeaponSelection | null) => void;
  selectedAttachment: {
    scope?: Attachment;
    barrel?: Attachment;
    grip?: Attachment;
    underbarrel?: Attachment;
  };
  setAttachments: React.Dispatch<
    React.SetStateAction<{
      scope?: Attachment;
      barrel?: Attachment;
      grip?: Attachment;
      underbarrel?: Attachment;
    }>
  >;
  weapons: WeaponSelection[];
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
  selectedAttachment,
  setAttachments,
  weapons,
  handleAttachmentChange,
}: WeaponSelectProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="text-slate-300">Select Weapon</Label>
        <Select
          value={selectedWeapon?.id.toString()}
          onValueChange={(val) => {
            const weapon = weapons.find((w) => w.id.toString() === val);
            setSelectedWeapon(weapon || null);
            setAttachments({});
          }}
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
          {/* Scope */}
          {selectedWeapon.attachments.scope &&
            selectedWeapon.attachments.scope.length > 0 && (
              <AttachmentSelect
                slot={slot}
                type="scope"
                selectedAttachment={selectedAttachment.scope ?? null}
                attachments={selectedWeapon.attachments.scope}
                handleAttachmentChange={handleAttachmentChange}
              />
            )}

          {/* Barrels */}
          {selectedWeapon.attachments.barrel &&
            selectedWeapon.attachments.barrel.length > 0 && (
              <AttachmentSelect
                slot={slot}
                type="barrel"
                selectedAttachment={selectedAttachment.barrel ?? null}
                attachments={selectedWeapon.attachments.barrel}
                handleAttachmentChange={handleAttachmentChange}
              />
            )}

          {/* Grips */}
          {selectedWeapon.attachments.grip &&
            selectedWeapon.attachments.grip.length > 0 && (
              <AttachmentSelect
                slot={slot}
                type="grip"
                selectedAttachment={selectedAttachment.grip ?? null}
                attachments={selectedWeapon.attachments.grip}
                handleAttachmentChange={handleAttachmentChange}
              />
            )}

          {/* Underbarrel */}
          {selectedWeapon.attachments.underbarrel &&
            selectedWeapon.attachments.underbarrel.length > 0 && (
              <AttachmentSelect
                slot={slot}
                type="underbarrel"
                selectedAttachment={selectedAttachment.underbarrel ?? null}
                attachments={selectedWeapon.attachments.underbarrel}
                handleAttachmentChange={handleAttachmentChange}
              />
            )}
        </div>
      )}
    </>
  );
}
