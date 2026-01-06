export { VtonChatbot } from "./components/vton-chatbot";
export { vtonService } from "./services/vton.service";
export { useProductContext } from "./hooks/use-product-context";
export * from "./utils/image-utils";
export type { VtonCategory, VtonParams, ChatMessage } from "./types/vton.type";


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

