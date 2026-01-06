import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatbotOrchestratorUseCase } from '@/application/chatbot/chatbot-orchestrator.use-case';
import type { ChatbotTaskType } from '@/application/chatbot/chatbot.types';
import { Public } from '@/presentation/guards/decorators';

@Controller('chatbot') // URL: http://localhost:3000/chatbot
export class ChatbotController {
  constructor(private readonly chatbotOrchestratorUseCase: ChatbotOrchestratorUseCase) {}

  @Public()
  @Post('recommend') // Quy định đây là phương thức POST
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