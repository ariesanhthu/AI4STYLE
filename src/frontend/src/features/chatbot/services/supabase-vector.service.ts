/**
 * Supabase Vector Service
 * 
 * Service để tìm kiếm products bằng vector similarity search
 * Tương tự backend SupabaseVectorService
 * 
 * Note: Cần cài đặt @supabase/supabase-js package:
 * npm install @supabase/supabase-js
 */
let createClient: any;

// Dynamic import để tránh lỗi khi package chưa được cài đặt
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const supabase = require("@supabase/supabase-js");
  createClient = supabase.createClient;
} catch {
  // Package chưa được cài đặt, sẽ throw error khi khởi tạo
  createClient = null;
}

export class SupabaseVectorService {
  private client: any;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_KEY must be set in environment variables",
      );
    }

    if (!createClient) {
      throw new Error(
        "@supabase/supabase-js is not installed. Please install it: npm install @supabase/supabase-js",
      );
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Match products using vector similarity search
   * 
   * Args:
   *   embedding: number[] - Query embedding vector
   * 
   * Returns:
   *   Promise<any[]> - Array of matched products with similarity scores
   * 
   * Raises:
   *   Error - If Supabase client is not initialized
   */
  async matchProducts(embedding: number[]): Promise<any[]> {
    if (!this.client) {
      throw new Error(
        "Supabase client not initialized. Please install @supabase/supabase-js",
      );
    }

    // Validate embedding
    if (!Array.isArray(embedding) || embedding.length === 0) {
      console.error("Invalid embedding:", embedding);
      throw new Error("Embedding must be a non-empty array");
    }

    console.log("=== Supabase Vector Search ===");
    console.log("Embedding length:", embedding.length);
    console.log("Match threshold: 0.45");
    console.log("Match count: 3");
    console.log("Embedding sample (first 5):", embedding.slice(0, 5));

    try {
      console.log("📡 Calling Supabase RPC: match_products");
      console.log("RPC params:", {
        query_embedding_length: embedding.length,
        match_threshold: 0.2,
        match_count: 3,
      });

      // Giống Python: response = supabase.rpc("match_products", rpc_params).execute()
      const response = await this.client.rpc("match_products", {
        query_embedding: embedding,
        match_threshold: 0.2,
        match_count: 3,
      });

      console.log("📥 Supabase RPC response received");
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response || {}));

      // Giống Python: results = response.data
      let data: any = null;
      let error: any = null;

      // Supabase JS SDK trả về { data, error } trực tiếp
      if (response && typeof response === "object") {
        if ("data" in response) {
          data = response.data;
        }
        if ("error" in response) {
          error = response.error;
        }
      } else {
        // Fallback: có thể response là data trực tiếp
        data = response;
      }

      console.log("📊 Response data:", data);
      console.log("❌ Response error:", error);

      if (error) {
        console.error("Supabase RPC error:", error);
        console.error("Error details:", {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
        });
        throw new Error(`Supabase RPC error: ${error?.message || JSON.stringify(error)}`);
      }

      console.log("✅ Match results count:", data?.length || 0);
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("📋 First result:", {
          option_id: data[0].option_id,
          product_id: data[0].product_id,
          similarity: data[0].similarity,
          name: data[0].name,
          slug: data[0].slug,
        });
        console.log("📋 All results:", data);
      } else {
        console.warn("⚠️ No products matched (similarity < 0.2 or no products in database)");
        console.warn("Data value:", data);
        console.warn("Data type:", typeof data);
        console.warn("Is array:", Array.isArray(data));
      }
      console.log("============================");

      // Đảm bảo trả về array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error in matchProducts:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }
}

