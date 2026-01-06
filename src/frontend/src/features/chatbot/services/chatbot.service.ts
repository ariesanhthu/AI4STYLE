import type {
  ChatbotRecommendRequest,
  ChatbotResponse,
  ChatbotTaskType,
} from "../types/chatbot.type";

/**
 * Chatbot Service
 * 
 * Service layer for chatbot API calls using apiClient
 */
export const chatbotService = {
  /**
   * Get AI recommendation based on user prompt
   * 
   * @param prompt - User's input prompt
   * @param taskType - Optional task type to skip classification
   * @returns Promise with chatbot recommendations
   * @throws Error if API call fails
   */
  getRecommendation: async (
    prompt: string,
    taskType: ChatbotTaskType | null = null
  ): Promise<ChatbotResponse> => {
    const request: ChatbotRecommendRequest = { prompt, taskType };

    // Call Next.js API route instead of direct backend call
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error fetching chatbot recommendation:", errorData);
      throw new Error(
        errorData.message || 
        `HTTP ${response.status}: ${response.statusText}` ||
        "Không thể kết nối với trí tuệ nhân tạo."
      );
    }

    const result = await response.json();

    // Extract data from Next.js API response format: { success: boolean, data: ChatbotResponse }
    if (!result.success || !result.data) {
      throw new Error(result.message || "No response received from chatbot.");
    }

    const chatbotResponse = result.data as ChatbotResponse;
    
    // Debug: Log response để kiểm tra
    console.log("=== Chatbot Service Response ===");
    console.log("Task Type:", chatbotResponse.taskType);
    console.log("UI Type:", chatbotResponse.ui);
    console.log("Message:", chatbotResponse.message);
    console.log("Recommendations:", chatbotResponse.recommendations);
    console.log("Full Response:", chatbotResponse);
    console.log("================================");

    return chatbotResponse;
  },
}
