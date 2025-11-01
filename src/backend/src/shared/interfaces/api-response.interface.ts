export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  code: number;
  timestamp: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  success: boolean;
  timestamp: string;
}