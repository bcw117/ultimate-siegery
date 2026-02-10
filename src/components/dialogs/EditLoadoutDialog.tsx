"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadoutDisplay } from "@/lib/types/types";
import LoadoutCustomization from "../custom/LoadoutCustomizer";
import { isNil } from "lodash";
import useSWR from "swr";
import { updateLoadout } from "@/lib/api/loadouts/mutations";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

type CreateLoadoutRequest = Omit<LoadoutDisplay, "operator" | "id"> & {
  operatorId: number;
};

export default function EditLoadoutDialog({
  loadout,
}: {
  loadout: LoadoutDisplay;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const loadoutDetails = {
    id: loadout.id,
    name: loadout.name,
    primaryWeapon: loadout.primaryWeapon,
    secondaryWeapon: loadout.secondaryWeapon,
    gadget: loadout.gadget,
  };

  const {
    isLoading,
    data: operator,
    error,
  } = useSWR(`/api/operators/${loadout.operator.id}`, fetcher);

  const onSubmit = async (editedLoadout: CreateLoadoutRequest) => {
    const result = await updateLoadout(
      loadout.id,
      loadoutDetails,
      editedLoadout
    );

    if ("error" in result) {
      toast.error("Unable to save changes to loadout");
    } else {
      router.refresh();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-xs h-8"
        onClick={() => setOpen(true)}
      >
        <PencilLine className="w-3 h-3 mr-2" />
        Edit
      </Button>
      <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Loadout</DialogTitle>
          <DialogDescription>
            Customize your operator loadout details below.
          </DialogDescription>
        </DialogHeader>
        <div>
          {operator && !isLoading && isNil(error) ? (
            <LoadoutCustomization
              selectedLoadout={loadoutDetails}
              operator={operator}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  Error getting operator details. Please try again later.
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
