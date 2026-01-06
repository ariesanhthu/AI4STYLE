import { NextRequest, NextResponse } from "next/server";
import { ChatbotOrchestratorUseCase } from "@/features/chatbot/services/chatbot-orchestrator.use-case";
import type { ChatbotTaskType } from "@/features/chatbot/services/chatbot-orchestrator.use-case";

/**
 * Chatbot API Route
 * 
 * Xử lý logic chatbot trực tiếp tại Next.js API Route
 * Không gọi backend nữa, tự xử lý bằng các service tương tự backend
 * Luồng: Frontend -> Next.js API Route (xử lý logic) -> Response
 */

/**
 * POST /api/chatbot
 * 
 * Xử lý chatbot request và trả về response
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt, taskType, task_type } = body;

    // Validate prompt
    const trimmedPrompt = (prompt || "").trim();
    if (!trimmedPrompt) {
      return NextResponse.json(
        {
          success: false,
          message: "prompt is required",
        },
        { status: 400 },
      );
    }

    // Prepare request
    const chatbotRequest = {
      prompt: trimmedPrompt,
      taskType: (taskType ?? task_type ?? null) as ChatbotTaskType | null,
    };

    // Debug: Log request
    console.log("=== Chatbot API Route ===");
    console.log("Request prompt:", trimmedPrompt);
    console.log("Request taskType:", chatbotRequest.taskType);
    console.log("=========================");

    // Execute chatbot orchestration
    const orchestrator = new ChatbotOrchestratorUseCase();
    const result = await orchestrator.execute(chatbotRequest);

    // Debug: Log result
    console.log("=== Chatbot API Route Result ===");
    console.log("Result taskType:", result.taskType);
    console.log("Result ui:", result.ui);
    console.log("Result message:", result.message);
    console.log("Result recommendations:", result.recommendations);
    console.log("Result recommendations type:", typeof result.recommendations);
    console.log("Result recommendations is array:", Array.isArray(result.recommendations));
    if (result.recommendations) {
      console.log("Result recommendations length:", Array.isArray(result.recommendations) ? result.recommendations.length : "not array");
      if (Array.isArray(result.recommendations) && result.recommendations.length > 0) {
        console.log("First recommendation:", result.recommendations[0]);
      }
    }
    console.log("Full Result:", JSON.stringify(result, null, 2));
    console.log("=================================");

    // Success response
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Chatbot API route error:", error);
    
    // Log chi tiết hơn để debug
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}

