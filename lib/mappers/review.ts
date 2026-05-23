import { Review } from "@/types/review"
import { ReviewReplyRow, toReviewReply } from "./reviewReply"

export type ReviewRow = {
  id: string
  place_id: string
  reviewer_name: string
  avatar_url: string
  review_date: string
  rating: number
  status: "pending" | "resolved"
  review_text?: string | null
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
    avatarUrl: row.avatar_url,
    date: row.review_date,
    rating: row.rating,
    status: row.status,
    reviewText: row.review_text ?? "",
    approvedReply,
    replyOptions,
  }
}

export function toReviewInsert(review: {
  placeId: string
  reviewerName: string
  avatarUrl: string
  date: string
  rating: number
  reviewText?: string | null
  status?: Review["status"]
}) {
  return {
    place_id: review.placeId,
    reviewer_name: review.reviewerName,
    avatar_url: review.avatarUrl,
    review_date: review.date,
    rating: review.rating,
    review_text: review.reviewText,
    status: review.status ?? "pending",
  }
}
