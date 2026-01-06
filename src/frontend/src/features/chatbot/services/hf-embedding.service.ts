/**
 * HuggingFace Embedding Service (Router endpoint)
 *
 * Uses Hugging Face Router Inference endpoint for feature-extraction:
 * https://router.huggingface.co/hf-inference/models/{modelId}/pipeline/feature-extraction
 *
 * Docs: Feature Extraction task / Inference Providers
 */
export class HuggingFaceEmbeddingService {
  private readonly modelId = "dangvantuan/vietnamese-embedding";
  private readonly apiUrl = `https://router.huggingface.co/hf-inference/models/${this.modelId}/pipeline/feature-extraction`;
  private readonly token: string;

  constructor() {
    const t = process.env.HF_TOKEN;
    if (!t) throw new Error("HF_TOKEN is not set in environment variables");
    this.token = t;
  }

  private async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async generate(text: string): Promise<number[]> {
    console.log("=== HuggingFace Embedding Service ===");
    console.log("Input text:", text);
    
    // 503 "model loading" can happen; retry a few times.
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);
      
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          // optional flags if you want:
          // normalize: true,
        }),
      });

      console.log("Response status:", response.status);

      // Happy path
      if (response.ok) {
        const result = await response.json();
        console.log("Response format:", Array.isArray(result) ? "array" : typeof result);

        // Expected formats:
        // - [[...vector]] or [...vector]
        // - { data: [[...vector]] } (some wrappers)
        let vector: number[];
        
        if (Array.isArray(result)) {
          vector = Array.isArray(result[0]) ? (result[0] as number[]) : (result as number[]);
        } else if (result && typeof result === "object" && Array.isArray((result as any).data)) {
          const data = (result as any).data;
          vector = Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[]);
        } else {
          throw new Error(
            `Unexpected response format from HuggingFace API: ${JSON.stringify(result).substring(0, 200)}`
          );
        }

        // Validate vector (giống Python: embed_model.encode(mo_ta).tolist())
        if (!Array.isArray(vector) || vector.length === 0) {
          throw new Error(`Invalid vector format: ${JSON.stringify(vector).substring(0, 200)}`);
        }

        // Đảm bảo tất cả elements là numbers
        const validVector = vector.map((v) => {
          const num = typeof v === "number" ? v : parseFloat(String(v));
          if (isNaN(num)) {
            throw new Error(`Invalid vector element: ${v}`);
          }
          return num;
        });

        console.log("Generated vector length:", validVector.length);
        console.log("First 5 elements:", validVector.slice(0, 5));
        console.log("================================");
        return validVector;
      }

      // Handle common "model is loading" / temporary unavailable cases
      if (response.status === 503 && attempt < maxRetries) {
        let waitMs = 1200 * (attempt + 1);
        try {
          const errJson = await response.json();
          // HF often returns { error: "...", estimated_time: <seconds> }
          if (typeof errJson?.estimated_time === "number") {
            waitMs = Math.ceil(errJson.estimated_time * 1000) + 250;
          }
          console.log(`Model loading, waiting ${waitMs}ms...`);
        } catch {
          // ignore json parse errors, fall back to exponential-ish wait
        }
        await this.sleep(waitMs);
        continue;
      }

      // Other errors: surface body text/json to help debug
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`HF API Error: ${response.status} ${errorText}`);
      throw new Error(`HF API Error: ${response.status} ${errorText}`);
    }

    // Should never reach here
    throw new Error("HF API Error: exhausted retries");
  }
}
