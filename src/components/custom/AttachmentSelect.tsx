import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTitleCase } from "@/lib/utils/helpers";
import { AttachmentRecord } from "@/lib/types/types";

export default function AttachmentSelect({
  id,
  type,
  selectedAttachment,
  attachments,
  handleAttachmentChange,
}: {
  id: string;
  type: "sight" | "barrel" | "grip" | "underbarrel";
  selectedAttachment: AttachmentRecord | undefined;
  attachments: AttachmentRecord[];
  handleAttachmentChange: (attachment: AttachmentRecord | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{toTitleCase(type)}</Label>
      <Select
        value={selectedAttachment?.id.toString()}
        onValueChange={(val) => {
          const attachment = attachments.find(
            (attachment) => attachment.id.toString() === val
          );

          handleAttachmentChange(attachment);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={`Choose ${type}`} />
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
