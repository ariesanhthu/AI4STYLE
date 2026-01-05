import { Injectable } from '@nestjs/common';

@Injectable()
export class HuggingFaceEmbeddingService {
  private readonly apiUrl = "https://api-inference.huggingface.co/models/dangvantuan/vietnamese-embedding";
  private readonly token = process.env.HF_TOKEN;

  async generate(text: string): Promise<number[]> {
    const response = await fetch(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error(`HF API Error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Đối với feature-extraction, kết quả thường là mảng lồng nhau [[vector]]
    // Chúng ta cần làm phẳng nó về dạng [number, number, ...]
    return Array.isArray(result[0]) ? result[0] : result;
  }
}