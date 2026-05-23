// lib/services/ai.ts — SERVER ONLY
import { ReviewReplyOption } from "@/types/reviewReply";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MESSAGES } from "../messages";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function generateReplyOptions(
  rating: number,
  reviewText?: string,
): Promise<ReviewReplyOption[]> {
  const hasReviewText = reviewText && reviewText.trim().length > 0;

  const reviewContext = hasReviewText
    ? `Nội dung review: "${reviewText}"`
    : `Khách hàng không để lại nội dung, chỉ đánh giá ${rating}/5 sao`;

  const tone =
    rating >= 4
      ? "tích cực, cảm ơn chân thành và mời khách quay lại"
      : rating === 3
        ? "ghi nhận, cam kết cải thiện dịch vụ"
        : "xin lỗi chân thành, đồng cảm và cam kết khắc phục cụ thể";

  const prompt = `
Bạn là quản lý khách sạn chuyên nghiệp, đang soạn thảo câu trả lời cho review trên Google Maps.
Chỉ trả về JSON array, không markdown, không giải thích.

Thông tin review:
- Rating: ${rating}/5 sao
- ${reviewContext}
- Định hướng phản hồi: ${tone}

Viết đúng 3 câu trả lời theo từng style:
- standard: lịch sự, chuyên nghiệp, đại diện thương hiệu khách sạn
- friendly: thân thiện, gần gũi, tạo cảm giác được lắng nghe, có thể dùng emoji nhẹ
- issue-fix: thừa nhận vấn đề${hasReviewText ? " khách đề cập" : " qua rating thấp"}, nêu hành động khắc phục cụ thể, mời khách phản hồi trực tiếp

Lưu ý:
- Không đề cập tên khách sạn cụ thể
- Độ dài mỗi câu trả lời: 2-4 câu
- Ngôn ngữ: tiếng Việt tự nhiên

Chỉ trả về đúng format sau:
[
  { "replyType": "standard", "replyText": "..." },
  { "replyType": "friendly", "replyText": "..." },
  { "replyType": "issue-fix", "replyText": "..." }
]
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as ReviewReplyOption[];
  } catch (error) {
    console.error("Error generating reply options:", error);
    throw new Error(MESSAGES.generateReplyOptionsFailed);
  }
}
