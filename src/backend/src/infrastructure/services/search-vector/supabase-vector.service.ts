// src/infrastructure/services/supabase-vector.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseVectorService {
  private client = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

  async matchProducts(embedding: number[]) {
    const { data } = await this.client.rpc('match_products', {
      query_embedding: embedding,
      match_threshold: 0.45,
      match_count: 3
    });
    return data;
  }
}