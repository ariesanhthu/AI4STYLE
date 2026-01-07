import { GroqService } from "./groq.service";
import { SearchOutfitUseCase } from "./search-outfit.use-case";
import { productService } from "@/features/user-product/services/product.service";
import type { Category } from "@/features/user-product/types/category";

/**
 * Chatbot Task Types
 */
export type ChatbotTaskType =
  | "TASK_VTON"
  | "TASK_SUGGESTION"
  | "TASK_FIND"
  | "TASK_OTHER";

export type ChatbotUiType = "VTON" | "SUGGESTIONS" | "PRODUCTS" | "TEXT";

/**
 * Chatbot Request DTO
 */
export interface ChatbotRequestDto {
  prompt: string;
  taskType?: ChatbotTaskType | null;
}

/**
 * Filter Options for Product Search
 */
export interface FilterOptions {
  cursor?: string;
  limit?: string;
  sortOrder?: "asc" | "desc";
  category_id?: string;
  color_family?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
  sortOption?: "price" | "time" | "relevance";
}

/**
 * Chatbot Response DTO
 */
export interface ChatbotResponseDto {
  taskType: ChatbotTaskType;
  ui: ChatbotUiType;
  message: string;
  recommendations?: unknown;
  suggestions?: string[];
  filterOptions?: FilterOptions;
  required?: {
    fields: Array<"personImage" | "garmentImage" | "category" | "isHD">;
  };
}

/**
 * Chatbot Orchestrator Use Case
 * 
 * Điều phối các tác vụ chatbot dựa trên task type
 * Tương tự backend ChatbotOrchestratorUseCase
 */
export class ChatbotOrchestratorUseCase {
  private groqService: GroqService;
  private searchOutfitUseCase: SearchOutfitUseCase;
  private categoriesCache: Category[] | null = null;

  constructor() {
    this.groqService = new GroqService();
    this.searchOutfitUseCase = new SearchOutfitUseCase();
  }

  /**
   * Find category ID by name (recursive search in category tree)
   * Supports partial matching (e.g., "áo" matches "Áo", "áo sơ mi", etc.)
   * 
   * Args:
   *   categories: Category[] - Category tree
   *   categoryName: string - Category name to search for (e.g., "áo", "quần", "áo sơ mi")
   * 
   * Returns:
   *   string | undefined - Category ID if found, undefined otherwise
   */
  private findCategoryIdByName(
    categories: Category[],
    categoryName: string
  ): string | undefined {
    const normalizedName = categoryName.toLowerCase().trim();
    
    // Common category name mappings (Vietnamese)
    const categoryMappings: Record<string, string[]> = {
      "áo": ["áo", "shirt", "top", "blouse"],
      "quần": ["quần", "pants", "trousers", "jeans"],
      "giày": ["giày", "shoes", "sneakers", "boots"],
      "phụ kiện": ["phụ kiện", "accessories", "phụ kiện"],
    };
    
    for (const category of categories) {
      const categoryNameLower = category.name.toLowerCase().trim();
      
      // Exact match
      if (categoryNameLower === normalizedName) {
        return category.categoryId;
      }
      
      // Partial match: check if category name contains search term or vice versa
      if (
        categoryNameLower.includes(normalizedName) ||
        normalizedName.includes(categoryNameLower)
      ) {
        return category.categoryId;
      }
      
      // Check category mappings
      for (const [key, aliases] of Object.entries(categoryMappings)) {
        if (aliases.includes(normalizedName)) {
          // If the category name contains the mapped key, it's a match
          if (categoryNameLower.includes(key)) {
            return category.categoryId;
          }
        }
      }
      
      // Check in children recursively
      if (category.childrens && category.childrens.length > 0) {
        const found = this.findCategoryIdByName(category.childrens, categoryName);
        if (found) {
          return found;
        }
      }
    }
    
    return undefined;
  }

