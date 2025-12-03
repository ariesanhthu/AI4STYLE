const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Auth-specific API helpers
export type ApiResponse<T> = { data?: T; error?: string };

export async function apiPost<T>(
  path: string,
  body: any,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    
    const json = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      return { error: json?.message || res.statusText };
    }
    
    return { data: json as T };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function apiGet<T>(
  path: string,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    const json = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      return { error: json?.message || res.statusText };
    }
    
    return { data: json as T };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
