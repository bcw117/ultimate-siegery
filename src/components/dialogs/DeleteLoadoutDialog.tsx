"use client";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function DeleteLoadoutDialog({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  return (
    <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Deleting Loadout</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this loadout?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={() => onSubmit()}>
          Yes
        </Button>
        <DialogClose asChild>
          <Button>No</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
