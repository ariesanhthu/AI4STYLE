
import { apiClient } from '@/lib/api-client';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const healthBackendService = {
  async getHealthStatus(): Promise<any> {
    return apiClient<any>(`${BASE_URL}health`);
  }
};
