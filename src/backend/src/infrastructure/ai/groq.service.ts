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
}