import { generateReplyOptions } from "@/lib/services/ai";
import { saveReviewReply } from "@/lib/services/review-replies";
import { getReviewById } from "@/lib/services/reviews";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _request: NextRequest,
    { params }: RouteContext<"/api/reviews/[id]/replies/generate">
  ) {
    try {
        const { id: reviewId } = await params

        if (!reviewId) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const data = await getReviewById(reviewId);

        const replies = await generateReplyOptions(data.reviewText);

        const savedReplies = [];
        for (const reply of replies) {
            const savedReply = await saveReviewReply(reviewId, reply.replyType, reply.replyText);
            savedReplies.push(savedReply);
        }
        return NextResponse.json(savedReplies);
    }
    catch (error) {
        console.error('Error generating reply:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}