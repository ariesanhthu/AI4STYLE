import { Inject, Injectable } from '@nestjs/common';
import { 
  GROQ_SERVICE, AI_EMBEDDING_SERVICE, VECTOR_SEARCH_SERVICE
} from '@/shared/interfaces';
import type { 
  IGroqService, IEmbeddingService, IVectorSearchService 
} from '@/shared/interfaces';

@Injectable()
export class SearchOutfitUseCase {
  constructor(
    @Inject(GROQ_SERVICE) private readonly groqService: IGroqService,
    @Inject(AI_EMBEDDING_SERVICE) private readonly embeddingService: IEmbeddingService,
    @Inject(VECTOR_SEARCH_SERVICE) private readonly vectorSearchService: IVectorSearchService,
  ) {}

  async execute(prompt: string) {
    const items = await this.groqService.breakdownOutfit(prompt);
  
    const result = await Promise.all(items.map(async (item) => {
      const vector = await this.embeddingService.generate(item.mo_ta);
      const products = await this.vectorSearchService.matchProducts(vector);
      
      return { 
        category: item.loai, 
        suggestion: item.mo_ta, 
        // Mapping lại data để Frontend dễ dùng
        matchedProducts: products.map(p => ({
          id: p.product_id,
          imageUrl: p.thumbnail,
          productUrl: `/products/${p.product_id}`, // Link dẫn tới trang chi tiết
          matchScore: Math.round(p.similarity * 100) // % tương đồng
        }))
      };
    }));
  
    return result;
  }
}