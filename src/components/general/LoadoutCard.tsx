import { removeUnderscores } from "@/lib/utils/helpers";
import Image from "next/image";
import { LoadoutDisplay, WeaponWithAttachments } from "@/lib/types/types";
import EditLoadoutDialog from "../dialogs/EditLoadoutDialog";
import DeleteLoadoutDialog from "../dialogs/DeleteLoadoutDialog";

function WeaponSpec({
    slot,
    weapon,
}: {
    slot: string;
    weapon: WeaponWithAttachments;
}) {
    const { sight, barrel, grip, underbarrel } = weapon.attachments;
    const attachments = [
        { label: "Sight", value: sight },
        { label: "Barrel", value: barrel },
        { label: "Grip", value: grip },
        { label: "Underbarrel", value: underbarrel },
    ];

    return (
        <div className="space-y-3 px-5 py-4">
            <div>
                <p className="text-sm text-muted-foreground">{slot}</p>
                <p className="text-xl font-semibold font-display">
                    {removeUnderscores(weapon.name ?? "")}
                </p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {attachments.map(({ label, value }) => (
                    <div key={label} className="contents">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd
                            className={
                                value ? undefined : "text-muted-foreground"
                            }
                        >
                            {value?.name ?? "None"}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default function LoadoutCard({
    loadout,
    editable = false,
}: {
    loadout: LoadoutDisplay;
    editable?: boolean;
}) {
    const { name, operator, gadget, primaryWeapon, secondaryWeapon } = loadout;

    return (
        <article
            data-side={operator.side}
            className="@container flex flex-col rounded-lg border border-l-4 border-l-side bg-card"
        >
            <header className="flex items-center gap-4 px-5 py-4">
                {operator.icon_url && (
                    <div className="relative size-14 shrink-0">
                        <Image
                            src={operator.icon_url}
                            fill
                            sizes="56px"
                            alt=""
                            className="object-contain"
                        />
                    </div>
                )}
                <div className="min-w-0">
                    <h2 className="truncate text-2xl leading-tight font-semibold font-display">
                        {name}
                    </h2>
                    <p className="text-sm">
                        {operator.name}{" "}
                        <span className="text-side">{operator.side}</span>
                    </p>
                </div>
            </header>

            <div className="flex items-center gap-3 border-t px-5 py-3 text-sm">
                <span className="text-muted-foreground">Gadget</span>
                {gadget.icon_url && (
                    <div className="relative size-6 shrink-0">
                        <Image
                            src={gadget.icon_url}
                            fill
                            sizes="24px"
                            alt=""
                            className="object-contain opacity-90 invert"
                        />
                    </div>
                )}
                <span>{gadget.name}</span>
            </div>

            <div className="grid flex-1 divide-y border-t @md:grid-cols-2 @md:divide-x @md:divide-y-0">
                <WeaponSpec slot="Primary" weapon={primaryWeapon} />
                <WeaponSpec slot="Secondary" weapon={secondaryWeapon} />
            </div>

            {editable && (
                <footer className="flex justify-end gap-2 border-t px-5 py-3">
                    <DeleteLoadoutDialog id={loadout.id} name={name} />
                    <EditLoadoutDialog loadout={loadout} />
                </footer>
            )}
        </article>
    );
}
