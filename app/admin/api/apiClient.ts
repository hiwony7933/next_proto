import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

// API 클라이언트 설정
export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 포함
    });

    this.setupInterceptors();
  }

  // 인터셉터 설정
  private setupInterceptors() {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // 토큰이 있다면 헤더에 추가
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // FormData인 경우 Content-Type 헤더를 제거 (브라우저가 자동으로 multipart/form-data와 boundary 설정)
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 응답 데이터 정규화
        const normalizedResponse = this.normalizeResponse(response);
        
        return normalizedResponse;
      },
      (error: AxiosError) => {
        // 에러 처리
        return this.handleError(error);
      }
    );
  }

  // 응답 데이터 정규화
  private normalizeResponse(response: AxiosResponse): AxiosResponse {
    // 서버 응답 구조에 따라 데이터 정규화
    if (response.data && typeof response.data === 'object') {
      // 백엔드에서 JsonResponse 형태로 응답하는 경우 (succeeded, data, total 등 포함)
      if (response.data.succeeded !== undefined) {
        // 백엔드 JsonResponse를 Frontend ApiResponse로 변환
        const normalizedData: ApiResponse = {
          success: response.data.succeeded,
          data: response.data.data,
          message: response.data.message || (response.data.succeeded ? '요청이 성공적으로 처리되었습니다.' : '요청 처리에 실패했습니다.'),
        };
        
        response.data = normalizedData;
        return response;
      }
      
      // 성공/실패 여부 확인 (기존 ApiResponse 형태)
      if (response.data.success !== undefined) {
        // 이미 정규화된 응답
        return response;
      }
      
      // 기타 응답을 정규화된 형태로 변환
      const normalizedData: ApiResponse = {
        success: response.status >= 200 && response.status < 300,
        data: response.data,
        message: response.data.message || (response.status >= 200 && response.status < 300 ? '요청이 성공적으로 처리되었습니다.' : '요청 처리에 실패했습니다.'),
      };
      
      response.data = normalizedData;
    }
    
    return response;
  }

  // 에러 처리
  private handleError(error: AxiosError): Promise<never> {
    const status = error.response?.status;
    const errorMessage = this.getErrorMessage(error);

    // 권한 없음 (401) 또는 토큰 만료
    if (status === 401) {
      this.clearAuthToken();
      this.redirectToLogin();
      return Promise.reject(new Error('인증이 필요합니다. 다시 로그인해주세요.'));
    }

    // 권한 부족 (403)
    if (status === 403) {
      this.showError('접근 권한이 없습니다.');
      return Promise.reject(new Error('접근 권한이 없습니다.'));
    }

    // 서버 에러 (500)
    if (status && status >= 500) {
      this.showError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return Promise.reject(new Error('서버 오류가 발생했습니다.'));
    }

    // 네트워크 에러
    if (!error.response) {
      this.showError('네트워크 연결을 확인해주세요.');
      return Promise.reject(new Error('네트워크 연결을 확인해주세요.'));
    }

    // 기타 에러
    this.showError(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }

  // 에러 메시지 추출
  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      if (data.message) {
        return data.message;
      }
      
      if (data.error) {
        return data.error;
      }
    }
    
    if (error.message) {
      return error.message;
    }
    
    return '알 수 없는 오류가 발생했습니다.';
  }

  // 인증 토큰 관리
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  private setAuthToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  }

  private clearAuthToken(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  // 로그인 페이지로 리다이렉트
  private redirectToLogin(): void {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  // 에러 메시지 표시
  private showError(message: string): void {
    // SweetAlert2 또는 다른 알림 라이브러리 사용
    if (typeof window !== 'undefined' && (window as any).Swal) {
      (window as any).Swal.fire({
        icon: 'error',
        title: '오류',
        text: message,
        confirmButtonText: '확인'
      });
    } else {
      alert(message);
    }
  }

  // 성공 메시지 표시
  private showSuccess(message: string): void {
    if (typeof window !== 'undefined' && (window as any).Swal) {
      (window as any).Swal.fire({
        icon: 'success',
        title: '성공',
        text: message,
        confirmButtonText: '확인'
      });
    } else {
      alert(message);
    }
  }

  // HTTP 메서드별 요청 메서드들
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Form Data 전송을 위한 메서드 (URL encoded)
  public async postFormData<T = any>(url: string, data: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new URLSearchParams();
    
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
    }

    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  // Multipart Form Data 전송을 위한 메서드 (파일 업로드용)
  public async postMultipartFormData<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 파일 업로드를 위한 메서드
  public async uploadFile<T = any>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 인증 상태 확인
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// 기본 API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient();

export default apiClient; 