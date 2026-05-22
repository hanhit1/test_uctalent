export type ReviewReplyType = 'standard' | 'friendly' | 'issue-fix';

export interface ReviewReply {
    id: string
    replyType: ReviewReplyType
    replyText: string
}
  
export interface ReviewReplyOption {
    replyType: ReviewReplyType
    replyText: string
}