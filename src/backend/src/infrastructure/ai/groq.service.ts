// src/infrastructure/ai/groq.service.ts
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  async breakdownOutfit(prompt: string) {
    const completion = await this.groq.chat.completions.create({
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content: `Bạn là Stylist. Trả về duy nhất JSON object có key "items" là mảng các object {loai: 'áo'|'quần', mo_ta: string}. Chỉ đề xuất áo và quần.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(completion.choices[0].message.content || '[]');
    return result.items || [];
  }

  async classifyTask(prompt: string): Promise<'TASK_VTON' | 'TASK_SUGGESTION' | 'TASK_FIND' | 'TASK_OTHER'> {
    const completion = await this.groq.chat.completions.create({
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content:
            [
              'Bạn là bộ phân loại tác vụ cho chatbot thời trang.',
              'Trả về DUY NHẤT JSON object có key "taskType" là một trong:',
              '"TASK_VTON" (thử đồ ảo, đổi outfit lên người),',
              '"TASK_FIND" (tìm sản phẩm / tư vấn phối đồ bằng việc tìm item trong shop),',
              '"TASK_SUGGESTION" (khi user hỏi "gợi ý câu hỏi", "bạn làm được gì", cần list gợi ý),',
              '"TASK_OTHER" (các câu hỏi khác).',
              'Không giải thích. Không thêm text ngoài JSON.',
            ].join('\n'),
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(raw) as { taskType?: string };
    const taskType = parsed?.taskType;

    if (
      taskType === 'TASK_VTON' ||
      taskType === 'TASK_SUGGESTION' ||
      taskType === 'TASK_FIND' ||
      taskType === 'TASK_OTHER'
    ) {
      return taskType;
    }

    return 'TASK_OTHER';
  }

  async suggestQuestions(prompt: string): Promise<string[]> {
    const completion = await this.groq.chat.completions.create({
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content:
            [
              'Bạn là trợ lý thời trang AI.',
              'Trả về DUY NHẤT JSON object có key "questions" là mảng 3-6 câu hỏi gợi ý ngắn gọn bằng tiếng Việt.',
              'Các câu hỏi nên bao phủ: tìm sản phẩm, tư vấn phối đồ, thử đồ ảo AI.',
              'Không giải thích. Không thêm text ngoài JSON.',
            ].join('\n'),
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(raw) as { questions?: unknown };
    const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];
    return questions.filter((q): q is string => typeof q === 'string' && q.trim().length > 0).slice(0, 6);
  }

  async respondGeneral(prompt: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: "groq/compound",
      messages: [
        {
          role: "system",
          content:
            [
              'Bạn là trợ lý thời trang AI cho shop.',
              'Trả lời ngắn gọn, hữu ích, đúng trọng tâm bằng tiếng Việt.',
              'Nếu thiếu thông tin để tư vấn, hãy hỏi tối đa 2 câu hỏi làm rõ.',
            ].join('\n'),
        },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content?.trim() || 'Mình chưa hiểu rõ, bạn mô tả thêm giúp mình một chút nhé?';
  }
}