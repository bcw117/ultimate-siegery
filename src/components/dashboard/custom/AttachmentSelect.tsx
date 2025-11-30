import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Attachment } from "@/lib/utils/types";
import React from "react";

export default function AttachmentSelect({
  slot,
  type,
  selectedAttachment,
  attachments,
  handleAttachmentChange,
}: {
  slot: "primary" | "secondary";
  type: "scope" | "barrel" | "grip" | "underbarrel";
  selectedAttachment: Attachment | null;
  attachments: Attachment[];
  handleAttachmentChange: (
    slot: "primary" | "secondary",
    type: "scope" | "barrel" | "grip" | "underbarrel",
    attachmentId: string
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-400">Sight</Label>
      <Select
        value={selectedAttachment?.id?.toString()}
        onValueChange={(val) => handleAttachmentChange(slot, type, val)}
      >
        <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          {attachments.map((a) => (
            <SelectItem key={a.id} value={a.id.toString()}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
