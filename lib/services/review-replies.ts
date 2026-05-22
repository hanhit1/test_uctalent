import { ReviewReply, ReviewReplyType } from "@/types/reviewReply";
import { toReviewReply, toReviewReplyInsert } from "../mappers/reviewReply";
import { createServerSupabase } from "../supabase/server";

const reviewReplySelectQuery = "id, review_id, reply_type, reply_text";

export const saveReviewReply = async (reviewId: string, replyType: ReviewReplyType, replyText: string): Promise<ReviewReply> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('review_replies').insert(
        toReviewReplyInsert(reviewId, replyType, replyText),
    ).select(reviewReplySelectQuery).single();
    if (error) throw error;
    return toReviewReply(data);
}

export const getReviewReplies = async (reviewId: string): Promise<ReviewReply[]> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('review_replies').select(reviewReplySelectQuery).eq('review_id', reviewId);
    if (error) throw error;
    return data.map(toReviewReply);
}
