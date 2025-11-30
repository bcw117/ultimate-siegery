import React from "react";
import { removeUnderscores } from "@/lib/utils/helpers";
import Image from "next/image";
import { Loadout, Weapon } from "@/lib/utils/types";
import { Button } from "./ui/button";
import { deleteLoadout } from "@/lib/api/db/loadouts/mutations";
import { Trash2 } from "lucide-react";
import EditLoadoutDialog from "./dialogs/EditLoadout";

export default function LoadoutCard({
  id,
  loadout,
}: {
  id?: number;
  loadout: Loadout;
}) {
  const {
    name,
    operator,
    gadget,
    primary_weapon: primary,
    secondary_weapon: secondary,
  } = loadout;

  return (
    <div className="group relative flex h-full w-full flex-col rounded-xl border border-white/10 bg-siege-dark/50 p-5 shadow-sm transition hover:border-siege-accent/40 hover:shadow-md animate-fade-up">
      <h3 className="mb-4 line-clamp-1 text-center text-lg font-semibold tracking-wide text-white">
        {name}
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Operator
          </h4>
          <p className="text-sm font-semibold text-white wrap-break-word leading-snug">
            {operator.name}
          </p>
          <div className="mt-1 inline-flex items-center rounded-full bg-siege-accent/15 px-2 py-0.5 text-[10px] font-medium text-siege-accent">
            {operator.side === "A" ? "Attacker" : "Defender"}
          </div>
          {operator.icon_url && (
            <div className="mt-3 flex items-center justify-center">
              <Image
                src={operator.icon_url}
                width={120}
                height={120}
                alt="Operator Image Icon"
                className="h-24 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}
        </div>
        <div className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Gadget
          </h4>
          <p className="text-sm font-semibold text-white wrap-break-words leading-snug">
            {gadget.name ?? ""}
          </p>
          {gadget.icon_url && (
            <div className="mt-3 flex items-center justify-center">
              <Image
                src={gadget.icon_url}
                width={120}
                height={120}
                alt="Gadget Image Icon"
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}
        </div>
        {[primary, secondary].map((weapon: Weapon) => (
          <div
            key={weapon.id}
            className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10"
          >
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
              {weapon.type}
            </h4>
            <p className="text-sm font-semibold text-white wrap-break-word leading-snug">
              {removeUnderscores(weapon.name ?? "")}
            </p>
            <ul className="mt-1 space-y-0.5 text-xs text-white/70">
              {weapon.attachments.scope?.name && (
                <li>{weapon.attachments.scope?.name}</li>
              )}
              {weapon.attachments.barrel?.name && (
                <li>{weapon.attachments?.barrel?.name}</li>
              )}
              {weapon.attachments.grip?.name && (
                <li>{weapon.attachments.grip?.name}</li>
              )}
              {weapon.attachments.underbarrel?.name && (
                <li>{weapon.attachments.underbarrel?.name}</li>
              )}
            </ul>
          </div>
        ))}
        {id && (
          <>
            <EditLoadoutDialog loadout={loadout} />
            <Button
              variant="destructive"
              onClick={deleteLoadout.bind(null, id)}
            >
              <span className="flex flex-row items-center gap-x-2">
                <Trash2 />
                <span>Delete</span>
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
