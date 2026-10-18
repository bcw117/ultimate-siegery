"use client";

import { useState } from "react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { OperatorRosterEntry, Side } from "@/lib/types/types";
import { cn } from "@/lib/utils/helpers";
import ProtectedLink from "./ProtectedLink";

const rollHref = ({ side, id }: OperatorRosterEntry) =>
  `/create-loadout/random?side=${side.toLowerCase()}&operator=${id}`;

function SideColumn({
  side,
  operators,
  pick,
  signedIn,
}: {
  side: Side;
  operators: OperatorRosterEntry[];
  pick: OperatorRosterEntry | undefined;
  signedIn: boolean;
}) {
  // Starts on the random pick; clicking a badge only changes the selection,
  // and the roll button is what actually navigates (or asks to sign in)
  const [selected, setSelected] = useState(pick);
  const [hasChosen, setHasChosen] = useState(false);
  const choose = (op: OperatorRosterEntry) => {
    setSelected(op);
    setHasChosen(true);
  };

  return (
    <div data-side={side} className="flex flex-col gap-5 p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-4xl leading-none font-extrabold text-side font-display">
          {side}s
        </h3>
        <p className="text-sm text-muted-foreground">
          {operators.length} operators
        </p>
      </div>

      <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8">
        {operators.map((op) => {
          const isSelected = op.id === selected?.id;
          return (
            <li key={op.id}>
              <button
                type="button"
                title={op.name}
                aria-pressed={isSelected}
                onClick={() => choose(op)}
                className="group block aspect-square w-full cursor-pointer rounded-md border bg-background p-1.5 transition outline-none hover:-translate-y-1 hover:-rotate-3 hover:border-side hover:bg-side/10 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-side aria-pressed:bg-side/15"
              >
                <span className="sr-only">{op.name}</span>
                {op.icon_url && (
                  <span className="relative block size-full">
                    <Image
                      src={op.icon_url}
                      alt=""
                      fill
                      sizes="48px"
                      className={cn(
                        "object-contain opacity-45 grayscale transition group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0",
                        isSelected && "opacity-100 grayscale-0",
                        // The random pick lights up shortly after load; a
                        // chosen operator pops straight away
                        isSelected &&
                          (hasChosen
                            ? "animate-[pick-reveal_400ms_ease-out_both]"
                            : "animate-[pick-reveal_700ms_ease-out_700ms_both]")
                      )}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm" aria-live="polite">
            <span className="text-muted-foreground">
              {hasChosen ? "Selected: " : "Picked for you: "}
            </span>
            <span className="font-medium">{selected.name}</span>
          </p>
          <ProtectedLink
            href={rollHref(selected)}
            signedIn={signedIn}
            className={buttonVariants({ size: "sm" })}
          >
            Roll {selected.name}&apos;s loadout
          </ProtectedLink>
        </div>
      )}
    </div>
  );
}

// The in-game operator select screen: every operator, split by side. Each
// side starts with a random pick that the user can change before rolling.
export default function OperatorWall({
  operators,
  picks,
  signedIn,
}: {
  operators: OperatorRosterEntry[];
  picks: Partial<Record<Side, OperatorRosterEntry>>;
  signedIn: boolean;
}) {
  return (
    <section
      aria-labelledby="operator-select"
      className="overflow-hidden rounded-lg border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 text-sm md:px-6">
        <h2 id="operator-select" className="font-medium">
          Operator select
        </h2>
        <p className="text-muted-foreground">
          Choose an operator, then roll their loadout
        </p>
      </div>
      <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
        {Object.values(Side).map((side) => (
          <SideColumn
            key={side}
            side={side}
            operators={operators.filter((op) => op.side === side)}
            pick={picks[side]}
            signedIn={signedIn}
          />
        ))}
      </div>
    </section>
  );
}
