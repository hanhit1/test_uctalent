'use client'

import PlaceIDFetchBar from "@/components/dashboard/PlaceIDFetchBar";
import ReviewCard from "@/components/dashboard/ReviewCard";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { ChevronLeftIcon, ChevronRightIcon, NavigationIcon } from "lucide-react";
import { useState } from "react";

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    reviewerName: 'Nguyễn Văn A',
    reviewerInitials: 'NA',
    date: 'May 20, 2024',
    rating: 5,
    status: 'resolved',
    reviewText: 'Khách sạn rất sạch sẽ, nhân viên thân thiện, phục vụ tuyệt vời. Tôi sẽ quay lại lần nữa!',
    approvedReply: 'Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi bạn hài lòng với dịch vụ của chúng tôi.'
  },
  {
    id: '2',
    reviewerName: 'Trần Thị B',
    reviewerInitials: 'TB',
    date: 'May 18, 2024',
    rating: 3,
    status: 'pending',
    reviewText: 'Phòng ốc còn hơi nhỏ và tiếng ồn từ đường phố vào phòng. Nhân viên tuy vui vẻ nhưng chậm trong việc phục vụ.'
  },
  {
    id: '3',
    reviewerName: 'Lê Văn C',
    reviewerInitials: 'LC',
    date: 'May 15, 2024',
    rating: 4,
    status: 'pending',
    reviewText: 'Vị trí tuyệt vời, gần các điểm du lịch. Bữa sáng ngon lành. Chỉ tấm nệm hơi cứng so với mong đợi.'
  },
  {
    id: '4',
    reviewerName: 'Phạm Minh D',
    reviewerInitials: 'PD',
    date: 'May 10, 2024',
    rating: 5,
    status: 'resolved',
    reviewText: 'Dịch vụ xuất sắc! Wifi nhanh, nước nóng đủ, air con mát mẻ. Giá cả phải chăng. Hẹn gặp lại!',
    approvedReply: 'Cảm ơn bạn đã để lại đánh giá. Chúng tôi luôn cố gắng cải thiện dịch vụ.'
  }
]

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleFetchReviews = (placeId: string) => {
    setIsLoading(true);
    setReviews([]);
    console.log('Fetching reviews...');
    console.log('Place ID:', placeId);
    setTimeout(() => {
      setIsLoading(false);
      setReviews(SAMPLE_REVIEWS);
    }, 1000);
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <PlaceIDFetchBar onFetch={handleFetchReviews} isLoading={isLoading} />

        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-medium text-primary">Reviews</div>
          <div className="text-lg font-medium text-primary">Total Reviews: {reviews.length}</div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
          </div>
        ) : (
          <div className="text-center text-lg font-medium text-muted-foreground">Không có review nào</div>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="bg-primary hover:bg-primary/60">
             <ChevronLeftIcon
               size={24}
               color="white"
             />
          </Button>
          <Button variant="outline" className="bg-primary hover:bg-primary/60">
            <ChevronRightIcon
              size={24}
              color="white"
            />
          </Button>
        </div>
      </div>
    </main>
  );
}
