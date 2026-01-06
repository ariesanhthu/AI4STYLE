import { Module } from '@nestjs/common';
import { ChatbotController } from '@/presentation/controllers/chatbot/chatbot.controller';
import { SearchOutfitUseCase } from './search-outfit.use-case';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { ChatbotOrchestratorUseCase } from './chatbot-orchestrator.use-case';

@Module({
  imports: [InfrastructureModule],
  controllers: [ChatbotController],
  providers: [SearchOutfitUseCase, ChatbotOrchestratorUseCase],
})
export class ChatbotModule {}