import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import AIReplySelector from "./AIReplySelector";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/useToast";
import { getApiErrorMessage, MESSAGES } from "@/lib/messages";
import { ReviewReply } from "@/types/reviewReply";
interface ReviewCardProps {
  id: string;
  reviewerName: string;
  avatarUrl: string;
  date: string;
  rating: number;
  status: "pending" | "resolved";
  reviewText: string;
  approvedReply?: ReviewReply;
}

export default function ReviewCard({
  id,
  reviewerName,
  avatarUrl,
  date,
  rating,
  status,
  reviewText,
  approvedReply,
}: ReviewCardProps) {
  const toast = useToast();
  const [showReply, setShowReply] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [reply, setApprovedReply] = useState<ReviewReply | undefined>(
    approvedReply,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState<ReviewReply[]>([]);

  const handleApproveReply = async (replyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${id}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ replyId }),
      });
      if (!response.ok) {
        toast.error(
          await getApiErrorMessage(response, MESSAGES.approveFailed),
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      toast.success(MESSAGES.approveSuccess);

      setCurrentStatus("resolved");
      setApprovedReply(data.approvedReply);

      setShowReply(false);
    } catch (error) {
      console.error("Error approving reply:", error);
      toast.error(MESSAGES.networkError);
    }

      setIsLoading(false);
  };

  const handleCancelReply = () => {
    setShowReply(false);
  };

  const handleGenerateReply = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${id}/replies/generate`, {
        method: "POST",
      });
      if (!response.ok) {
        setIsLoading(false);
        toast.error(
          await getApiErrorMessage(response, MESSAGES.generateFailed),
        );
        return;
      }

      const data = await response.json();
      toast.success(MESSAGES.generateSuccess);

      setGeneratedReplies(data);
      setShowReply(true);
    } catch (error) {
      console.error("Error generating reply:", error);
      toast.error(MESSAGES.networkError);
    }

    setIsLoading(false);
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
                src={avatarUrl}
              />
              <AvatarFallback>{reviewerName.charAt(0)}</AvatarFallback>
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
              <Badge
                variant="outline"
                className="bg-primary text-primary-foreground"
              >
                Pending
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-accent text-accent-foreground"
              >
                Resolved
              </Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-primary px-4">{reviewText}</div>
        {showReply ? (
          <AIReplySelector
            replies={generatedReplies}
            onApprove={handleApproveReply}
            isLoading={isLoading}
            onCancel={handleCancelReply}
          />
        ) : reply ? (
          <div className="px-4">
            <div className="text-sm text-primary">Approved Reply:</div>
            <p className="text-sm text-primary">{reply.replyText}</p>
          </div>
        ) : null}
        {currentStatus === "pending" && !showReply && (
          <div className="px-4">
            <Button
              onClick={handleGenerateReply}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/60"
            >
              Generate AI
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
