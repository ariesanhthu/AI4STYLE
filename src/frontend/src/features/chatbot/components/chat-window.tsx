"use client";

import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { SuggestedQuestions } from "./suggested-questions";
import type { ChatMessage, SuggestedQuestion } from "../types/chatbot.type";

interface ChatWindowProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  suggestedQuestions: SuggestedQuestion[];
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onSelectQuestion: (question: string) => void;
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  suggestedQuestions,
  onInputChange,
  onSend,
  onClose,
  onSelectQuestion,
}: ChatWindowProps) {
  const showSuggestions = messages.length === 0 && !isLoading;

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-in slide-in-from-bottom-5">
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      {showSuggestions && (
        <SuggestedQuestions
          questions={suggestedQuestions}
          onSelect={onSelectQuestion}
        />
      )}
      <ChatInput
        value={input}
        onChange={onInputChange}
        onSend={onSend}
        isLoading={isLoading}
      />
    </div>
  );
}

