import { ReviewReply, ReviewReplyType } from "@/types/reviewReply"

export type ReviewReplyRow = {
  id: string
  review_id?: string
  reply_type: string
  reply_text: string
}

export function toReviewReply(row: ReviewReplyRow): ReviewReply {
  return {
    id: row.id,
    replyType: row.reply_type as ReviewReplyType,
    replyText: row.reply_text,
  }
}

export function toReviewReplyInsert(
  reviewId: string,
  replyType: ReviewReplyType,
  replyText: string,
) {
  return {
    review_id: reviewId,
    reply_type: replyType,
    reply_text: replyText,
  }
}
