import Groq from "groq-sdk";

/**
 * Groq Service
 * 
 * Service để xử lý các tác vụ AI sử dụng Groq SDK
 * Tương tự backend GroqService
 */
export class GroqService {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    this.groq = new Groq({ apiKey });
  }

  /**
   * Extract JSON từ text response của AI
   * 
   * Helper function để xử lý trường hợp AI trả về markdown hoặc text kèm JSON
   * Sử dụng regex để tìm và extract JSON object/array từ text
   * 
   * Args:
   *   text: string - Raw text từ AI response
   *   defaultValue: any - Default value nếu không parse được
   * 
   * Returns:
   *   any - Parsed JSON object hoặc defaultValue
   */
  private extractJsonFromText(text: string, defaultValue: any = {}): any {
    if (!text || typeof text !== "string") {
      return defaultValue;
    }

    // Thử parse trực tiếp trước (trường hợp AI trả về JSON thuần)
    try {
      return JSON.parse(text);
    } catch {
      // Nếu không parse được, dùng regex để extract JSON
    }

    // Tìm JSON object trong text (từ { đầu tiên đến } cuối cùng)
    const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      try {
        return JSON.parse(jsonObjectMatch[0]);
      } catch (error) {
        console.error("Failed to parse extracted JSON object:", error);
      }
    }

    // Tìm JSON array trong text (từ [ đầu tiên đến ] cuối cùng)
    const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch) {
      try {
        return JSON.parse(jsonArrayMatch[0]);
      } catch (error) {
        console.error("Failed to parse extracted JSON array:", error);
      }
    }

    // Nếu không tìm thấy JSON, log warning và trả về default
    console.warn("No valid JSON found in AI response:", text.substring(0, 200));
    return defaultValue;
  }

  /**
   * Breakdown outfit prompt thành các items (áo/quần)
   * 
   * Args:
   *   prompt: string - User's outfit description
   * 
   * Returns:
   *   Promise<Array<{loai: 'áo'|'quần', mo_ta: string}>> - Array of outfit items (tối đa 1 áo và 1 quần)
   */
  async breakdownOutfit(
    prompt: string
  ): Promise<Array<{ loai: "áo" | "quần"; mo_ta: string }>> {
    console.log("=== GroqService.breakdownOutfit ===");
    console.log("Prompt:", prompt);

    const systemPrompt = `Bạn là một Stylist chuyên nghiệp. Hãy phân tích yêu cầu của khách hàng và đề xuất một bộ đồ phối sẵn.
Trả về kết quả duy nhất dưới định dạng JSON là một danh sách các món đồ.
Mỗi món đồ gồm: 'loai' (áo, quần) và 'mo_ta' (chi tiết màu sắc, chất liệu, kiểu dáng).
Chỉ đề xuất áo, quần không gồm những loại khác
Ví dụ định dạng:
[
  {"loai": "áo", "mo_ta": "áo sơ mi lụa màu trắng form rộng sang trọng"},
  {"loai": "quần", "mo_ta": "quần tây đen ống đứng vải cao cấp"}
]
Chỉ trả về JSON, không giải thích gì thêm.`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Groq completion:", completion);
      const raw = completion.choices[0]?.message?.content || "";
      console.log("Raw response:", raw);

      // Parse JSON giống Python: json.loads(completion.choices[0].message.content)
      let aiResponse: any;
      try {
        aiResponse = JSON.parse(raw);
        console.log("Parsed AI response:", aiResponse);
      } catch (error) {
        console.error("Failed to parse JSON, trying extractJsonFromText:", error);
        aiResponse = this.extractJsonFromText(raw, {});
      }

      // Logic giống Python:
      // items = ai_response if isinstance(ai_response, list) else list(ai_response.values())[0]
      let items: any[] = [];
      if (Array.isArray(aiResponse)) {
        items = aiResponse;
        console.log("AI response is array, using directly");
      } else if (aiResponse && typeof aiResponse === "object") {
        // Lấy giá trị đầu tiên của object (giống Python: list(ai_response.values())[0])
        const values = Object.values(aiResponse);
        if (values.length > 0 && Array.isArray(values[0])) {
          items = values[0] as any[];
          console.log("AI response is object, using first value as array");
        } else if (Array.isArray((aiResponse as any).items)) {
          items = (aiResponse as any).items;
          console.log("AI response has 'items' key");
        } else {
          // Fallback: thử tìm array trong object
          const firstVal = values[0];
          if (Array.isArray(firstVal)) {
            items = firstVal;
            console.log("AI response object, using first value");
          }
        }
      }

      console.log("Extracted items:", items);
      console.log("Items count:", items.length);

      // Sanitize + chỉ lấy tối đa 1 áo + 1 quần
      const aoItems = items
        .filter((it) => it?.loai === "áo" && it?.mo_ta)
        .slice(0, 1);
      const quanItems = items
        .filter((it) => it?.loai === "quần" && it?.mo_ta)
        .slice(0, 1);

      const result = [...aoItems, ...quanItems];
      console.log("Final result:", result);
      console.log("================================");
      return result;
    } catch (error) {
      console.error("Error in breakdownOutfit:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return [];
    }
  }
  

  /**
   * Classify task type từ user prompt
   * 
   * Args:
   *   prompt: string - User's input prompt
   * 
   * Returns:
   *   Promise<'TASK_VTON' | 'TASK_SUGGESTION' | 'TASK_FIND' | 'TASK_OTHER'> - Task type
   */
  async classifyTask(
    prompt: string,
  ): Promise<"TASK_VTON" | "TASK_SUGGESTION" | "TASK_FIND" | "TASK_OTHER"> {
    try {
      console.log("=== GroqService.classifyTask ===");
      console.log("Prompt:", prompt);
      
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: [
              "Bạn là bộ phân loại tác vụ cho chatbot thời trang.",
              'Trả về DUY NHẤT JSON object có key "taskType" là một trong:',
              '"TASK_VTON" (thử đồ ảo, mặc thử trang phục lên người, đổi outfit, virtual try-on),',
              '"TASK_SUGGESTION" (GỢI Ý trang phục, tư vấn phối đồ, gợi ý sản phẩm phù hợp, hỏi "mặc gì cho đẹp", "nên mua gì"),',
              '"TASK_FIND" (câu hỏi liên quan đến tìm kiếm sản phẩm có dữ liệu filter -> trả về JSON theo interface chuyển truy vấn của người dùng thành JSON FilterOptions.INTERFACE:{cursor?: string, limit?: string, sortOrder?: "asc" | "desc", category_id?: string, color_family?: string,min_price?: string, max_price?: string,search?: string, sortOption?: "price" |"created_at" | "relevance"}',
              '"TASK_OTHER" (các câu hỏi về tính năng của bot "bạn làm được gì", chào hỏi, hoặc các nội dung khác).',
              "LƯU Ý QUAN TRỌNG:",
              "- Bất kỳ khi nào user yêu cầu 'Gợi ý...', 'Tư vấn phối đồ...' -> TASK_SUGGESTION.",
              "- Nếu user hỏi về chức năng bot hoặc 'bạn làm được gì' -> TASK_OTHER.",
              "QUAN TRỌNG: Chỉ trả về JSON. Không giải thích. Không thêm markdown. Không thêm text ngoài JSON.",
            ].join("\n"),
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Groq completion:", completion);
      console.log("Completion choices:", completion.choices);
      
      if (!completion.choices || completion.choices.length === 0) {
        console.error("No choices in completion response");
        return "TASK_OTHER";
      }

      const message = completion.choices[0]?.message;
      if (!message) {
        console.error("No message in completion response");
        return "TASK_OTHER";
      }

      // Groq compound model có thể trả về JSON trong reasoning field
      // Ưu tiên đọc từ reasoning trước, nếu không có mới đọc từ content
      let raw = "";
      if ((message as any).reasoning) {
        raw = (message as any).reasoning;
        console.log("Found reasoning field, using it:", raw);
      } else {
        raw = message.content || "{}";
        console.log("No reasoning field, using content:", raw);
      }
      
      // Tìm JSON trong raw text (có thể ở cuối reasoning hoặc trong content)
      const parsed = this.extractJsonFromText(raw, { taskType: "TASK_OTHER" }) as {
        taskType?: string;
      };
      console.log("Parsed JSON:", parsed);
      
      const taskType = parsed?.taskType;
      console.log("Extracted taskType:", taskType);
      console.log("TaskType type:", typeof taskType);

      if (
        taskType === "TASK_VTON" ||
        taskType === "TASK_SUGGESTION" ||
        taskType === "TASK_FIND" ||
        taskType === "TASK_OTHER"
      ) {
        console.log("Valid taskType, returning:", taskType);
        console.log("================================");
        return taskType;
      }

      console.warn("Invalid taskType, defaulting to TASK_OTHER");
      console.log("================================");
      return "TASK_OTHER";
    } catch (error) {
      console.error("Error in classifyTask:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      console.log("Returning TASK_OTHER as fallback");
      console.log("================================");
      return "TASK_OTHER";
    }
  }

  /**
   * Extract filter options from user prompt for product search
   * 
   * Args:
   *   prompt: string - User's search query
   * 
   * Returns:
   *   Promise<FilterOptions> - Filter options extracted from prompt
   */
  async extractFilterOptions(prompt: string): Promise<{
    cursor?: string;
    limit?: string;
    sortOrder?: "asc" | "desc";
    category_id?: string;
    color_family?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sortOption?: "price" | "time" | "relevance";
  }> {
    console.log("=== GroqService.extractFilterOptions ===");
    console.log("Prompt:", prompt);

    const systemPrompt = `Bạn là một AI chuyên chuyển đổi truy vấn tìm kiếm của người dùng thành các bộ lọc sản phẩm.
Trả về DUY NHẤT JSON object theo interface FilterOptions:
{
  "cursor"?: string,
  "limit"?: string,
  "sortOrder"?: "asc" | "desc",
  "category_id"?: string,
  "color_family"?: string,
  "min_price"?: string,
  "max_price"?: string,
  "search"?: string,
  "sortOption"?: "price" | "time" | "relevance"
}

Hướng dẫn:
- "search": Từ khóa tìm kiếm chính từ prompt (ví dụ: "áo sơ mi", "quần jean")
- "category_id": ID danh mục nếu người dùng đề cập (ví dụ: "áo", "quần", "giày")
- "color_family": Màu sắc nếu được đề cập (ví dụ: "đỏ", "xanh", "trắng", "đen")
- "min_price" / "max_price": Khoảng giá nếu được đề cập (ví dụ: "dưới 500k" -> max_price: "500000")
- "sortOption": "price" (giá), "time" (mới nhất), "relevance" (liên quan - map thành "time")
- "sortOrder": "asc" (tăng dần) hoặc "desc" (giảm dần)
- "limit": Số lượng sản phẩm (mặc định không cần set, để frontend xử lý)

Chỉ trả về các trường có giá trị hợp lệ. Không trả về null hoặc undefined.
Chỉ trả về JSON. Không giải thích. Không thêm markdown.`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      console.log("Raw response:", raw);

      let filterOptions: any;
      try {
        filterOptions = JSON.parse(raw);
      } catch (error) {
        console.error("Failed to parse JSON, trying extractJsonFromText:", error);
        filterOptions = this.extractJsonFromText(raw, {});
      }

      // Sanitize: loại bỏ các trường null/undefined/empty string và map sortOption
      const sanitized: any = {};
      Object.entries(filterOptions).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          // Map sortOption: "created_at" -> "time", "relevance" -> "time"
          if (key === "sortOption") {
            if (value === "created_at" || value === "relevance") {
              sanitized[key] = "time";
            } else {
              sanitized[key] = value;
            }
          } else {
            sanitized[key] = value;
          }
        }
      });

      console.log("Extracted filter options:", sanitized);
      console.log("================================");
      return sanitized;
    } catch (error) {
      console.error("Error in extractFilterOptions:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      // Fallback: chỉ trả về search từ prompt
      return { search: prompt };
    }
  }

  /**
   * Respond to general questions
   * 
   * Args:
   *   prompt: string - User's input prompt
   * 
   * Returns:
   *   Promise<string> - AI response message
   */
  async respondGeneral(prompt: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content: [
            "Bạn là trợ lý thời trang AI cho shop.",
            "Trả lời ngắn gọn, hữu ích, đúng trọng tâm bằng tiếng Việt.",
            "Nếu thiếu thông tin để tư vấn, hãy hỏi tối đa 2 câu hỏi làm rõ.",
          ].join("\n"),
        },
        { role: "user", content: prompt },
      ],
    });

    return (
      completion.choices[0].message.content?.trim() ||
      "Mình chưa hiểu rõ, bạn mô tả thêm giúp mình một chút nhé?"
    );
  }
}

