import { Controller, Post, Body } from '@nestjs/common';
import { SearchOutfitUseCase } from '@/application/chatbot/search-outfit.use-case';

@Controller('chatbot') // URL: http://localhost:3000/chatbot
export class ChatbotController {
  constructor(private readonly searchOutfitUseCase: SearchOutfitUseCase) {}

  @Post('recommend') // Quy định đây là phương thức POST
  // Dữ liệu 'prompt' sẽ được lấy từ Body của request
  async recommend(@Body('prompt') prompt: string) {
    return await this.searchOutfitUseCase.execute(prompt);
  }
}