import { Review } from "@/types/review";
import { toReview } from "../mappers/review";
import { createServerSupabase } from "../supabase/server";

const reviewSelectQuery = `
  id,
  place_id,
  reviewer_name,
  reviewer_initials,
  review_date,
  rating,
  status,
  review_text,
  approved_reply_id,
  approvedReply:review_replies!reviews_approved_reply_id_fkey(id, reply_type, reply_text),
  replyOptions:review_replies!review_replies_review_id_fkey(id, reply_type, reply_text)
`

export const getReviews = async ({ page, pageSize }: { page: number, pageSize: number }): Promise<{ reviews: Review[], total: number }> => {
    const supabase = createServerSupabase();
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const { data, error } = await supabase.from('reviews').select(reviewSelectQuery).range(from, to);
    if (error) throw error;

    const { data: countData, error: countError } = await supabase.from('reviews').select('count', { count: 'exact' });
    if (countError) throw countError;

    const count = countData[0].count;
    return {
        reviews: data.map(toReview),
        total: count,
    };
}

export const approveReviewReply = async (reviewId: string, replyId: string): Promise<Review> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('reviews').update({
        status: 'resolved',
        approved_reply_id: replyId,
    }).eq('id', reviewId).select(reviewSelectQuery).single();
    if (error) throw error;
    return toReview(data);
}

export const getReviewById = async (reviewId: string): Promise<Review> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('reviews').select(reviewSelectQuery).eq('id', reviewId).single();
    if (error) throw error;
    return toReview(data);
}
