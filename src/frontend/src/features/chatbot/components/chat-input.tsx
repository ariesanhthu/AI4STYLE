"use client";

import { Send, AlertCircle } from "lucide-react";
import { KeyboardEvent, ClipboardEvent, useMemo } from "react";
import { cn } from "@/lib/utils";

const MAX_CHARACTERS = 100;

/**
 * Truncates text to fit within the maximum character limit.
 * Keeps only the first MAX_CHARACTERS characters.
 *
 * Args:
 *   text: The text string to truncate.
 *
 * Returns:
 *   The truncated text that fits within MAX_CHARACTERS limit.
 */
function truncateToCharacterLimit(text: string): string {
  if (text.length <= MAX_CHARACTERS) return text;
  return text.slice(0, MAX_CHARACTERS);
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Nhập tin nhắn...",
}: ChatInputProps) {
  const characterCount = useMemo(() => value.length, [value]);
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const isNearLimit = characterCount >= MAX_CHARACTERS * 0.8; // 80% of limit

  const handleChange = (newValue: string) => {
    if (newValue.length > MAX_CHARACTERS) {
      // Truncate to limit if exceeds
      const truncated = truncateToCharacterLimit(newValue);
      onChange(truncated);
    } else {
      onChange(newValue);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const currentText = value;
    const newText = currentText + pastedText;
    const truncated = truncateToCharacterLimit(newText);
    onChange(truncated);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && value.trim() && !isOverLimit) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card rounded-b-2xl">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={handlePaste}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            maxLength={MAX_CHARACTERS} // HTML native limit as backup
            className={cn(
              "w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 text-sm bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
              isOverLimit
                ? "border-red-500 focus:ring-red-500"
                : isNearLimit
                  ? "border-yellow-500 focus:ring-yellow-500"
                  : "border-input focus:ring-primary"
            )}
          />
          {/* Character count indicator */}
          {(isNearLimit || isOverLimit || characterCount > 0) && (
            <div
              className={cn(
                "absolute -top-6 right-0 text-xs flex items-center space-x-1",
                isOverLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-muted-foreground"
              )}
            >
              {isOverLimit && <AlertCircle className="w-3 h-3" />}
              <span>
                {characterCount}/{MAX_CHARACTERS} ký tự
              </span>
              {isOverLimit && (
                <span className="text-red-600 font-medium ml-1">
                  (Giới hạn đã vượt quá)
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onSend}
          disabled={isLoading || !value.trim() || isOverLimit}
          className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Gửi tin nhắn"
          title={isOverLimit ? "Vui lòng giảm số ký tự xuống dưới 100 ký tự" : ""}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

