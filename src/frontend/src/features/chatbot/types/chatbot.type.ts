/**
 * Chatbot Types
 * 
 * Types for chatbot feature including request/response types
 */

export interface ChatbotRecommendRequest {
  prompt: string;
  taskType?: ChatbotTaskType | null;
}

export type ChatbotTaskType = "TASK_VTON" | "TASK_SUGGESTION" | "TASK_FIND" | "TASK_OTHER";

export type ChatbotUiType = "VTON" | "SUGGESTIONS" | "PRODUCTS" | "TEXT";

export interface FilterOptions {
  cursor?: string;
  limit?: string;
  sortOrder?: "asc" | "desc";
  category_id?: string;
  color_family?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
  sortOption?: "price" | "time" | "relevance";
}

export interface ChatbotResponse {
  taskType: ChatbotTaskType;
  ui: ChatbotUiType;
  message: string;
  recommendations?: ChatbotRecommendResponse;
  suggestions?: string[];
  filterOptions?: FilterOptions;
  required?: {
    fields: Array<"personImage" | "garmentImage" | "category" | "isHD">;
  };
}

export interface MatchedProduct {
  id: string;
  imageUrl: string;
  productUrl: string;
  matchScore: number;
  name?: string;
  price?: number;
  thumbnail?: string;
}

export interface ChatbotRecommendationItem {
  category: string;
  suggestion: string;
  matchedProducts: MatchedProduct[];
}

export type ChatbotRecommendResponse = ChatbotRecommendationItem[];

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: ChatbotRecommendResponse; // legacy support
  response?: ChatbotResponse;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  icon?: string;
}

