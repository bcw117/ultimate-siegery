import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveLoadout } from "@/lib/api/db/loadouts/mutations";
import {
  Attachment,
  Gadget,
  Operator,
  Weapon,
  WeaponSlot,
} from "@/lib/utils/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import WeaponSelect from "./WeaponSelect";
import GadgetSelect from "./GadgetSelect";
import Image from "next/image";
import { Save } from "lucide-react";

export default function LoadoutCustomization({
  operator,
  gadgets,
  weapons,
}: {
  operator: Operator;
  gadgets: Gadget[];
  weapons: WeaponSlot[];
}) {
  const [loadoutName, setLoadoutName] = useState("");
  const [selectedPrimary, setSelectedPrimary] = useState<WeaponSlot | null>(
    null
  );
  const [selectedSecondary, setSelectedSecondary] = useState<WeaponSlot | null>(
    null
  );
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [primaryAttachments, setPrimaryAttachments] = useState<{
    scope?: Attachment;
    barrel?: Attachment;
    grip?: Attachment;
    underbarrel?: Attachment;
  }>({});

  const [secondaryAttachments, setSecondaryAttachments] = useState<{
    scope?: Attachment;
    barrel?: Attachment;
    grip?: Attachment;
    underbarrel?: Attachment;
  }>({});

  const handleAttachmentChange = (
    slot: "primary" | "secondary",
    type: "scope" | "barrel" | "grip" | "underbarrel",
    attachmentId: string
  ) => {
    const weapon = slot === "primary" ? selectedPrimary : selectedSecondary;
    if (!weapon) return;

    const availableAttachments = weapon.attachments[type] || [];
    const selected = availableAttachments.find(
      (a) => a.id.toString() === attachmentId
    );

    if (slot === "primary") {
      setPrimaryAttachments((prev) => ({ ...prev, [type]: selected }));
    } else {
      setSecondaryAttachments((prev) => ({ ...prev, [type]: selected }));
    }
  };

  const handleSave = async () => {
    if (
      !operator ||
      !selectedPrimary ||
      !selectedSecondary ||
      !selectedGadget
    ) {
      toast.error("Please complete the loadout selection first");
      return;
    }

    if (!loadoutName.trim()) {
      toast.error("Please enter a loadout name");
      return;
    }

    setIsSaving(true);

    try {
      // Construct the full weapon objects with attachments
      const primaryWeapon: Weapon = {
        ...selectedPrimary,
        attachments: primaryAttachments,
      };

      const secondaryWeapon: Weapon = {
        ...selectedSecondary,
        attachments: secondaryAttachments,
      };

      const result = await saveLoadout({
        name: loadoutName,
        operator: operator,
        primary_weapon: primaryWeapon,
        secondary_weapon: secondaryWeapon,
        gadget: selectedGadget,
      });

      if (result.success) {
        toast.success("Loadout saved successfully!");
      } else {
        toast.error(result.error || "Failed to save loadout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const primaries = weapons.filter((w: WeaponSlot) => w.type === "Primary");
    const secondaries = weapons.filter(
      (w: WeaponSlot) => w.type === "Secondary"
    );
    if (primaries.length > 0) setSelectedPrimary(primaries[0]);
    if (secondaries.length > 0) setSelectedSecondary(secondaries[0]);
    if (gadgets.length > 0) setSelectedGadget(gadgets[0]);
  }, [gadgets, weapons]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Loadout Name"
            value={loadoutName}
            onChange={(e) => setLoadoutName(e.target.value)}
            className="bg-slate-900/50 border-white/10 text-white"
          />
        </div>
        <Button
          variant="outline"
          className="border-white/20 hover:border-white/50 text-white bg-transparent cursor-pointer"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Loadout"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-siege-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-4">
              {operator.icon_url && (
                <div className="relative w-12 h-12">
                  <Image
                    src={operator.icon_url}
                    alt={operator.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {operator.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Side
                </span>
                <p className="font-medium text-white">{operator.side}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Speed
                </span>
                <p className="font-medium text-white">{operator.speed}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Health
                </span>
                <p className="font-medium text-white">{operator.health}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Ability
                </span>
                <p className="font-medium text-white">
                  {operator.unique_ability}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-siege-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Gadget</CardTitle>
          </CardHeader>
          <CardContent>
            <GadgetSelect
              selectedGadget={selectedGadget}
              setSelectedGadget={setSelectedGadget}
              gadgets={gadgets}
            />
          </CardContent>
        </Card>
        <Card className="bg-siege-dark/50 border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Primary Weapon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WeaponSelect
              slot="primary"
              selectedWeapon={selectedPrimary}
              setSelectedWeapon={setSelectedPrimary}
              setAttachments={setPrimaryAttachments}
              weapons={weapons}
              handleAttachmentChange={handleAttachmentChange}
            />
          </CardContent>
        </Card>
        <Card className="bg-siege-dark/50 border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Secondary Weapon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WeaponSelect
              slot="secondary"
              selectedWeapon={selectedSecondary}
              setSelectedWeapon={setSelectedSecondary}
              setAttachments={setSecondaryAttachments}
              weapons={weapons}
              handleAttachmentChange={handleAttachmentChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
