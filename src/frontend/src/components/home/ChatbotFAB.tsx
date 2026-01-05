"use client";

import { Chatbot } from "@/features/chatbot/components/chatbot";

/**
 * ChatbotFAB - Floating Action Button for Chatbot
 * 
 * Wrapper component that uses the refactored Chatbot component
 * from the chatbot feature module.
 */
export function ChatbotFAB() {
  return <Chatbot />;
}
