import { Client } from "@gradio/client";
import { VtonParams, VtonCategory } from "../types/vton.type";

/**
 * Service for Virtual Try-On operations using Hugging Face Gradio Client.
 * 
 * Handles connection to levihsu/OOTDiffusion model and processes
 * person and garment images to generate try-on results.
 */
export const vtonService = {
  /**
   * Generate a virtual try-on image from person and garment images.
   * 
   * Args:
   *   params: VtonParams - Contains personImg, garmentImg, category, and isHD flag
   * 
   * Returns:
   *   Promise<string> - URL of the generated try-on image
   * 
   * Raises:
   *   Error - If connection fails or no data is returned from AI
   */
  async generateTryOn({
    personImg,
    garmentImg,
    category = "Upper-body",
    isHD = false,
  }: VtonParams): Promise<string> {
    try {
      const client = await Client.connect("levihsu/OOTDiffusion");

      // Chọn endpoint dựa trên nhu cầu (HD hoặc Category)
      const endpoint = isHD ? "/process_hd" : "/process_dc";

      const payload: any = {
        vton_img: personImg,
        garm_img: garmentImg,
        n_samples: 1,
        n_steps: 20,
        image_scale: 2,
        seed: -1,
      };

      // Nếu không phải bản HD thì cần thêm category
      if (!isHD) {
        payload.category = category;
      }

      const result = await client.predict(endpoint, payload);

      // Kết quả từ Gradio thường trả về một mảng chứa thông tin file
      if (result.data && Array.isArray(result.data)) {
        // Trả về URL của ảnh đầu tiên trong gallery
        return (result.data[0] as any)[0].image.url;
      }

      throw new Error("Không nhận được dữ liệu trả về từ AI");
    } catch (error) {
      console.error("VTON Service Error:", error);
      throw error;
    }
  },
};

