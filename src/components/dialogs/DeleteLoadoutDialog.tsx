"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteLoadout } from "@/lib/api/loadouts/mutations";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLoadoutDialog({ id }: { id: number }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    const result = await deleteLoadout(id);

    if ("error" in result) {
      toast.error("Unable to delete loadout");
    } else {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant="destructive"
        size="sm"
        className="flex-1 text-xs h-8"
      >
        <Trash2 className="w-3 h-3 mr-2" />
        Delete
      </Button>
      <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deleting Loadout</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this loadout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Yes
          </Button>
          <Button onClick={() => setOpen(false)}>No</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
