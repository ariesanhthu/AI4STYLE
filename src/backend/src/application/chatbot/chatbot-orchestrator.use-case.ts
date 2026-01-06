import { Inject, Injectable } from '@nestjs/common';
import { GROQ_SERVICE } from '@/shared/interfaces';
import type { IGroqService } from '@/shared/interfaces';
import { SearchOutfitUseCase } from './search-outfit.use-case';
import type { ChatbotRequestDto, ChatbotResponseDto, ChatbotTaskType } from './chatbot.types';

@Injectable()
export class ChatbotOrchestratorUseCase {
  constructor(
    @Inject(GROQ_SERVICE) private readonly groqService: IGroqService,
    private readonly searchOutfitUseCase: SearchOutfitUseCase,
  ) {}

  async execute(input: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    const prompt = (input.prompt || '').trim();
    if (!prompt) {
      return {
        taskType: 'TASK_OTHER',
        ui: 'TEXT',
        message: 'Bạn nhập giúp mình nội dung cần hỗ trợ nhé.',
      };
    }

    const resolvedTask: ChatbotTaskType =
      input.taskType ?? (await this.groqService.classifyTask(prompt));

    if (resolvedTask === 'TASK_VTON') {
      return {
        taskType: 'TASK_VTON',
        ui: 'VTON',
        message:
          'Ok, mình chuyển bạn sang chế độ Thử đồ ảo. Bạn cần cung cấp ảnh người + ảnh trang phục (và chọn loại đồ/HD nếu muốn).',
        required: {
          fields: ['personImage', 'garmentImage', 'category', 'isHD'],
        },
      };
    }

    if (resolvedTask === 'TASK_SUGGESTION') {
      const suggestions = await this.groqService.suggestQuestions(prompt);
      return {
        taskType: 'TASK_SUGGESTION',
        ui: 'SUGGESTIONS',
        message: 'Bạn có thể thử mấy câu này:',
        suggestions,
      };
    }

    if (resolvedTask === 'TASK_FIND') {
      const recommendations = await this.searchOutfitUseCase.execute(prompt);
      return {
        taskType: 'TASK_FIND',
        ui: 'PRODUCTS',
        message: 'Mình gợi ý vài món phù hợp nè:',
        recommendations,
      };
    }

    const message = await this.groqService.respondGeneral(prompt);
    return {
      taskType: 'TASK_OTHER',
      ui: 'TEXT',
      message,
    };
  }
}


