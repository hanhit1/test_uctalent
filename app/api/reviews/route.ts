import { getReviews } from "@/lib/services/reviews";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const { reviews, total } = await getReviews({ page, pageSize });
        return NextResponse.json({ data: reviews, pagination: { page, pageSize, totalPages: Math.ceil(total / pageSize), total } });
     }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
 }