import { Review } from "@/types/review"
import { ReviewReplyRow, toReviewReply } from "./reviewReply"

export type ReviewRow = {
  id: string
  place_id: string
  reviewer_name: string
  reviewer_initials: string
  review_date: string
  rating: number
  status: "pending" | "resolved"
  review_text: string
  approved_reply_id: string | null
  approvedReply?: ReviewReplyRow | ReviewReplyRow[] | null
  replyOptions?: ReviewReplyRow[] | null
}

function normalizeReplyRow(
  value: ReviewReplyRow | ReviewReplyRow[] | null | undefined,
): ReviewReplyRow | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

export function toReview(row: ReviewRow): Review {
  const replyOptions = (row.replyOptions ?? []).map(toReviewReply)
  const approvedReplyRow = normalizeReplyRow(row.approvedReply)

  const approvedReply = approvedReplyRow
    ? toReviewReply(approvedReplyRow)
    : row.approved_reply_id
      ? replyOptions.find((reply) => reply.id === row.approved_reply_id)
      : undefined

  return {
    id: row.id,
    placeId: row.place_id,
    reviewerName: row.reviewer_name,
    reviewerInitials: row.reviewer_initials,
    date: row.review_date,
    rating: row.rating,
    status: row.status,
    reviewText: row.review_text,
    approvedReply,
    replyOptions,
  }
}

export function toReviewInsert(review: {
  placeId: string
  reviewerName: string
  reviewerInitials: string
  date: string
  rating: number
  reviewText: string
  status?: Review["status"]
}) {
  return {
    place_id: review.placeId,
    reviewer_name: review.reviewerName,
    reviewer_initials: review.reviewerInitials,
    review_date: review.date,
    rating: review.rating,
    review_text: review.reviewText,
    status: review.status ?? "pending",
  }
}
