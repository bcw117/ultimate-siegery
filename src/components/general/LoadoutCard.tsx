"use client";
import { removeUnderscores } from "@/lib/utils/helpers";
import Image from "next/image";
import { LoadoutDisplay } from "@/lib/types";
import { Button } from "../ui/button";
import { deleteLoadout } from "@/lib/api/loadouts/mutations";
import { PencilLine, Trash2 } from "lucide-react";
import EditLoadoutDialog from "../dialogs/EditLoadoutDialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { isNil } from "lodash";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DeleteLoadoutDialog from "../dialogs/DeleteLoadoutDialog";
import { Badge } from "../ui/badge";

export default function LoadoutCard({
  loadout,
  editable = false,
}: {
  loadout: LoadoutDisplay;
  editable?: boolean;
}) {
  const {
    name,
    operator,
    gadget,
    primaryWeapon: primary,
    secondaryWeapon: secondary,
  } = loadout;

  return (
    <Card className="group w-full border-white/10 bg-siege-dark/50 shadow-sm transition hover:border-siege-accent/40 hover:shadow-md animate-fade-up">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-center text-xl font-bold tracking-tight text-white">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-siege-dark/60 p-4 ring-1 ring-white/10 flex flex-col items-center gap-3 h-full">
          <div className="w-full">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
              Operator
            </h4>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-white truncate">
                {operator.name}
              </p>
              <Badge className="rounded-full bg-siege-accent/20 text-[10px] font-bold text-siege-accent">
                {operator.side}
              </Badge>
            </div>
          </div>
          {operator.icon_url && (
            <div className="relative h-16 w-16">
              <Image
                src={operator.icon_url}
                fill
                alt={`${operator.name} icon`}
                className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              />
            </div>
          )}
        </div>

        <div className="rounded-xl bg-siege-dark/60 p-4 ring-1 ring-white/10 flex flex-col items-center gap-3 h-full">
          <div className="w-full">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
              Gadget
            </h4>
            <p className="text-sm font-bold text-white truncate">
              {gadget.name}
            </p>
          </div>
          {gadget.icon_url && (
            <div className="relative h-14 w-14">
              <Image
                src={gadget.icon_url}
                fill
                alt={`${gadget.name} icon`}
                className="object-contain invert opacity-80"
              />
            </div>
          )}
        </div>

        {[primary, secondary].map((weapon, idx) => (
          <div
            key={weapon.id}
            className="rounded-xl bg-siege-dark/60 p-4 ring-1 ring-white/10 flex flex-col h-full"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
              {idx === 0 ? "Primary" : "Secondary"}
            </h4>
            <p className="text-sm font-bold text-white leading-tight mb-2 truncate">
              {removeUnderscores(weapon.name ?? "")}
            </p>
            <ul className="space-y-1">
              {[
                weapon.attachments.sight,
                weapon.attachments.barrel,
                weapon.attachments.grip,
                weapon.attachments.underbarrel,
              ]
                .filter((a) => !isNil(a))
                .map((attachment) => (
                  <li
                    key={attachment!.id}
                    className="text-[10px] text-white/60 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-siege-accent/50" />
                    {attachment!.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </CardContent>

      {editable && (
        <CardFooter className="flex gap-2 pt-2 border-t border-white/5">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 text-xs h-8"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DeleteLoadoutDialog onSubmit={() => deleteLoadout(loadout.id)} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-xs h-8"
              >
                <PencilLine className="w-3 h-3 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <EditLoadoutDialog loadout={loadout} />
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}
