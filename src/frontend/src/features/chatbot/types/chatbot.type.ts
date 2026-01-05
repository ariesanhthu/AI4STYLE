/**
 * Chatbot Types
 * 
 * Types for chatbot feature including request/response types
 */

export interface ChatbotRecommendRequest {
  prompt: string;
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
  data?: ChatbotRecommendResponse;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  icon?: string;
}

