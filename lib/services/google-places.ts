import { MESSAGES } from "@/lib/messages";
import { ReviewRaw } from "@/types/review";

const serpApiKey = process.env.SERP_API_KEY;
export const getReviewsFromGooglePlaces = async (
  placeId: string,
): Promise<ReviewRaw[]> => {
  try {
    const response = await fetch(
      `https://serpapi.com/search?engine=google_maps_reviews&place_id=${placeId}&api_key=${serpApiKey}&sort_by=newestFirst`,
    );

    if (!response.ok) {
      throw new Error(MESSAGES.googleFetchFailed);
    }

    const data = await response.json();
    const reviews = data.reviews;
    if (!reviews) {
      throw new Error(MESSAGES.noReviewsFound);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return reviews.slice(0, 5).map((review: any) => ({
      reviewerName: review.user.name,
      avatarUrl: review.user.thumbnail,
      date: review.iso_date,
      rating: review.rating,
      reviewText: review?.snippet ?? null,
    })) as ReviewRaw[];
  } catch (error) {
    console.error("Error getting reviews from Google Places:", error);
    throw error;
  }
};
