import { GroqService } from "./groq.service";
import { SearchOutfitUseCase } from "./search-outfit.use-case";

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
 * Chatbot Response DTO
 */
export interface ChatbotResponseDto {
  taskType: ChatbotTaskType;
  ui: ChatbotUiType;
  message: string;
  recommendations?: unknown;
  suggestions?: string[];
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

  constructor() {
    this.groqService = new GroqService();
    this.searchOutfitUseCase = new SearchOutfitUseCase();
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
      console.log("Executing search outfit use case...");
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
      console.log("========================================");
      
      return {
        taskType: "TASK_FIND",
        ui: "PRODUCTS",
        message: "Mình gợi ý vài món phù hợp nè:",
        recommendations,
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

