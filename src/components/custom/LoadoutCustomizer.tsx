import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveLoadout, updateLoadout } from "@/lib/api/loadouts/mutations";
import {
  OperatorFullLoadout,
  GadgetRecord,
  WeaponWithAttachments,
} from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import WeaponSelect from "./WeaponSelect";
import GadgetSelect from "./GadgetSelect";
import Image from "next/image";
import { Save } from "lucide-react";
import { isNil } from "lodash";

export type CustomizationFields = {
  id: number;
  name: string;
  primaryWeapon: WeaponWithAttachments;
  secondaryWeapon: WeaponWithAttachments;
  gadget: GadgetRecord;
};

export default function LoadoutCustomizer({
  selectedLoadout,
  operator,
}: {
  selectedLoadout?: CustomizationFields;
  operator: OperatorFullLoadout;
}) {
  const isEditing = !isNil(selectedLoadout);
  const primaryWeapons = useMemo(
    () =>
      operator.operatorWeapons.filter((weapon) => weapon.slot === "Primary"),
    [operator]
  );
  const secondaryWeapons = useMemo(
    () =>
      operator.operatorWeapons.filter((weapon) => weapon.slot === "Secondary"),
    [operator]
  );

  const gadgets = operator.operatorGadgets;
  const [isSaving, setIsSaving] = useState(false);

  const [loadoutName, setLoadoutName] = useState(selectedLoadout?.name ?? "");
  const [selectedPrimary, setSelectedPrimary] = useState<
    WeaponWithAttachments | undefined
  >(selectedLoadout?.primaryWeapon);
  const [selectedSecondary, setSelectedSecondary] = useState<
    WeaponWithAttachments | undefined
  >(selectedLoadout?.secondaryWeapon);

  const [selectedGadget, setSelectedGadget] = useState<
    GadgetRecord | undefined
  >(selectedLoadout?.gadget);

  const hasValidAttachments = (selected: WeaponWithAttachments) => {
    const { attachments: weaponAttachments } = selected;
    return Object.values(weaponAttachments).every(
      (attachment) => !isNil(attachment)
    );
  };

  const handleSave = async () => {
    try {
      if (
        !operator ||
        !selectedPrimary ||
        !selectedSecondary ||
        !selectedGadget
      ) {
        toast.error(
          "Please fill out all options for the loadout selection first"
        );
        return;
      }

      if (
        !hasValidAttachments(selectedPrimary) ||
        !hasValidAttachments(selectedSecondary)
      ) {
        toast.error(
          "Please fill out all options for the loadout selection first"
        );
        return;
      }

      if (!loadoutName.trim()) {
        toast.error("Please enter a loadout name");
        return;
      }

      setIsSaving(true);

      const newLoadout = {
        name: loadoutName,
        operatorId: operator.id,
        primaryWeapon: selectedPrimary,
        secondaryWeapon: selectedSecondary,
        gadget: selectedGadget,
      };

      if (isEditing) {
        await updateLoadout(selectedLoadout.id, selectedLoadout, newLoadout);

        return;
      }

      const result = await saveLoadout(newLoadout);

      if (result.ok) {
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
    if (!isNil(selectedLoadout)) {
      setSelectedPrimary(selectedLoadout.primaryWeapon);
      setSelectedSecondary(selectedLoadout.secondaryWeapon);
      setSelectedGadget(selectedLoadout.gadget);
    } else {
      if (primaryWeapons.length > 0) {
        setSelectedPrimary({
          ...primaryWeapons[0],
          attachments: {
            sight: undefined,
            grip: undefined,
            barrel: undefined,
            underbarrel: undefined,
          },
        });
      }
      if (secondaryWeapons.length > 0) {
        setSelectedSecondary({
          ...secondaryWeapons[0],
          attachments: {
            sight: undefined,
            grip: undefined,
            barrel: undefined,
            underbarrel: undefined,
          },
        });
      }
      if (gadgets.length > 0) {
        setSelectedGadget(gadgets[0]);
      }
    }
  }, [primaryWeapons, secondaryWeapons, selectedLoadout, gadgets]);

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
          {isSaving ? "Saving..." : isEditing ? "Edit Loadout" : "Save Loadout"}
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
              weapons={primaryWeapons}
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
              weapons={secondaryWeapons}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
