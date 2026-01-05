export interface IEmbeddingService {
  generate(text: string): Promise<number[]>;
}

export interface IGroqService {
  breakdownOutfit(prompt: string): Promise<any[]>;
}

export interface IVectorSearchService {
  matchProducts(embedding: number[]): Promise<any[]>;
}