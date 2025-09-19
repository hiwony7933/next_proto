import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from '../form/mzSelectBox.module.scss';

// API 응답 타입 정의
interface ApiCodeItem {
  cd?: string;
  id?: string;
  mrkNm?: string;
  cdNm?: string;
  name?: string;
  description?: string;
  sysModDtime?: string;
  grpCd?: string;
  grpSctCd?: string;
  useYn?: string;
  ref1Val?: string;
  ref2Val?: string;
  ref3Val?: string;
  ref4Val?: string;
  ref5Val?: string;
  [key: string]: unknown;
}

interface CommonCodeSelectProps {
  storageKey: string;
  className?: string;
  selected?: string;
  onSelect?: (value: string, text?: string) => void;
  onChange?: (value: string) => void;
  defaultValue?: string;
  size?: '1' | '2' | '3' | '4' | '5';
  style?: React.CSSProperties;
  // 공통코드 관련 props 추가
  grpCd?: string;
  grpSctCd?: string;
  useYn?: string;
  ref1Val?: string;
  ref2Val?: string;
  ref3Val?: string;
  ref4Val?: string;
  ref5Val?: string;
  cdNm?: string;
  mrkNm?: string;
  // 접근성 개선
  ariaLabel?: string;
  placeholder?: string;
}

interface ApiResponse {
  id: string;
  name: string;
  description?: string;
  grpCd?: string;
  grpSctCd?: string;
}

  // localStorage에 저장할 데이터 구조
interface CachedData {
  data: ApiResponse[];
  timestamp: number;
  storageKey: string;
  latestModDtime?: string; // 가장 최신 sysModDtime 추가
  cacheExpiry?: number; // 캐시 만료 시간 추가 (1시간)
}

