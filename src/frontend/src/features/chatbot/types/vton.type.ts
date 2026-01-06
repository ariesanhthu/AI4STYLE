export type VtonCategory = "Upper-body" | "Lower-body" | "Dress";

export interface VtonParams {
  personImg: Blob | File;
  garmentImg: Blob | File;
  category?: VtonCategory;
  isHD?: boolean; // true dùng /process_hd, false dùng /process_dc
}

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
  type?: "text" | "image";
  productId?: string; // ID của product nếu có trong message
}

