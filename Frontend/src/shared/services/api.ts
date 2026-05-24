const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  status: number;
  code: string;
  userMessage: string;

  constructor(status: number, code: string, userMessage: string) {
    super(userMessage);
    this.status = status;
    this.code = code;
    this.userMessage = userMessage;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ code: 'UNKNOWN', message: 'An error occurred' }));
    throw new ApiError(response.status, error.code || 'UNKNOWN', error.message || 'An error occurred');
  }

  return response.json();
}

function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>(url + toQueryString(params)),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
};
