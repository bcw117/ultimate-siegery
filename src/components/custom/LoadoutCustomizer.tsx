"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    OperatorFullLoadout,
    GadgetRecord,
    WeaponWithAttachments,
    WeaponWithAllAttachments,
    LoadoutDisplay,
    WeaponSlot,
} from "@/lib/types/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import WeaponSelect from "./WeaponSelect";
import GadgetSelect from "./GadgetSelect";
import StatPips from "./StatPips";
import Image from "next/image";
import { Save } from "lucide-react";
import { isNil } from "lodash";

type CreateLoadoutRequest = Omit<LoadoutDisplay, "operator" | "id"> & {
    operatorId: number;
};

export type CustomizationFields = {
    id: number;
    name: string;
    primaryWeapon: WeaponWithAttachments;
    secondaryWeapon: WeaponWithAttachments;
    gadget: GadgetRecord;
};

function withoutAttachments(
    weapon: WeaponWithAllAttachments | undefined
): WeaponWithAttachments | undefined {
    if (isNil(weapon)) {
        return undefined;
    }

    return {
        ...weapon,
        attachments: {
            sight: undefined,
            grip: undefined,
            barrel: undefined,
            underbarrel: undefined,
        },
    };
}

export default function LoadoutCustomizer({
    selectedLoadout,
    operator,
    onSubmit,
}: {
    selectedLoadout?: CustomizationFields;
    operator: OperatorFullLoadout;
    // Resolves to true when the loadout was saved
    onSubmit: (loadoutParams: CreateLoadoutRequest) => Promise<boolean>;
}) {
    const isEditing = !isNil(selectedLoadout);
    const primaryWeapons = useMemo(
        () =>
            operator.operatorWeapons.filter(
                (weapon) => weapon.slot === WeaponSlot.Primary
            ),
        [operator]
    );
    const secondaryWeapons = useMemo(
        () =>
            operator.operatorWeapons.filter(
                (weapon) => weapon.slot === WeaponSlot.Secondary
            ),
        [operator]
    );

    const gadgets = operator.operatorGadgets;
    const [isSaving, setIsSaving] = useState(false);

    // New loadouts start on the operator's first weapons and gadget
    const [loadoutName, setLoadoutName] = useState(selectedLoadout?.name ?? "");
    const [selectedPrimary, setSelectedPrimary] = useState(
        () =>
            selectedLoadout?.primaryWeapon ??
            withoutAttachments(primaryWeapons[0])
    );
    const [selectedSecondary, setSelectedSecondary] = useState(
        () =>
            selectedLoadout?.secondaryWeapon ??
            withoutAttachments(secondaryWeapons[0])
    );
    const [selectedGadget, setSelectedGadget] = useState<
        GadgetRecord | undefined
    >(() => selectedLoadout?.gadget ?? gadgets[0]);

    const hasValidAttachments = (selected: WeaponWithAttachments) => {
        const { attachments: weaponAttachments } = selected;
        return Object.values(weaponAttachments).every(
            (attachment) => !isNil(attachment)
        );
    };

    const handleSubmit = async () => {
        if (
            !operator ||
            !selectedPrimary ||
            !selectedSecondary ||
            !selectedGadget ||
            !hasValidAttachments(selectedPrimary) ||
            !hasValidAttachments(selectedSecondary)
        ) {
            toast.error(
                "Choose a weapon, every attachment and a gadget first."
            );
            return;
        }

        if (!loadoutName.trim()) {
            toast.error("Give this loadout a name first.");
            return;
        }

        setIsSaving(true);
        let saved = false;
        try {
            saved = await onSubmit({
                name: loadoutName,
                operatorId: operator.id,
                primaryWeapon: selectedPrimary,
                secondaryWeapon: selectedSecondary,
                gadget: selectedGadget,
            });
        } finally {
            // On success the parent navigates away or closes, so keep the button disabled
            if (!saved) {
                setIsSaving(false);
            }
        }
    };

    return (
        <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className="grid gap-6 md:grid-cols-2">
                <Card
                    data-side={operator.side}
                    className="border-l-4 border-l-side"
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-4">
                            {operator.icon_url && (
                                <div className="relative size-12 shrink-0">
                                    <Image
                                        src={operator.icon_url}
                                        alt=""
                                        fill
                                        sizes="48px"
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="text-3xl leading-none font-semibold font-display">
                                    {operator.name}
                                </p>
                                <p className="text-sm font-normal text-side">
                                    {operator.side}
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-3">
                            <StatPips label="Health" value={operator.health} />
                            <StatPips label="Speed" value={operator.speed} />
                            <div className="space-y-1 border-t pt-3">
                                <dt className="text-sm text-muted-foreground">
                                    Ability
                                </dt>
                                <dd>{operator.unique_ability}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-display">
                            Gadget
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GadgetSelect
                            selectedGadget={selectedGadget}
                            setSelectedGadget={setSelectedGadget}
                            gadgets={gadgets}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-display">
                        Primary weapon
                    </CardTitle>
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-display">
                        Secondary weapon
                    </CardTitle>
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

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-end">
                <div className="w-full space-y-2 sm:max-w-sm">
                    <Label htmlFor="loadout-name">Loadout name</Label>
                    <Input
                        id="loadout-name"
                        value={loadoutName}
                        onChange={(e) => setLoadoutName(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={isSaving}>
                    <Save />
                    {isSaving
                        ? "Saving..."
                        : isEditing
                          ? "Save changes"
                          : "Save loadout"}
                </Button>
            </div>
        </form>
    );
}
