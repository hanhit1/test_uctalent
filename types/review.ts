export interface Review {
    id: string
    reviewerName: string
    reviewerInitials: string
    date: string
    rating: number
    status: 'pending' | 'resolved'
    reviewText: string
    approvedReply?: string
}
