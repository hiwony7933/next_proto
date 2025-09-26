// 공용 API 클라이언트(fetch 래퍼)
// - 서버/클라이언트 겸용
// - x-tenant 헤더 자동 주입

export interface ApiClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

function getTenantFromRuntime(): string | null {
  // 서버(Next.js): x-tenant는 미들웨어에서 주입되므로, 일반 fetch에서는 직접 접근 불가
  // 대신 클라이언트/환경에서 보조적으로 유추
  if (typeof window !== "undefined") {
    const cls = document?.body?.className || "";
    const m = cls.match(/tenant-(sk|cap|adt)/);
    if (m && m[1]) return m[1];
    const host = window.location.hostname.toLowerCase();
    if (host.startsWith("sk.") || host === "sk.localhost") return "sk";
    if (host.startsWith("cap.") || host === "cap.localhost") return "cap";
    if (host.startsWith("adt.") || host === "adt.localhost") return "adt";
  }
  return (process.env.NEXT_PUBLIC_DEV_TENANT as any) ?? null;
}

export class ApiClient {
  private readonly baseUrl?: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options?: ApiClientOptions) {
    this.baseUrl = options?.baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options?.defaultHeaders,
    };
  }

  private buildUrl(path: string): string {
    if (!this.baseUrl) return path;
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  private withTenant(headers?: HeadersInit): HeadersInit {
    const tenant = getTenantFromRuntime();
    const merged: Record<string, string> = {
      ...this.defaultHeaders,
      ...(headers as Record<string, string>),
    };
    if (tenant && !("x-tenant" in merged)) {
      merged["x-tenant"] = tenant;
    }
    return merged;
  }

  async request<T = unknown>(
    path: string,
    init?: RequestInit & { parseJson?: boolean }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path);
    const { parseJson = true, ...rest } = init || {};
    const resp = await fetch(url, {
      ...rest,
      headers: this.withTenant(rest.headers),
      credentials: "include",
    });
    const status = resp.status;
    const ok = resp.ok;
    let payload: any = undefined;
    if (parseJson) {
      try {
        payload = await resp.json();
      } catch {
        payload = undefined;
      }
    } else {
      payload = (await resp.text()) as any;
    }
    // normalize
    if (payload && typeof payload === "object") {
      if (payload.succeeded !== undefined) {
        return {
          success: Boolean(payload.succeeded),
          data: payload.data,
          message: payload.message,
          status,
        };
      }
      if (payload.success !== undefined) {
        return {
          success: Boolean(payload.success),
          data: payload.data,
          message: payload.message,
          status,
        };
      }
    }
    return { success: ok, data: payload as T, status };
  }

  get<T = unknown>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: "GET" });
  }
  post<T = unknown>(path: string, body?: any, init?: RequestInit) {
    const json = body !== undefined ? JSON.stringify(body) : undefined;
    return this.request<T>(path, { ...init, method: "POST", body: json });
  }
  put<T = unknown>(path: string, body?: any, init?: RequestInit) {
    const json = body !== undefined ? JSON.stringify(body) : undefined;
    return this.request<T>(path, { ...init, method: "PUT", body: json });
  }
  delete<T = unknown>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
