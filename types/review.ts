import { ReviewReply } from "./reviewReply"

export interface Review {
    id: string
    placeId: string
    reviewerName: string
    avatarUrl: string
    date: string
    rating: number
    status: 'pending' | 'resolved'
    reviewText: string
    approvedReply?: ReviewReply
    replyOptions: ReviewReply[]
}

export interface ReviewRaw {
    reviewerName: string
    reviewerInitials: string
    avatarUrl: string
    date: string
    rating: number
    reviewText?: string
 }
