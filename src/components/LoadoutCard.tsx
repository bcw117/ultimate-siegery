import React from "react";
import { removeUnderscores } from "@/utils/helpers";
import Image from "next/image";
import { Gadget, Operator, Weapon } from "@/utils/types";

export default function LoadoutCard({
  name,
  operator,
  primary,
  secondary,
  gadget,
}: {
  name: string;
  operator: Operator | null;
  primary: Weapon | null;
  secondary: Weapon | null;
  gadget: Gadget | null;
}) {
  const primaryAttachments = primary?.attachments;
  const secondaryAttachments = secondary?.attachments;

  return (
    <div className="group relative flex h-full w-full flex-col rounded-xl border border-white/10 bg-siege-dark/50 p-5 shadow-sm transition hover:border-siege-accent/40 hover:shadow-md animate-fade-up">
      <h3 className="mb-4 line-clamp-1 text-center text-lg font-semibold tracking-wide text-white">
        {name}
      </h3>

      {/* Internal grid: limit to 2 cols max to avoid overly narrow boxes causing text overlap */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Operator */}
        <div className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Operator
          </h4>
          <p className="text-sm font-semibold text-white break-words leading-snug">
            {operator?.name}
          </p>
          <div className="mt-1 inline-flex items-center rounded-full bg-siege-accent/15 px-2 py-0.5 text-[10px] font-medium text-siege-accent">
            {operator?.side === "A" ? "Attacker" : "Defender"}
          </div>
          {operator?.icon_url && (
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
          <p className="text-sm font-semibold text-white break-words leading-snug">
            {gadget?.name ?? ""}
          </p>
          {gadget?.icon_url && (
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
        {/* Primary */}
        <div className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Primary
          </h4>
          <p className="text-sm font-semibold text-white break-words leading-snug">
            {removeUnderscores(primary?.name ?? "")}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-white/70">
            {primaryAttachments?.scope?.name && (
              <li>{primaryAttachments?.scope?.name}</li>
            )}
            {primaryAttachments?.barrel?.name && (
              <li>{primaryAttachments?.barrel?.name}</li>
            )}
            {primaryAttachments?.grip?.name && (
              <li>{primaryAttachments?.grip?.name}</li>
            )}
            {primaryAttachments?.underbarrel?.name && (
              <li>{primaryAttachments?.underbarrel?.name}</li>
            )}
          </ul>
        </div>

        {/* Secondary */}
        <div className="min-w-0 rounded-lg bg-siege-dark/60 p-4 ring-1 ring-inset ring-white/10">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Secondary
          </h4>
          <p className="text-sm font-semibold text-white break-words leading-snug">
            {removeUnderscores(secondary?.name ?? "")}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-white/70">
            {secondaryAttachments?.scope?.name && (
              <li>{secondaryAttachments?.scope?.name}</li>
            )}
            {secondaryAttachments?.barrel?.name && (
              <li>{secondaryAttachments?.barrel?.name}</li>
            )}
            {secondaryAttachments?.grip?.name && (
              <li>{secondaryAttachments?.grip?.name}</li>
            )}
            {secondaryAttachments?.underbarrel?.name && (
              <li>{secondaryAttachments?.underbarrel?.name}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
