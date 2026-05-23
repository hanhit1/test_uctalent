import { getErrorMessage, MESSAGES } from "@/lib/messages";
import { generateReplyOptions } from "@/lib/services/ai";
import {
  getReviewReplies,
  saveReviewReply,
} from "@/lib/services/review-replies";
import { getReviewById } from "@/lib/services/reviews";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: RouteContext<"/api/reviews/[id]/replies/generate">,
) {
  try {
    const { id: reviewId } = await params;

    if (!reviewId) {
      return NextResponse.json(
        { message: MESSAGES.reviewIdRequired },
        { status: 400 },
      );
    }

    const existingReplies = await getReviewReplies(reviewId);

    if (existingReplies.length > 0) {
      return NextResponse.json(existingReplies);
    }

    const data = await getReviewById(reviewId);

    const replies = await generateReplyOptions(data.rating, data.reviewText);

    const savedReplies = await saveReviewReply(reviewId, replies);
    return NextResponse.json(savedReplies, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
