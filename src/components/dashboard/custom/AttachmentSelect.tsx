import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTitleCase } from "@/lib/utils/helpers";
import { AttachmentRecord } from "@/db/types";

export default function AttachmentSelect({
  type,
  selectedAttachment,
  attachments,
  handleAttachmentChange,
}: {
  type: "scope" | "barrel" | "grip" | "underbarrel";
  selectedAttachment: AttachmentRecord | undefined;
  attachments: AttachmentRecord[];
  handleAttachmentChange: (attachment: AttachmentRecord | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-400">{toTitleCase(type)}</Label>
      <Select
        value={selectedAttachment?.id.toString()}
        onValueChange={(val) => {
          const attachment = attachments.find(
            (attachment) => attachment.id.toString() === val
          );

          handleAttachmentChange(attachment);
        }}
      >
        <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          {attachments.map((a, idx) => (
            <SelectItem key={idx} value={a.id.toString()}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
