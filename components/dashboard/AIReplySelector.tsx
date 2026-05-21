import { useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { XIcon } from "lucide-react";

interface AIReplySelectorProps {
  onApprove: (replyType: string, replyText: string) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const REPLY_OPTIONS = [
  {
    id: "standard",
    label: "Tiêu chuẩn",
    sampleText:
      "Cảm ơn bạn đã để lại đánh giá. Chúng tôi luôn cố gắng cải thiện dịch vụ.",
  },
  {
    id: "friendly",
    label: "Thân thiện",
    sampleText:
      "Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi bạn hài lòng với dịch vụ của chúng tôi.",
  },
  {
    id: "issue-fix",
    label: "Khắc phục lỗi",
    sampleText:
      "Xin lỗi vì trải nghiệm không tốt. Chúng tôi sẽ giải quyết vấn đề này ngay lập tức.",
  },
];

export default function AIReplySelector({
  onApprove,
  isLoading,
  onCancel,
}: AIReplySelectorProps) {
  const [selectedReply, setSelectedReply] = useState<string>("");
  const selectedOption = REPLY_OPTIONS.find(
    (option) => option.id === selectedReply,
  );

  const handleApprove = () => {
    if (!selectedOption) return;

    onApprove(selectedOption.id, selectedOption.sampleText);
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
          {REPLY_OPTIONS.map((option) => (
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
                <div className="font-medium">{option.label}:</div>
                <div className="text-xm text-primary">
                  &quot;{option.sampleText}&quot;
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
            &quot;{selectedOption.sampleText}&quot;
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
