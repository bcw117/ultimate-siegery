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
import { Skeleton } from "../ui/skeleton";
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
        try {
            const result = await updateLoadout(
                loadout.id,
                loadoutDetails,
                editedLoadout
            );

            if ("error" in result) {
                toast.error("Couldn't save your changes. Try again.");
                return false;
            }

            toast.success("Changes saved");
            router.refresh();
            setOpen(false);
            return true;
        } catch {
            toast.error("Couldn't save your changes. Try again.");
            return false;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PencilLine />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold font-display">
                        Edit loadout
                    </DialogTitle>
                    <DialogDescription>
                        Change the weapons, attachments, gadget or name, then
                        save.
                    </DialogDescription>
                </DialogHeader>
                {operator && !isLoading && isNil(error) ? (
                    <LoadoutCustomization
                        selectedLoadout={loadoutDetails}
                        operator={operator}
                        onSubmit={onSubmit}
                    />
                ) : isLoading ? (
                    <div aria-busy className="grid gap-6 md:grid-cols-2">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-40 md:col-span-2" />
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Couldn&apos;t load this operator&apos;s weapons and
                        gadgets. Close this and try again.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
