"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteLoadout } from "@/lib/api/loadouts/mutations";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLoadoutDialog({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteLoadout(id);
    setIsDeleting(false);

    if ("error" in result) {
      toast.error("Couldn't delete this loadout. Try again.");
    } else {
      setOpen(false);
      toast.success("Loadout deleted");
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete loadout?</DialogTitle>
          <DialogDescription>
            &ldquo;{name}&rdquo; will be removed from your saved loadouts. You
            can&apos;t undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete loadout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
