import { apiClient } from "@/lib/open-api-client";
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
   * @returns Promise with chatbot recommendations
   * @throws Error if API call fails
   */
  getRecommendation: async (
    prompt: string,
    taskType: ChatbotTaskType | null = null
  ): Promise<ChatbotResponse> => {
    const request: ChatbotRecommendRequest = { prompt, taskType };

    const { data, error } = await apiClient.POST("/shop/v1/chatbot/recommend" as any, {
      body: request,
    });

    if (error) {
      console.error("Error fetching chatbot recommendation:", error);
      throw new Error(error.message || "Không thể kết nối với trí tuệ nhân tạo.");
    }

    // Backend returns data wrapped in standard response format
    if (!data) {
      throw new Error("No response received from chatbot.");
    }

    const responseData: ChatbotResponse =
      (typeof data === "object" && "data" in data
        ? (data as { data: ChatbotResponse }).data
        : data) as ChatbotResponse;

    return responseData;
  },
}
