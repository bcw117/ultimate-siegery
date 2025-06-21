import React from "react";
import { removeUnderscores, toTitleCase } from "@/utils/helpers";
import PaginationControls from "@/components/PaginationControls";
import { getLoadouts } from "./actions";
import Image from "next/image";

export default async function Loadouts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const cursor = params["cursor"] ?? null;
  const getNext = params["getNext"] ?? "true";

  const { loadouts, icons, prev_cursor, next_cursor } = await getLoadouts(
    cursor,
    getNext
  );

  return (
    <div className="min-h-screen flex flex-col items-center mx-auto gap-y-20 py-16">
      Loadouts
      {loadouts.map((loadout, idx) => {
        return (
          <div
            key={idx}
            className="rounded-lg bg-siege-dark/50 p-6 animate-fade-up w-3xl"
          >
            <h3 className="text-white text-xl font-medium mb-6 text-center">
              Loadout {idx}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                <h4 className="text-white/70 text-sm mb-2">Operator</h4>
                <p className="text-white text-lg font-semibold">
                  {loadout.operator?.name}
                </p>
                <div className="mt-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-siege-accent/20 text-siege-accent">
                  {loadout.operator?.side === "A" ? "Attacker" : "Defender"}
                </div>
                {icons ? (
                  <Image
                    src={icons[idx]}
                    width={500}
                    height={500}
                    alt="Operator Image Icon"
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                <h4 className="text-white/70 text-sm mb-2">Primary Weapon</h4>
                <p className="text-white text-lg font-semibold">
                  {removeUnderscores(loadout.weapons.pweapon_name ?? "")}
                </p>
              </div>

              <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                <h4 className="text-white/70 text-sm mb-2">Secondary Weapon</h4>
                <p className="text-white text-lg font-semibold">
                  {removeUnderscores(loadout.weapons.sweapon_name ?? "")}
                </p>
              </div>

              <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                <h4 className="text-white/70 text-sm mb-2">Gadget</h4>
                <p className="text-white text-lg font-semibold">
                  {toTitleCase(loadout.gadget ?? "")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <PaginationControls prev_cursor={prev_cursor} next_cursor={next_cursor} />
    </div>
  );
}
