import { ApiClient } from "./apiClient";

// API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

// 배치 정보 타입 정의
export interface BatchInfo {
  batchId: string;
  batchNm: string;
  batchDesc: string;
  dupExePsbYn: string;
  useYn: string;
  exeYn: string;
  prmt: string;
  sysRegrId: string;
  sysRegDtime: string;
  sysModrId: string;
  sysModDtime: string;
}

// 배치 실행 요청 DTO
export interface RunBatchReqDto {
  batchId: string;
  prmt: string;
}

// 배치 실행
export const runBatch = async (data: RunBatchReqDto) => {
  return apiClient.post("/system/monitoringMgmt.runBatch.do", data);
};
