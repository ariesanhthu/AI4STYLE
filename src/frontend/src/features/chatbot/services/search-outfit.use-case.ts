import { GroqService } from "./groq.service";
import { HuggingFaceEmbeddingService } from "./hf-embedding.service";
import { SupabaseVectorService } from "./supabase-vector.service";
import { productDetailsService } from "@/features/user-product-details/services/product-details.service";
import { productService } from "@/features/user-product/services/product.service";

/**
 * Search Outfit Use Case
 * 
 * Use case để tìm kiếm outfit dựa trên prompt
 * Tương tự backend SearchOutfitUseCase
 */
export class SearchOutfitUseCase {
  private groqService: GroqService;
  private embeddingService: HuggingFaceEmbeddingService;
  private vectorSearchService: SupabaseVectorService;

  constructor() {
    this.groqService = new GroqService();
    this.embeddingService = new HuggingFaceEmbeddingService();
    this.vectorSearchService = new SupabaseVectorService();
  }

  /**
   * Execute outfit search based on prompt
   * 
   * Args:
   *   prompt: string - User's outfit description
   * 
   * Returns:
   *   Promise<Array<{category: string, suggestion: string, matchedProducts: Array}>>
   */
  async execute(prompt: string) {
    console.log("=== Search Outfit Use Case ===");
    console.log("Prompt:", prompt);
    
    const items = await this.groqService.breakdownOutfit(prompt);
    console.log("Breakdown items:", items);
    console.log("Items length:", items.length);

    // Cache product list riêng cho từng loại (áo, quần, etc.)
    // Để tránh lẫn lộn giữa các loại
    const productListCache: Record<string, any[]> = {};
    
    const getProductListByType = async (loai: string) => {
      // Normalize loại để làm key cache (lowercase, remove accents nếu cần)
      const cacheKey = loai.toLowerCase().trim();
      
      if (!productListCache[cacheKey]) {
        try {
          console.log(`📦 Fetching product list for type: ${loai}...`);
          // Filter theo search text dựa trên loại
          // Ví dụ: "áo" -> search "áo", "quần" -> search "quần"
          const { data } = await productService.getProducts({
            limit: "500",
            search: loai, // Filter theo loại để chỉ lấy áo hoặc quần
          });
          productListCache[cacheKey] = data;
          console.log(`✅ Cached ${data.length} products for type: ${loai}`);
        } catch (error) {
          console.error(`Error fetching product list for ${loai}:`, error);
          productListCache[cacheKey] = [];
        }
      }
      
      return productListCache[cacheKey];
    };

    const result = await Promise.all(
      items.map(async (item) => {
        console.log(`\n🔍 Processing item: ${item.loai} - ${item.mo_ta}`);
        
        // Generate embedding vector
        let vector: number[];
        try {
          console.log(`📊 Step 1: Generating embedding for "${item.mo_ta}"...`);
          vector = await this.embeddingService.generate(item.mo_ta);
          console.log(`✅ Generated vector for ${item.loai}, length:`, vector.length);
          console.log(`📐 Vector sample (first 5):`, vector.slice(0, 5));
          
          if (!vector || vector.length === 0) {
            console.error(`❌ Empty vector generated for ${item.loai}`);
            return {
              category: item.loai,
              suggestion: item.mo_ta,
              matchedProducts: [],
            };
          }
        } catch (error) {
          console.error(`❌ Error generating embedding for ${item.loai}:`, error);
          if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
          }
          return {
            category: item.loai,
            suggestion: item.mo_ta,
            matchedProducts: [],
          };
        }
        
        // Search products using vector
        let products: any[];
        try {
          console.log(`🔎 Step 2: Searching products in Supabase with vector...`);
          products = await this.vectorSearchService.matchProducts(vector);
          console.log(`✅ Supabase search completed for ${item.loai}`);
          console.log(`📦 Products count:`, products?.length || 0);
          if (products && products.length > 0) {
            console.log(`📋 First product:`, {
              option_id: products[0].option_id,
              product_id: products[0].product_id,
              similarity: products[0].similarity,
              name: products[0].name,
            });
          } else {
            console.warn(`⚠️ No products found for ${item.loai}`);
          }
        } catch (error) {
          console.error(`❌ Error matching products for ${item.loai}:`, error);
          if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
          }
          return {
            category: item.loai,
            suggestion: item.mo_ta,
            matchedProducts: [],
          };
        }

        // Thử tất cả products từ Supabase cho đến khi tìm được product hợp lệ
        // Thay vì chỉ thử product đầu tiên
        let matchedProduct = null;

        // Thử từng product cho đến khi tìm được 1 product hợp lệ
        for (const p of products) {
          const optionId = p.option_id || p.optionId;
          const productId = p.product_id || p.productId;
          let slug = p.slug;
          let product = null;
          
          console.log(`🔍 Processing product from Supabase:`, {
            option_id: optionId,
            product_id: productId,
            similarity: p.similarity,
            thumbnail: p.thumbnail,
          });

          try {
            // Nếu có option_id, dùng trực tiếp
            if (optionId) {
              try {
                console.log(`✅ Using optionId directly: ${optionId}`);
                product = await productDetailsService.getProductById(optionId);
                
                if (product && product.slug) {
                  slug = product.slug;
                  console.log(`✅ Got product from optionId:`, {
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    optionId: product.optionId,
                  });
                  
                  // Tạo URL và map product
                  const finalOptionId = product.optionId || optionId;
                  const productUrl = `/products/${slug}?id=${finalOptionId}`;
                  
                  matchedProduct = {
                    id: finalOptionId,
                    imageUrl: product.thumbnail || p.thumbnail || p.imageUrl || null,
                    productUrl,
                    matchScore: Math.round((p.similarity || 0) * 100),
                    name: product.name || null,
                    price: product.price || null,
                  };
                  console.log(`✅ Mapped product for ${item.loai}:`, matchedProduct);
                  break; // Tìm được product hợp lệ, dừng lại
                }
              } catch (error) {
                console.warn(`Error fetching product by optionId ${optionId}:`, error);
                continue; // Thử product tiếp theo
              }
            } 
            // Nếu chỉ có product_id, cần lấy option đầu tiên của product đó
            else if (productId) {
              try {
                console.log(`⚠️ Only product_id available, fetching product options for ${item.loai}...`);
                
                // Lấy danh sách products theo loại (áo hoặc quần) và tìm product có productId này
                const allProducts = await getProductListByType(item.loai);
                console.log(`📋 Searching in ${allProducts.length} products of type ${item.loai}`);
                const matchedProductFromList = allProducts.find(
                  (prod) => prod.productId === productId
                );
                
                if (matchedProductFromList && matchedProductFromList.slug) {
                  product = matchedProductFromList;
                  slug = product.slug;
                  console.log(`✅ Got product from product list:`, {
                    slug: product.slug,
                    name: product.name,
                    optionId: product.optionId,
                  });
                  
                  // Tạo URL và map product
                  const finalOptionId = product.optionId || productId;
                  const productUrl = `/products/${slug}?id=${finalOptionId}`;
                  
                  matchedProduct = {
                    id: finalOptionId,
                    imageUrl: product.thumbnail || p.thumbnail || p.imageUrl || null,
                    productUrl,
                    matchScore: Math.round((p.similarity || 0) * 100),
                    name: product.name || null,
                    price: product.price || null,
                  };
                  console.log(`✅ Mapped product for ${item.loai}:`, matchedProduct);
                  break; // Tìm được product hợp lệ, dừng lại
                } else {
                  // Fallback: thử dùng productId trực tiếp (có thể là optionId)
                  console.log(`⚠️ Product not found in list, trying productId as optionId...`);
                  try {
                    product = await productDetailsService.getProductById(productId);
                    if (product && product.slug) {
                      slug = product.slug;
                      const finalOptionId = product.optionId || productId;
                      const productUrl = `/products/${slug}?id=${finalOptionId}`;
                      
                      matchedProduct = {
                        id: finalOptionId,
                        imageUrl: product.thumbnail || p.thumbnail || p.imageUrl || null,
                        productUrl,
                        matchScore: Math.round((p.similarity || 0) * 100),
                        name: product.name || null,
                        price: product.price || null,
                      };
                      console.log(`✅ Fallback: Got product using productId as optionId`);
                      break; // Tìm được product hợp lệ, dừng lại
                    }
                  } catch (fallbackError) {
                    console.warn(`Fallback also failed for productId ${productId}:`, fallbackError);
                    continue; // Thử product tiếp theo
                  }
                }
              } catch (error) {
                console.warn(`Error processing productId ${productId}:`, error);
                // Fallback: thử dùng productId trực tiếp
                try {
                  product = await productDetailsService.getProductById(productId);
                  if (product && product.slug) {
                    slug = product.slug;
                    const finalOptionId = product.optionId || productId;
                    const productUrl = `/products/${slug}?id=${finalOptionId}`;
                    
                    matchedProduct = {
                      id: finalOptionId,
                      imageUrl: product.thumbnail || p.thumbnail || p.imageUrl || null,
                      productUrl,
                      matchScore: Math.round((p.similarity || 0) * 100),
                      name: product.name || null,
                      price: product.price || null,
                    };
                    console.log(`✅ Fallback: Got product using productId as optionId`);
                    break; // Tìm được product hợp lệ, dừng lại
                  }
                } catch (fallbackError) {
                  console.warn(`Fallback also failed:`, fallbackError);
                  continue; // Thử product tiếp theo
                }
              }
            } else {
              console.warn(`No identifier found for product:`, p);
              continue; // Thử product tiếp theo
            }
          } catch (error) {
            console.warn(`Error processing product:`, error);
            continue; // Thử product tiếp theo
          }
        }

        const matchedProducts = matchedProduct ? [matchedProduct] : [];

        // Filter out null values (products that failed to fetch or have no slug)
        const validMatchedProducts = matchedProducts.filter((p): p is NonNullable<typeof p> => p !== null);
          
          console.log(`Final matchedProducts for ${item.loai}:`, validMatchedProducts);
          
          return {
            category: item.loai,
            suggestion: item.mo_ta,
            matchedProducts: validMatchedProducts,
          };
        }),
    );

    console.log("Final result:", result);
    console.log("Result length:", result.length);
    console.log("================================");

    return result;
  }
}

