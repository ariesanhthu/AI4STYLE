/**
 * Chatbot Feature Module
 * 
 * Exports for the chatbot feature
 */

export { Chatbot } from "./components/chatbot";
export type {
  ChatMessage,
  ChatbotRecommendRequest,
  ChatbotRecommendResponse,
  ChatbotRecommendationItem,
  MatchedProduct,
  SuggestedQuestion,
} from "./types/chatbot.type";
export { chatbotService } from "./services/chatbot.service";

