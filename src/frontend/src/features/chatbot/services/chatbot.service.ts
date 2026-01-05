import { apiClient } from "@/lib/open-api-client";
import type { ChatbotRecommendRequest, ChatbotRecommendResponse } from "../types/chatbot.type";

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
    prompt: string
  ): Promise<ChatbotRecommendResponse> => {
    const request: ChatbotRecommendRequest = { prompt };

    const { data, error } = await apiClient.POST("/chatbot/recommend", {
      body: request,
    });

    if (error) {
      console.error("Error fetching chatbot recommendation:", error);
      throw new Error(error.message || "Không thể kết nối với trí tuệ nhân tạo.");
    }

    // Backend returns data wrapped in standard response format
    // Access the actual data from response.data
    const responseData = (data?.data as ChatbotRecommendResponse) || data || [];
    
    return responseData;
  },
};

