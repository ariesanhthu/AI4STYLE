export type ChatbotTaskType = 'TASK_VTON' | 'TASK_SUGGESTION' | 'TASK_FIND' | 'TASK_OTHER';

export type ChatbotUiType = 'VTON' | 'SUGGESTIONS' | 'PRODUCTS' | 'TEXT';

export interface ChatbotRequestDto {
  prompt: string;
  taskType?: ChatbotTaskType | null;
}

export interface ChatbotResponseDto {
  taskType: ChatbotTaskType;
  ui: ChatbotUiType;
  message: string;
  /**
   * Used by TASK_FIND flow to show matched products.
   */
  recommendations?: unknown;
  /**
   * Used by TASK_SUGGESTION flow to show suggested follow-up questions.
   */
  suggestions?: string[];
  /**
   * Used by TASK_VTON flow to tell FE which fields to collect (FE sẽ render form).
   */
  required?: {
    fields: Array<'personImage' | 'garmentImage' | 'category' | 'isHD'>;
  };
}


