// src/shared/interfaces/ai.interface.ts

// Tokens để Inject
export const AI_EMBEDDING_SERVICE = 'AI_EMBEDDING_SERVICE';
export const GROQ_SERVICE = 'GROQ_SERVICE';
export const VECTOR_SEARCH_SERVICE = 'VECTOR_SEARCH_SERVICE';

// Bản thiết kế cho các Service
export interface IEmbeddingService {
  generate(text: string): Promise<number[]>;
}

export interface IGroqService {
  breakdownOutfit(prompt: string): Promise<any[]>;
  classifyTask(prompt: string): Promise<'TASK_VTON' | 'TASK_SUGGESTION' | 'TASK_FIND' | 'TASK_OTHER'>;
  suggestQuestions(prompt: string): Promise<string[]>;
  respondGeneral(prompt: string): Promise<string>;
}

export interface IVectorSearchService {
  matchProducts(embedding: number[]): Promise<any[]>;
}