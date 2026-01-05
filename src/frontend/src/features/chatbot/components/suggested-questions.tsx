"use client";

import type { SuggestedQuestion } from "../types/chatbot.type";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-col space-y-2 px-4 pb-2">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onSelect(q.text)}
          className="bg-card hover:bg-muted border border-border p-3 rounded-xl text-sm text-left transition-colors text-foreground"
        >
          {q.icon && <span className="mr-2">{q.icon}</span>}
          {q.text}
        </button>
      ))}
    </div>
  );
}

