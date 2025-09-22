"use client";
import React, { useState, useRef } from "react";
import MzDatePicker from "../../../common/components/form/mzDatePicker";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzInputText from "../../../common/components/form/mzInputText";
import MzButton from "../../../common/components/ui/mzButton";
import MzAlert from "../../../common/components/ui/mzAlert";
import GridBuilder from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import axios from "axios";
import "../../styles/adminStyle.scss";
import styles from "../mgmt.module.scss";

// const _baseUrl = "http://local.megazone.com:8090";

// 3개월 전 날짜 계산
const getThreeMonthsAgo = () => {
  const today = new Date();
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    today.getDate()
  );
  return threeMonthsAgo.toISOString().split("T")[0]; // YYYY-MM-DD 형식
};

// 오늘 날짜 계산
const getToday = () => {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
};

// 데이터 타입 정의
interface LogData {
  id: number;
  rtTgtSeq: string;
  wkUrlAddr: string;
  usrIpAddr: string;
  prsnInfoYn: string;
  sysRegDtime: string;
  sysRegrId: string;
  qryRsltCnt: number;
  prmtInfo: string;
}

const initialQuery = {
  schDateSt: getThreeMonthsAgo(), // 기본값을 3개월 전으로 설정
  schDateEd: getToday(), // 기본값을 오늘로 설정
  prsnInfoYn: "",
  usrId: "",
};

const personalInfoOptions = ["전체", "사용", "사용안함"];

// 개인정보여부 값 매핑
const getPrsnInfoYnValue = (displayValue: string): string => {
  switch (displayValue) {
    case "사용":
      return "Y";
    case "사용안함":
      return "N";
    default:
      return "";
  }
};

// GridBuilder용 컬럼 설정
const gridColumns = [
  {
    name: "rtTgtSeq",
    header: "메뉴ID",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "wkUrlAddr",
    header: "작업URL",
    width: 300,
    align: "left",
    editable: false,
  },
  {
    name: "usrIpAddr",
    header: "작업IP",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "prsnInfoYn",
    header: "개인정보여부",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "sysRegDtime",
    header: "등록일시",
    width: 150,
    align: "center",
    editable: false,
  },
  {
    name: "sysRegrId",
    header: "로그인ID",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "qryRsltCnt",
    header: "조회결과건수",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "prmtInfo",
    header: "매개변수",
    width: 200,
    align: "left",
    editable: false,
  },
];

