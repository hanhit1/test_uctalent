import { ReviewReply } from "./reviewReply"

export interface Review {
    id: string
    placeId: string
    reviewerName: string
    reviewerInitials: string
    date: string
    rating: number
    status: 'pending' | 'resolved'
    reviewText: string
    approvedReply?: ReviewReply
    replyOptions: ReviewReply[]
}
