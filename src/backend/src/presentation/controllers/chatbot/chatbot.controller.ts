import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChatbotOrchestratorUseCase } from '@/application/chatbot/chatbot-orchestrator.use-case';
import type { ChatbotTaskType } from '@/application/chatbot/chatbot.types';
import { Public } from '@/presentation/guards/decorators';

/**
 * Chatbot Controller
 * 
 * Public endpoint - không cần đăng nhập để sử dụng
 * Chỉ cần API key hợp lệ trong header x-api-key
 */
@ApiTags('Chatbot')
@ApiSecurity('x-api-key')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotOrchestratorUseCase: ChatbotOrchestratorUseCase) {}

  /**
   * Get AI recommendation based on user prompt
   * 
   * Public endpoint - không cần authentication token
   * Chỉ cần API key hợp lệ
   */
  @Public()
  @ApiOperation({ 
    summary: 'Get AI chatbot recommendation',
    description: 'Public endpoint - không cần đăng nhập. Chỉ cần API key hợp lệ trong header x-api-key'
  })
  @Post('recommend')
  async recommend(
    @Body()
    body: {
      prompt?: string;
      taskType?: ChatbotTaskType | null;
      task_type?: ChatbotTaskType | null;
    },
  ) {
    const prompt = (body?.prompt || '').trim();
    if (!prompt) {
      throw new BadRequestException('prompt is required');
    }

    const taskType = body?.taskType ?? body?.task_type ?? null;
    return await this.chatbotOrchestratorUseCase.execute({ prompt, taskType });
  }
}