  /**
   * Get categories (with caching)
   * 
   * Returns:
   *   Promise<Category[]> - Category tree
   */
  private async getCategories(): Promise<Category[]> {
    if (this.categoriesCache) {
      return this.categoriesCache;
    }
    
    try {
      const categories = await productService.getCategories();
      this.categoriesCache = categories;
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * Map category name to category_id
   * 
   * Args:
   *   categoryName: string | undefined - Category name from AI
   * 
   * Returns:
   *   Promise<string | undefined> - Category ID if found
   */
  private async mapCategoryNameToId(
    categoryName: string | undefined
  ): Promise<string | undefined> {
    if (!categoryName) {
      return undefined;
    }
    
    const categories = await this.getCategories();
    const categoryId = this.findCategoryIdByName(categories, categoryName);
    
    if (categoryId) {
      console.log(`Mapped category name "${categoryName}" to category_id: ${categoryId}`);
    } else {
      console.warn(`Could not find category_id for category name: "${categoryName}"`);
    }
    
    return categoryId;
  }

  /**
   * Execute chatbot orchestration
   * 
   * Args:
   *   input: ChatbotRequestDto - Request với prompt và optional taskType
   * 
   * Returns:
   *   Promise<ChatbotResponseDto> - Response với task type và UI type tương ứng
   */
  async execute(input: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    const prompt = (input.prompt || "").trim();
    if (!prompt) {
      return {
        taskType: "TASK_OTHER",
        ui: "TEXT",
        message: "Bạn nhập giúp mình nội dung cần hỗ trợ nhé.",
      };
    }

    // Debug: Log input
    console.log("=== Chatbot Orchestrator Execute ===");
    console.log("Input prompt:", prompt);
    console.log("Input taskType:", input.taskType);
    
    let resolvedTask: ChatbotTaskType;
    
    if (input.taskType) {
      // Nếu có taskType từ input, dùng nó
      resolvedTask = input.taskType;
      console.log("Using provided taskType:", resolvedTask);
    } else {
      // Nếu không có, gọi classifyTask
      console.log("No taskType provided, calling classifyTask...");
      try {
        resolvedTask = await this.groqService.classifyTask(prompt);
        console.log("ClassifyTask returned:", resolvedTask);
      } catch (error) {
        console.error("Error in classifyTask:", error);
        resolvedTask = "TASK_OTHER";
        console.log("Fallback to TASK_OTHER");
      }
    }
    
    // Validate resolvedTask
    if (!resolvedTask || (resolvedTask !== "TASK_VTON" && resolvedTask !== "TASK_SUGGESTION" && resolvedTask !== "TASK_FIND" && resolvedTask !== "TASK_OTHER")) {
      console.error("Invalid resolvedTask:", resolvedTask);
      resolvedTask = "TASK_OTHER";
      console.log("Forced to TASK_OTHER");
    }
    
    console.log("Final resolvedTask:", resolvedTask);
    console.log("====================================");

    if (resolvedTask === "TASK_VTON") {
      return {
        taskType: "TASK_VTON",
        ui: "VTON",
        message:
          "Ok, mình chuyển bạn sang chế độ Thử đồ ảo. Bạn cần cung cấp ảnh người + ảnh trang phục (và chọn loại đồ/HD nếu muốn).",
        required: {
          fields: ["personImage", "garmentImage", "category", "isHD"],
        },
      };
    }

    if (resolvedTask === "TASK_SUGGESTION") {
      // TASK_SUGGESTION giờ sẽ tìm kiếm sản phẩm (1 quần, 1 áo) thay vì gợi ý câu hỏi
      console.log("=== Chatbot Orchestrator: TASK_SUGGESTION ===");
      console.log("Executing search outfit use case for product suggestions...");
      const recommendations = await this.searchOutfitUseCase.execute(prompt);
      console.log("Search outfit result:", recommendations);
      console.log("Recommendations type:", typeof recommendations);
      console.log("Recommendations is array:", Array.isArray(recommendations));
      if (recommendations) {
        console.log("Recommendations length:", Array.isArray(recommendations) ? recommendations.length : "not array");
        if (Array.isArray(recommendations) && recommendations.length > 0) {
          console.log("First recommendation:", recommendations[0]);
          if (recommendations[0]?.matchedProducts) {
            console.log("First recommendation matchedProducts:", recommendations[0].matchedProducts);
            console.log("MatchedProducts length:", recommendations[0].matchedProducts.length);
          }
        }
      }
      console.log("==============================================");
      
      return {
        taskType: "TASK_SUGGESTION",
        ui: "PRODUCTS", // Đổi từ "SUGGESTIONS" sang "PRODUCTS" để hiển thị sản phẩm
        message: "Mình gợi ý vài món phù hợp nè:",
        recommendations, // Trả về recommendations thay vì suggestions
      };
    }

    if (resolvedTask === "TASK_FIND") {
      console.log("=== Chatbot Orchestrator: TASK_FIND ===");
      console.log("Extracting filter options from prompt...");
      const filterOptions = await this.groqService.extractFilterOptions(prompt);
      console.log("Extracted filter options (before mapping):", filterOptions);
      
      // Map category name to category_id if category_id is a name (not UUID)
      if (filterOptions.category_id) {
        // Check if category_id looks like a UUID (contains hyphens and is long)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          filterOptions.category_id
        );
        
        if (!isUUID) {
          // It's a category name, need to map to category_id
          console.log(`Mapping category name "${filterOptions.category_id}" to category_id...`);
          const mappedCategoryId = await this.mapCategoryNameToId(filterOptions.category_id);
          
          if (mappedCategoryId) {
            filterOptions.category_id = mappedCategoryId;
            console.log(`Successfully mapped to category_id: ${mappedCategoryId}`);
          } else {
            // If mapping fails, remove category_id to avoid invalid filter
            console.warn(`Failed to map category name "${filterOptions.category_id}", removing from filters`);
            delete filterOptions.category_id;
          }
        } else {
          console.log(`category_id "${filterOptions.category_id}" is already a valid UUID`);
        }
      }
      
      console.log("Final filter options (after mapping):", filterOptions);
      console.log("========================================");
      
      return {
        taskType: "TASK_FIND",
        ui: "PRODUCTS",
        message: "Đang tìm kiếm sản phẩm phù hợp với yêu cầu của bạn...",
        filterOptions,
      };
    }

    const message = await this.groqService.respondGeneral(prompt);
    return {
      taskType: "TASK_OTHER",
      ui: "TEXT",
      message,
    };
  }
}

