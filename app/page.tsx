"use client";

import PlaceIDFetchBar from "@/components/dashboard/PlaceIDFetchBar";
import ReviewCard from "@/components/dashboard/ReviewCard";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleFetchReviews = useCallback(async () => {
    setIsLoading(true);
    setReviews([]);
    try {
      const response = await fetch(
        `/api/reviews?page=${page}&pageSize=${pageSize}`,
      );
      console.log(response);

      if (!response.ok) {
        //throw new Error("Failed to fetch reviews");
        return;
      }
      const data = await response.json();
      setReviews(data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const fetchReviews = async () => {
      await handleFetchReviews();
    };
    fetchReviews();
  }, [handleFetchReviews, page]);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <PlaceIDFetchBar onFetch={handleFetchReviews} isLoading={isLoading} />

        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-medium text-primary">Reviews</div>
          <div className="text-lg font-medium text-primary">
            Total Reviews: {reviews.length}
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                reviewerName={review.reviewerName}
                reviewerInitials={review.reviewerInitials}
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
          <Button variant="outline" className="bg-primary hover:bg-primary/60" onClick={() => setPage(page + 1)} >
            <ChevronRightIcon size={24} color="white" />
          </Button>
        </div>
      </div>
    </main>
  );
}
