export const MESSAGES = {
  internalError: "Đã xảy ra lỗi hệ thống",
  networkError: "Không thể kết nối máy chủ",

  placeIdRequired: "Vui lòng nhập Place ID",
  reviewIdRequired: "Thiếu ID review",
  replyIdRequired: "Thiếu ID review hoặc ID phản hồi",

  googleFetchFailed: "Không thể lấy review từ Google Maps",
  noReviewsFound: "Không tìm thấy review cho địa điểm này",

  fetchReviewsFailed: "Không thể tải danh sách review",
  importSuccess: "Lấy review thành công",
  importExists: "Địa điểm này đã có review trong hệ thống",
  importFailed: "Không thể lấy review từ Google Maps",

  approveSuccess: "Phản hồi đã được phê duyệt",
  approveFailed: "Không thể phê duyệt phản hồi",

  generateSuccess: "Đã tạo phản hồi AI",
  generateFailed: "Không thể tạo phản hồi AI",
  generateReplyOptionsFailed: "Không thể tạo phản hồi AI",
} as const;

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : MESSAGES.internalError;
}

export async function getApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    return typeof data.message === "string" ? data.message : fallback;
  } catch {
    return fallback;
  }
}
