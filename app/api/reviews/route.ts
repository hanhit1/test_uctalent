import { getErrorMessage, MESSAGES } from "@/lib/messages";
import { getReviewsFromGooglePlaces } from "@/lib/services/google-places";
import {
  getReviews,
  getReviewsByPlaceId,
  insertReviews,
} from "@/lib/services/reviews";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const { reviews, total } = await getReviews({ page, pageSize });

    return NextResponse.json(
      {
        data: reviews,
        pagination: {
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          total,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json();
    if (!placeId) {
      return NextResponse.json(
        { message: MESSAGES.placeIdRequired },
        { status: 400 },
      );
    }
    const existingReviews = await getReviewsByPlaceId(placeId);
    if (existingReviews.length > 0) {
      return NextResponse.json(
        { data: existingReviews, isExists: true },
        { status: 200 },
      );
    }

    const reviews = await getReviewsFromGooglePlaces(placeId);
    const insertedReviews = await insertReviews(placeId, reviews);
    return NextResponse.json(
      { data: insertedReviews, isExists: false },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