const AdminLogMgt = () => {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<LogData[]>([]); // 타입 지정
  const [isFormShowHide, setIsFormShowHide] = useState(false); // 검색영역 토글 상태 변수
  const [adminLogTotalCount, setAdminLogTotalCount] = useState<number>(0);
  const gridRef = useRef<any>(null);

  // 날짜 유효성 검사 (3개월 제한)
  const validateDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // 시작일이 3개월 전보다 이전인지 확인
    if (start < threeMonthsAgo) {
      MzAlert.alert("조회 시작일은 3개월 전까지만 선택 가능합니다.");
      return false;
    }

    // 종료일이 오늘보다 이후인지 확인
    if (end > new Date()) {
      MzAlert.alert("조회 종료일은 오늘까지만 선택 가능합니다.");
      return false;
    }

    // 시작일이 종료일보다 이후인지 확인
    if (start > end) {
      MzAlert.alert("조회 시작일은 종료일보다 이전이어야 합니다.");
      return false;
    }

    return true;
  };

  // 검색조건 변경
  const handleQueryChange = (field: keyof typeof query, value: string) => {
    if (field === "schDateSt" || field === "schDateEd") {
      const newQuery = { ...query, [field]: value };

      // 날짜 범위 유효성 검사
      if (!validateDateRange(newQuery.schDateSt, newQuery.schDateEd)) {
        return; // 유효하지 않으면 상태 업데이트하지 않음
      }
    }

    // "전체" 선택 시 빈 문자열로 변환
    let finalValue = value;
    if (field === "prsnInfoYn" && value === "전체") {
      finalValue = "";
    }

    setQuery((prev) => ({ ...prev, [field]: finalValue }));
  };

  // 셀렉트박스 표시값 변환 (빈 문자열을 "전체"로 표시)
  const getDisplayValue = (field: keyof typeof query, value: string) => {
    if (field === "prsnInfoYn") {
      if (value === "") {
        return "전체";
      } else if (value === "Y") {
        return "사용";
      } else if (value === "N") {
        return "사용안함";
      }
    }
    return value;
  };

  // 초기화
  const handleReset = () => {
    MzAlert.alert("초기화 처리");
    setQuery(initialQuery);
    setData([]);
    setAdminLogTotalCount(0);
  };

  // 검색
  const handleSearch = async () => {
    try {
      // 폼에 검색 조건 설정
      const form = document.querySelector(
        "#adminLogSearchForm"
      ) as HTMLFormElement;
      if (form) {
        // 폼 데이터를 직접 설정
        // console.log('🔍 검색 시작:', query.prsnInfoYn);
        const formData = new FormData(form);
        formData.set("schDateSt", query.schDateSt);
        formData.set("schDateEd", query.schDateEd);
        formData.set("prsnInfoYn", query.prsnInfoYn);
        formData.set("usrId", query.usrId);

        // console.log('🔍 검색 시작:', formData);

        // 폼 요소들의 value도 직접 설정
        const schDateStInput = form.querySelector(
          'input[name="schDateSt"]'
        ) as HTMLInputElement;
        const schDateEdInput = form.querySelector(
          'input[name="schDateEd"]'
        ) as HTMLInputElement;
        const prsnInfoYnInput = form.querySelector(
          'input[name="prsnInfoYn"]'
        ) as HTMLInputElement;
        const usrIdInput = form.querySelector("#usrId") as HTMLInputElement;

        if (schDateStInput) schDateStInput.value = query.schDateSt;
        if (schDateEdInput) schDateEdInput.value = query.schDateEd;
        if (prsnInfoYnInput) prsnInfoYnInput.value = query.prsnInfoYn;
        if (usrIdInput) usrIdInput.value = query.usrId;
      }

      if (gridRef.current) {
        (gridRef.current as { doSearch: (args?: unknown) => void }).doSearch();
      } else {
        console.error("관리자 로그 그리드가 초기화되지 않았습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setData([]); // 에러 시에도 빈 배열로 설정
    }
  };

  // GridBuilder 설정
  const gridConfig = {
    id: "adminLogGrid",
    columns: gridColumns,
    data: data,
    rowHeaders: [],
    height: 400,
    scrollX: true,
    scrollY: true,
    editingEvent: "click",
    rowBtnType: {
      rowExcelAll: true,
      excelFileName: "admin_log_data.xlsx",
    },
    keywordSearch: true,
    pagingable: true,
    rows: [10, 20, 50, 100],
    rowsPerPage: 10,
    action: `/system/monitoringMgmt.getStUsrWkHist.do`,
    form: "adminLogSearchForm",
    actionAfterCallback: true, // 검색 후 콜백 활성화
    resize: false,
    resizeOptions: {
      showButton: true,
      minHeight: 300,
      maxHeight: 600,
      step: 50,
    },
  };

  // GridBuilder 이벤트 핸들러
  const handleGridInit = (grid: any) => {
    // console.log('Admin Log Grid initialized:', grid);
  };

  const handleSearchCallback = (response: any) => {
    // console.log('Search completed:', response);
    if (response && typeof response === "object") {
      const responseObj = response as { data?: any[]; total?: number };

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setAdminLogTotalCount(totalCount);
      } else {
        setAdminLogTotalCount(0);
      }
    }
  };

  const handleSaveCallback = (response: any) => {
    // console.log('Save completed:', response);
  };

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="관리자로그관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        <form id="adminLogSearchForm">
          <input type="hidden" name="prsnInfoYn" />
          <input type="hidden" name="schDateSt" />
          <input type="hidden" name="schDateEd" />
          <div className="searchForm">
            <table>
              <colgroup>
                <col width="120px" />
                <col width="360px" />
                <col width="120px" />
                <col width="180px" />
                <col width="120px" />
                <col width="*" />
              </colgroup>
              <tbody>
                <tr>
                  <th>로그일자</th>
                  <td>
                    <div className="flex">
                      <MzDatePicker
                        value={query.schDateSt}
                        onChange={(val: string) =>
                          handleQueryChange("schDateSt", val)
                        }
                      />
                      <span>~</span>
                      <MzDatePicker
                        value={query.schDateEd}
                        onChange={(val: string) =>
                          handleQueryChange("schDateEd", val)
                        }
                      />
                    </div>
                  </td>
                  <th>개인정보여부</th>
                  <td>
                    <MzSelectBox
                      id="prsnInfoYn"
                      options={personalInfoOptions}
                      selected={getDisplayValue("prsnInfoYn", query.prsnInfoYn)}
                      onSelect={(val: string | string[]) =>
                        handleQueryChange(
                          "prsnInfoYn",
                          getPrsnInfoYnValue(val as string)
                        )
                      }
                      size="2"
                    />
                  </td>
                  <th>로그인 ID</th>
                  <td>
                    <MzInputText
                      id="usrId"
                      name="usrId"
                      value={query.usrId}
                      onChange={(e) =>
                        handleQueryChange("usrId", e.target.value)
                      }
                      placeholder="로그인 ID를 입력하세요"
                      mzSize="2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>
            초기화
          </MzButton>
          <MzButton fill="black" onClick={handleSearch}>
            검색
          </MzButton>
        </div>
      </div>

      {/* [02] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        <AdminTitle
          title="관리자 로그 목록"
          subTitle={
            adminLogTotalCount > 0 ? `(총 ${adminLogTotalCount}건)` : undefined
          }
        />

        <GridBuilder
          ref={gridRef}
          gridId="adminLogGrid"
          config={gridConfig}
          resizable={true}
          onInit={handleGridInit}
          onSearchCallback={handleSearchCallback}
          onSaveCallback={handleSaveCallback}
        />
      </div>
    </>
  );
};

export default AdminLogMgt;
