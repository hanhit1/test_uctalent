import { Review, ReviewRaw } from "@/types/review";
import { toReview } from "../mappers/review";
import { createServerSupabase } from "../supabase/server";

const reviewSelectQuery = `
  id,
  place_id,
  reviewer_name,
  avatar_url,
  review_date,
  rating,
  status,
  review_text,
  approved_reply_id,
  approvedReply:review_replies!reviews_approved_reply_id_fkey(id, reply_type, reply_text),
  replyOptions:review_replies!review_replies_review_id_fkey(id, reply_type, reply_text)
`;

export const getReviews = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ reviews: Review[]; total: number }> => {
  const supabase = createServerSupabase();
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;
  const { data, error } = await supabase
    .from("reviews")
    .select(reviewSelectQuery)
    .order("created_at", { ascending: false })
    .range(from, to)
  if (error) throw error;

  const { count, error: countError } = await supabase
  .from("reviews")
  .select("*", { count: "exact", head: true });
  if (countError) throw countError;

  return {
    reviews: data.map(toReview),
    total: count ?? 0,
  };
};

export const approveReviewReply = async (
  reviewId: string,
  replyId: string,
): Promise<Review> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .update({
      status: "resolved",
      approved_reply_id: replyId,
    })
    .eq("id", reviewId)
    .select(reviewSelectQuery)
    .single();
  if (error) throw error;
  return toReview(data);
};

export const getReviewById = async (reviewId: string): Promise<Review> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .select(reviewSelectQuery)
    .eq("id", reviewId)
    .single();
  if (error) throw error;
  return toReview(data);
};

export const insertReviews = async (placeId: string, reviews: ReviewRaw[]): Promise<Review[]> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .insert(reviews.map((review) => ({
      place_id: placeId,
      reviewer_name: review.reviewerName,
      avatar_url: review.avatarUrl,
      review_date: review.date,
      rating: review.rating,
      review_text: review.reviewText,
    })))
    .select(reviewSelectQuery)
  if (error) throw error;
  return data.map(toReview);
};

export const getReviewsByPlaceId = async (placeId: string): Promise<Review[]> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .select(reviewSelectQuery)
    .eq("place_id", placeId)
  if (error) throw error;
  return data.map(toReview);
};