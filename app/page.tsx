"use client";

import PlaceIDFetchBar from "@/components/dashboard/PlaceIDFetchBar";
import ReviewCard from "@/components/dashboard/ReviewCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { getApiErrorMessage, MESSAGES } from "@/lib/messages";
import { Review } from "@/types/review";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const pageSize = 5;

  const handleFetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reviews?page=${page}&pageSize=${pageSize}`,
      );

      if (!response.ok) {
        setIsLoading(false);
        toast.error(
          await getApiErrorMessage(response, MESSAGES.fetchReviewsFailed),
        );
        return;
      }
      const data = await response.json();

      setReviews(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalReviews(data.pagination.total);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(MESSAGES.networkError);
    }

    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const fetchReviews = async () => {
      await handleFetchReviews();
    };
    fetchReviews();
  }, [handleFetchReviews, page]);

  const handleFetchReviewsByPlaceId = useCallback(async (placeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews`, {
        method: "POST",
        body: JSON.stringify({ placeId }),
      });  
      if (!response.ok) {
        setIsLoading(false);
        toast.error(await getApiErrorMessage(response, MESSAGES.importFailed));
        return;
      }

      const data = await response.json();

      if (data.isExists) {
        toast.success(MESSAGES.importExists);
        setIsLoading(false);
        return;
      }

      setPage(1);
      toast.success(MESSAGES.importSuccess);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(MESSAGES.networkError);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <PlaceIDFetchBar onFetch={handleFetchReviewsByPlaceId} isLoading={isLoading} />

        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-medium text-primary">Reviews</div>
          <div className="text-lg font-medium text-primary">
            Total Reviews: {totalReviews}
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                reviewerName={review.reviewerName}
                avatarUrl={review.avatarUrl}
                date={review.date}
                rating={review.rating}
                status={review.status}
                reviewText={review.reviewText}
                approvedReply={review.approvedReply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-lg font-medium text-muted-foreground">
            Không có review nào
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="bg-primary hover:bg-primary/60" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeftIcon size={24} color="white" />
          </Button>
          <Button variant="outline" className="bg-primary hover:bg-primary/60" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            <ChevronRightIcon size={24} color="white" />
          </Button>
        </div>
      </div>
    </main>
  );
}
