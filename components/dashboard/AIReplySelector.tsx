import { useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { XIcon } from "lucide-react";
import { ReviewReply, ReviewReplyType } from "@/types/reviewReply";

interface AIReplySelectorProps {
  replies: ReviewReply[];
  onApprove: (replyType: ReviewReplyType, replyText: string) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const replyTypes = [
  {
    id: "standard",
    label: "Tiêu chuẩn",
  },
  {
    id: "friendly",
    label: "Thân thiện",
  },
  {
    id: "issue-fix",
    label: "Khắc phục",
  },
];

export default function AIReplySelector({
  replies,
  onApprove,
  isLoading,
  onCancel,
}: AIReplySelectorProps) {
  const [selectedReply, setSelectedReply] = useState<string>("");
  const selectedOption = replies.find(
    (option) => option.id === selectedReply,
  );

  const handleApprove = () => {
    if (!selectedOption) return;

    onApprove(selectedOption.replyType, selectedOption.replyText);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h3>Chọn mẫu phản hồi</h3>
        <Button onClick={onCancel} variant="ghost" className="size-8">
          <XIcon size={24} color="black" />
        </Button>
      </div>
      <RadioGroup value={selectedReply} onValueChange={setSelectedReply}>
        <div className="space-y-3">
          {replies.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <RadioGroupItem
                value={option.id}
                className="mt-1 size-4"
                id={option.id}
              ></RadioGroupItem>
              <Label
                htmlFor={option.id}
                className="flex flex-1 cursor-pointer rounded-lg p-2 border border-border hover:border-primary"
              >
                <div className="font-medium min-w-20">{replyTypes.find(type => type.id === option.replyType)?.label}:</div>
                <div className="text-xm text-primary">
                  &quot;{option.replyText}&quot;
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {selectedOption && (
        <Card className="p-4 border border-border rounded-lg shadow-sm">
          <div className="text-xs text-muted-foreground">Preview:</div>
          <div className="text-sm text-primary">
            &quot;{selectedOption.replyText}&quot;
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={isLoading || !selectedReply}
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-1 hover:ring-primary"
        >
          {isLoading ? "Approving..." : "Approve"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-secondary text-secondary-foreground hover:ring-1 hover:ring-primary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
