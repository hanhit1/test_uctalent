import { getErrorMessage, MESSAGES } from "@/lib/messages";
import { approveReviewReply } from "@/lib/services/reviews";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/reviews/[id]/approve">,
) {
  try {
    const { id } = await params;
    const { replyId } = await request.json();

    if (!id || !replyId) {
      return NextResponse.json(
        { message: MESSAGES.replyIdRequired },
        { status: 400 },
      );
    }

    const review = await approveReviewReply(id, replyId);

    return NextResponse.json(review, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