const MzCommonCodeSelect: React.FC<CommonCodeSelectProps> = ({
  storageKey,
  className = '',
  selected,
  onSelect,
  onChange,
  defaultValue = '',
  size = '3',
  style,
  // 공통코드 관련 props
  grpCd,
  grpSctCd,
  useYn = 'Y',
  ref1Val,
  ref2Val,
  ref3Val,
  ref4Val,
  ref5Val,
  cdNm,
  mrkNm,
  // 접근성 props
  ariaLabel = '공통코드 선택',
  placeholder = '전체'
}) => {
  const [options, setOptions] = useState<ApiResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // 데이터 로드 완료 플래그



  // selected 값이 변경될 때 selectedValue 업데이트
  useEffect(() => {
    setSelectedValue(selected || defaultValue);
  }, [selected, defaultValue]);

  // 전체 공통코드 조회를 위한 기본 요청 본문 (grpCd 제외 - 전체 데이터 조회)
  const baseRequestBody = useMemo(() => ({
    useYn,
    ref1Val,
    ref2Val,
    ref3Val,
    ref4Val,
    ref5Val,
    cdNm,
    mrkNm
  }), [useYn, ref1Val, ref2Val, ref3Val, ref4Val, ref5Val, cdNm, mrkNm]);

  // 필터링을 위한 조건들
  const filterConditions = useMemo(() => ({
    grpCd,
    grpSctCd
  }), [grpCd, grpSctCd]);

  // 날짜 형식을 ISO 8601 형식으로 변환하는 함수
  const formatToISOString = useCallback((dateString: string): string => {
    try {
      // "2022-06-27 02:28:11" 형식을 ISO 8601 형식으로 변환
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 유효하지 않은 날짜인 경우 현재 시간 사용
        console.warn(`유효하지 않은 날짜 형식: ${dateString}, 현재 시간 사용`);
        return new Date().toISOString();
      }
      
      // ISO 8601 형식으로 변환 (서버가 기대하는 형식)
      return date.toISOString();
    } catch (error) {
      console.error('날짜 형식 변환 중 오류:', error);
      return new Date().toISOString();
    }
  }, []);

  // 업데이트 체크 API 호출 (전체 데이터 기준으로 체크)
  const checkForUpdates = useCallback(async (cachedData: CachedData): Promise<boolean> => {
    try {
      const modDtimeToCheck = cachedData.latestModDtime || new Date(cachedData.timestamp).toISOString();
      const isoFormattedDate = formatToISOString(modDtimeToCheck);
      
      const requestBody = {
        sysModDtime: isoFormattedDate,
        ...baseRequestBody
      };
      
      const response = await fetch(`/system/commonCodeRepository.isUpdatedCodeDetailList.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      return result.data === true;
    } catch (error) {
      console.error('업데이트 체크 API 호출 중 오류:', error);
      return false;
    }
  }, [baseRequestBody, formatToISOString]);

  // 공통코드 조회 API 호출 (전체 데이터 조회)
  const fetchCommonCodeData = useCallback(async (): Promise<{ data: ApiResponse[], latestModTime: number, latestModDtime?: string }> => {
    try {
      const response = await fetch(`/system/commonCodeRepository.getCodeDetailList.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseRequestBody)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      if (result.data && Array.isArray(result.data)) {
        const transformedData = result.data
          .filter((item: ApiCodeItem) => item && typeof item === 'object')
          .map((item: ApiCodeItem) => ({
            id: (item.cd as string) || (item.id as string) || '',
            name: (item.mrkNm as string) || (item.cdNm as string) || (item.name as string) || '',
            grpCd: item.grpCd as string,
            grpSctCd: item.grpSctCd as string,
            description: item.description as string
          }))
          .filter((item: ApiResponse) => item.id && item.name);

        // 최신 수정 시간 찾기
        let latestModTime = 0;
        let latestModDtime: string | undefined;
        
        result.data.forEach((item: ApiCodeItem) => {
          if (item.sysModDtime && typeof item.sysModDtime === 'string') {
            const modTime = new Date(item.sysModDtime).getTime();
            if (!isNaN(modTime) && modTime > latestModTime) {
              latestModTime = modTime;
              latestModDtime = item.sysModDtime;
            }
          }
        });

        return { data: transformedData, latestModTime, latestModDtime };
      }
      
      return { data: [], latestModTime: 0, latestModDtime: undefined };
    } catch (error) {
      console.error('공통코드 조회 API 호출 중 오류:', error);
      return { data: [], latestModTime: 0, latestModDtime: undefined };
    }
  }, [baseRequestBody]);

  // localStorage에서 데이터 로드
  const loadFromLocalStorage = useCallback((): CachedData | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // 캐시된 데이터 구조 검증
        if (parsedData && 
            typeof parsedData === 'object' && 
            Array.isArray(parsedData.data) && 
            typeof parsedData.timestamp === 'number' &&
            typeof parsedData.storageKey === 'string' &&
            (parsedData.latestModDtime === undefined || typeof parsedData.latestModDtime === 'string') &&
            (parsedData.cacheExpiry === undefined || typeof parsedData.cacheExpiry === 'number')) {
          
          // 캐시 만료 시간 확인 (1시간)
          const now = Date.now();
          const cacheExpiry = parsedData.cacheExpiry || (parsedData.timestamp + 3600000); // 기존 데이터는 1시간 후 만료로 설정
          
          if (now > cacheExpiry) {
            console.log(`캐시 만료됨: ${storageKey} (만료시간: ${new Date(cacheExpiry).toISOString()})`);
            localStorage.removeItem(storageKey); // 만료된 캐시 삭제
            return null;
          }
          
          return parsedData;
        }
      }
      return null;
    } catch (error) {
      console.error('localStorage에서 데이터 로드 중 오류:', error);
      return null;
    }
  }, [storageKey]);

  // localStorage에 데이터 저장
  const saveToLocalStorage = useCallback((data: ApiResponse[], serverModTime: number, latestModDtime?: string): void => {
    try {
      const newCachedData: CachedData = {
        data,
        timestamp: serverModTime > 0 ? serverModTime : Date.now(),
        storageKey,
        latestModDtime,
        cacheExpiry: Date.now() + 3600000 // 1시간 후 만료
      };
      
      const jsonString = JSON.stringify(newCachedData);
      localStorage.setItem(storageKey, jsonString);
      
    } catch (error) {
      console.error('localStorage에 데이터 저장 중 오류:', error);
    }
  }, [storageKey]);

  // grpCd와 grpSctCd에 따라 데이터 필터링
  const filterDataByConditions = useCallback((data: ApiResponse[]): ApiResponse[] => {
    if (!filterConditions.grpCd && !filterConditions.grpSctCd) {
      return data; // 필터 조건이 없으면 전체 데이터 반환
    }

    const filteredData = data.filter(item => {
      // grpCd 필터링
      if (filterConditions.grpCd && item.grpCd !== filterConditions.grpCd) {
        return false;
      }
      
      // grpSctCd 필터링
      if (filterConditions.grpSctCd && item.grpSctCd !== filterConditions.grpSctCd) {
        return false;
      }
      
      return true;
    });
    
    return filteredData;
  }, [filterConditions]);

  // 캐시 만료 시간 확인 함수
  const isCacheExpired = useCallback((cachedData: CachedData): boolean => {
    const now = Date.now();
    const cacheExpiry = cachedData.cacheExpiry || (cachedData.timestamp + 3600000); // 1시간
    return now > cacheExpiry;
  }, []);

  // 데이터 로드 - 마운트 시에만 실행
  useEffect(() => {
    if (isLoaded) return; // 이미 로드되었으면 중복 실행 방지
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        const cachedData = loadFromLocalStorage();
        
        if (!cachedData || cachedData.data.length === 0) {
          // 캐시 없음 - API 호출
          const { data: apiData, latestModTime, latestModDtime } = await fetchCommonCodeData();
          
          if (apiData.length > 0) {
            saveToLocalStorage(apiData, latestModTime, latestModDtime);
            setOptions(filterDataByConditions(apiData));
          } else {
            setOptions([]);
          }
        } else {
          // 캐시 있음 - 만료 확인 후 업데이트 체크
          const isExpired = isCacheExpired(cachedData);
          
          if (isExpired) {
            const { data: apiData, latestModTime, latestModDtime } = await fetchCommonCodeData();
            if (apiData.length > 0) {
              saveToLocalStorage(apiData, latestModTime, latestModDtime);
              setOptions(filterDataByConditions(apiData));
            } else {
              setOptions([]);
            }
          } else {
            const hasUpdates = await checkForUpdates(cachedData);
            
            if (hasUpdates) {
              const { data: apiData, latestModTime, latestModDtime } = await fetchCommonCodeData();
              if (apiData.length > 0) {
                saveToLocalStorage(apiData, latestModTime, latestModDtime);
                setOptions(filterDataByConditions(apiData));
              } else {
                setOptions([]);
              }
            } else {
              setOptions(filterDataByConditions(cachedData.data));
            }
          }
        }
      } catch (error) {
        console.error('[MzCommonCodeSelect] 데이터 로드 중 오류:', error);
        const cachedData = loadFromLocalStorage();
        if (cachedData && cachedData.data.length > 0) {
          setOptions(filterDataByConditions(cachedData.data));
        } else {
          setOptions([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoaded(true); // 로드 완료 표시
      }
    };

    loadData();
  }, [isLoaded, loadFromLocalStorage, fetchCommonCodeData, saveToLocalStorage, filterDataByConditions, isCacheExpired, checkForUpdates]);



  // 선택 값 변경 핸들러
  const handleSelectChange = useCallback((value: string) => {
    setSelectedValue(value);
    
    // 선택된 항목의 text 찾기
    const selectedItem = options.find((item: ApiResponse) => 
      item.id === value
    );
    const selectedText = selectedItem?.name || '';
    
    if (onSelect) {
      onSelect(value, selectedText);
    }
    if (onChange) {
      onChange(value);
    }
  }, [onSelect, onChange, options]);



  return (
    <div className={`${styles.mzSelectBoxDefault} ${styles[`size${size}`]} ${className}`} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', position: 'relative' }}>
        <select
          value={selectedValue}
          onChange={(e) => handleSelectChange(e.target.value)}
          disabled={isLoading}
          aria-label={ariaLabel}
          className={styles.select}
          style={{
            flex: 1,
            minWidth: 120,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <option value="">{placeholder}</option>
          {options.length === 0 && <option disabled>옵션이 없습니다</option>}
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MzCommonCodeSelect;

/*
사용 예시:
// 특정 그룹 코드로 필터링 (클라이언트에서 필터링)
<MzCommonCodeSelect
  storageKey="user-status-codes"
  grpCd="USER_STATUS"      // 선택: 그룹 코드 (클라이언트 필터링용)
  grpSctCd="ACTIVE"        // 선택: 그룹 구분 코드 (클라이언트 필터링용)
  useYn="Y"                // 선택: 사용 여부 (기본값: "Y")
  selected={selectedValue}
  onSelect={handleSelect}
  placeholder="상태 선택"
/>

// 전체 공통코드 조회 (필터링 없음)
<MzCommonCodeSelect
  storageKey="all-codes"
  selected={selectedValue}
  onSelect={handleSelect}
  placeholder="코드 선택"
/>

참고: API는 항상 전체 데이터를 조회하고, grpCd/grpSctCd는 클라이언트에서 필터링용으로만 사용됩니다.
*/