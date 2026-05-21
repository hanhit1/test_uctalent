import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import AIReplySelector from "./AIReplySelector";
import { Badge } from "../ui/badge";
interface ReviewCardProps {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  date: string;
  rating: number;
  status: "pending" | "resolved";
  reviewText: string;
  approvedReply?: string;
}

export default function ReviewCard({
  id,
  reviewerName,
  reviewerInitials,
  date,
  rating,
  status,
  reviewText,
  approvedReply,
}: ReviewCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [replyText, setReplyText] = useState<string | undefined>(approvedReply);
  const [isLoading, setIsLoading] = useState(false);

  const handleApproveReply = (replyType: string, replyText: string) => {
    setIsLoading(true);
    setCurrentStatus("resolved");
    setReplyText(replyText);
    setIsLoading(false);
    setShowReply(false);
  };

  const handleCancelReply = () => {
    setShowReply(false);
  };

  const handleGenerateReply = () => {
    setShowReply(true);
  };

  const stars = Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-10 border-2 border-primary">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${reviewerName}`
            }
              />
              <AvatarFallback>{reviewerInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div>{reviewerName}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{date}</span>
                <span className="text-sm text-muted-foreground">{stars}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-primary flex items-center gap-2">
            {currentStatus === "pending" ? (
              <Badge variant="outline" className="bg-primary text-primary-foreground">Pending</Badge>
            ) : (
              <Badge variant="outline" className="bg-accent text-accent-foreground">Resolved</Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-primary px-4">{reviewText}</div>
        {showReply ? (
          <AIReplySelector
            onApprove={handleApproveReply}
            isLoading={isLoading}
            onCancel={handleCancelReply}
          />
        ) : replyText ? (
          <div className="px-4">
            <div className="text-sm text-primary">Approved Reply:</div>
            <p className="text-sm text-primary">{replyText}</p>
          </div>
        ) : null}
        {currentStatus === "pending" && !showReply && (
          <div className="px-4">
            <Button
              onClick={handleGenerateReply}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/60"
            >
              Tạo phản hồi
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
