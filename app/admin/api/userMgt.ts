import axios from 'axios';

// API 기본 설정
const API_BASE_URL = '/system';

// axios 인스턴스 생성 및 기본 설정
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 사용자 리스트 조회
export const getUserList = (params: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.getUserList.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 상세 정보 조회
export const getUserDetail = (params: unknown) => 
  apiClient.get(`${API_BASE_URL}/userMgmt.getUsrDtlInfo.do`, { params });

// 사용자 저장 (등록/수정)
export const saveUser = (data: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.putStUsrBaseDtlInfo.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 삭제
export const deleteUser = (data: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.delUserInfo.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 비밀번호 초기화
export const initPassword = (usrId: string) => {
  const formData = new URLSearchParams();
  formData.append('usrId', usrId);
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.initPassword.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 아이디 중복 체크
export const checkUserIdDuplicate = (params: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.getUserCount.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 메뉴 권한 리스트 조회
export const getUserMenuList = (params: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/userMgmt.getStUsrRtInfoList.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 사용자 메뉴 권한 저장
export const saveUserMenuList = (data: unknown) => 
  apiClient.put(`${API_BASE_URL}/userMgmt.putStUsrRtInfoList.do`, data);

// 업무 그룹 리스트 조회
export const getJobGroupList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getStJobGrpBaseList.do`, params);

// 업무 그룹 저장
export const saveJobGroupList = (data: unknown) => 
  apiClient.put(`${API_BASE_URL}/userMgmt.putStJobGrpBaseList.do`, data);

// 업무 그룹별 메뉴 권한 리스트 조회
export const getJobGroupMenuList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getStJobGrpRtInfoList.do`, params);

// 업무 그룹별 메뉴 권한 저장
export const saveJobGroupMenuList = (data: unknown) => 
  apiClient.put(`${API_BASE_URL}/userMgmt.putStJobGrpRtInfoList.do`, data);

// 조직 정보 리스트 조회
export const getOrgInfoList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getStOrgInfoList.do`, params);

// 조직 매핑 저장
export const saveOrgMapping = (data: unknown) => 
  apiClient.put(`${API_BASE_URL}/userMgmt.putStJobOrgMappingList.do`, data);

// 사업부 리스트 조회
export const getEndpInfoList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getEndpInfoList.do`, params);

// 업장 운영파트 리스트 조회
export const getBrchMngInfoList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getBrchMngInfoList.do`, params);

// 업장 리스트 조회
export const getBrchInfoList = (params: unknown) => 
  apiClient.post(`${API_BASE_URL}/userMgmt.getBrchInfoList.do`, params);

// 메뉴 리스트 조회 (메뉴 검색 팝업용)
export const getMenuList = (params: unknown) => {
  // URLSearchParams를 사용하여 form-data 형태로 전송
  const formData = new URLSearchParams();
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
  }
  
  return apiClient.post(`${API_BASE_URL}/menuMgmt.getJsonMenuList.do`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}; 