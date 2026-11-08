export interface ApiResponse<T = unknown> {
  code: number | string;
  message: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public readonly code: number | string,
    message: string,
    public readonly status?: number,
    public readonly raw?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}
