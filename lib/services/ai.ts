// lib/services/ai.ts — SERVER ONLY
import { ReviewReplyOption } from "@/types/reviewReply";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" ,
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function generateReplyOptions(reviewText: string): Promise<ReviewReplyOption[]> {

  const prompt = `
  Bạn là API trả về JSON. Chỉ trả về JSON array, không markdown, không giải thích.
  Viết 3 câu trả lời review, mỗi style một câu:
  - standard: tiêu chuẩn
  - friendly: thân thiện  
  - issue-fix: khắc phục
  Review: "${reviewText}"
  Format bắt buộc:
  [
    { "replyType": "standard", "replyText": "..." },
    { "replyType": "friendly", "replyText": "..." },
    { "replyType": "issue-fix", "replyText": "..." }
  ]
  `
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log(text);
    return JSON.parse(text) as ReviewReplyOption[];
  } catch (error) {
    console.error("Error generating reply options:", error);
    throw error;
  }
}
