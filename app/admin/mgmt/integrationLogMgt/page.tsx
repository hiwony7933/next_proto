"use client";
import React, { useState, useRef } from "react";
import GridBuilder, { DateUtil } from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import "../../styles/adminStyle.scss";
import "../../components/sample/exGridBuilder.scss";
import MzButton from "../../../common/components/ui/mzButton";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzDateRangePicker from "../../../common/components/form/mzDateRangePicker";
import MzAlert from "../../../common/components/ui/mzAlert";
import MzCommonCodeSelect from "../../../common/components/form/mzCommonCodeSelect";

// 연동이력 정보 타입 정의
type IntegrationLog = {
  linkNo: string;
  regDt: string;
  linkSctNm: string;
  linkMdmNm: string;
  linkTpNm: string;
  linkSndTgtNm: string;
  linkRcvTgtNm: string;
  linkPrgsStatNm: string;
  sndStrtDtime: string;
  sndRcntDtime: string;
  sndTotCnt: number;
  sndSucsCnt: number;
  sndFailCnt: number;
  batchId: string;
  fileNm: string;
  msgCont: string;
  prgsTime: number;
  sysRegrId: string;
  sysRegDtime: string;
  sysModrId: string;
  sysModDtime: string;
};

// 검색 조건 타입
type Query = {
  regDtFrom: string;
  regDtTo: string;
  linkMdmCd: string;
  linkTpCd: string;
};

// 상수
const initialQuery: Query = {
  regDtFrom: "",
  regDtTo: "",
  linkMdmCd: "",
  linkTpCd: "",
};

// 연동이력 목록 그리드 설정
const integrationLogGridConfig = {
  id: "integrationLogGrid",
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "연동번호",
      name: "linkNo",
      width: 150,
      align: "center",
      editable: false,
    },
    {
      header: "등록일",
      name: "regDt",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) => {
        if (!value) return "-";
        return DateUtil.getDateObject(value).format("yyyy-MM-dd");
      },
    },
    {
      header: "연동구분",
      name: "linkSctNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "연동매체",
      name: "linkMdmNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "연동방식",
      name: "linkTpNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "연동전송대상",
      name: "linkSndTgtNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "연동수신대상",
      name: "linkRcvTgtNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "연동진행상태",
      name: "linkPrgsStatNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "전송시작일시",
      name: "sndStrtDtime",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) => {
        if (!value) return "-";
        return DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss");
      },
    },
    {
      header: "전송최근일시",
      name: "sndRcntDtime",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) => {
        if (!value) return "-";
        return DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss");
      },
    },
    {
      header: "전송전체횟수",
      name: "sndTotCnt",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "전송성공횟수",
      name: "sndSucsCnt",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "전송실패횟수",
      name: "sndFailCnt",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "배치아이디",
      name: "batchId",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "파일명",
      name: "fileNm",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "메시지내용",
      name: "msgCont",
      width: 500,
      align: "center",
      editable: false,
    },
    {
      header: "진행시간(ms)",
      name: "prgsTime",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "등록자",
      name: "sysRegrId",
      width: 150,
      align: "center",
      editable: false,
    },
    {
      header: "등록일시",
      name: "sysRegDtime",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) => {
        if (!value) return "-";
        return DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss");
      },
    },
    {
      header: "수정자",
      name: "sysModrId",
      width: 150,
      align: "center",
      editable: false,
    },
    {
      header: "수정일시",
      name: "sysModDtime",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) => {
        if (!value) return "-";
        return DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss");
      },
    },
  ],
  height: 400,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: false,
    rowExcelAll: true,
  },
  // 페이징 설정 (기존 백오피스와 동일)
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "integrationLogSearchForm",
  saveAfterSearch: false,
  action: "/system/monitoringMgmt.getInterLockingHistList.do",
  actionAfterCallback: true,
  // 기존 백오피스 설정과 동일하게 적용
  extendlastcol: "scroll",
  rowSeq: false,
  rowStatus: false,
  // 페이징 관련 추가 설정
  keywordSearch: true,
  prevKeyword: null,
  isMax: false,
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
  scrollX: true,
  scrollY: true,
  useClientSort: false,
  minRowHeight: 40,
  rowHeight: 40,
};

const IntegrationLogManagement: React.FC = () => {
  // 상태 관리
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [integrationLogTotalCount, setIntegrationLogTotalCount] =
    useState<number>(0);

  // 연동매체와 연동방식 선택 상태 추가
  const [selectedLinkMdmCd, setSelectedLinkMdmCd] = useState<string>("");
  const [selectedLinkTpCd, setSelectedLinkTpCd] = useState<string>("");

  // GridBuilder refs
  const integrationLogGridRef = useRef<unknown>(null);

  // 연동이력 목록 그리드 초기화
  const handleIntegrationLogGridInit = (grid: unknown) => {
    integrationLogGridRef.current = grid;
  };

  // 연동이력 목록 검색 콜백
  const handleIntegrationLogSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as {
        data?: IntegrationLog[];
        total?: number;
      };

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setIntegrationLogTotalCount(totalCount);
      } else {
        setIntegrationLogTotalCount(0);
      }
    }

    // 검색 완료 후 로딩 상태 해제
    setLoading(false);
  };

  // 검색
  const handleSearch = async (customQuery?: Partial<Query>) => {
    setLoading(true);
    setError("");

    // 폼에 검색 조건 설정
    const form = document.querySelector(
      "#integrationLogSearchForm"
    ) as HTMLFormElement;
    if (form) {
      const regDtFromInput = form.querySelector(
        'input[name="regDtFrom"]'
      ) as HTMLInputElement;
      const regDtToInput = form.querySelector(
        'input[name="regDtTo"]'
      ) as HTMLInputElement;
      const linkMdmCdInput = form.querySelector(
        'input[name="linkMdmCd"]'
      ) as HTMLInputElement;
      const linkTpCdInput = form.querySelector(
        'input[name="linkTpCd"]'
      ) as HTMLInputElement;

      if (regDtFromInput)
        regDtFromInput.value = customQuery?.regDtFrom || query.regDtFrom || "";
      if (regDtToInput)
        regDtToInput.value = customQuery?.regDtTo || query.regDtTo || "";
      if (linkMdmCdInput)
        linkMdmCdInput.value = customQuery?.linkMdmCd || query.linkMdmCd || "";
      if (linkTpCdInput)
        linkTpCdInput.value = customQuery?.linkTpCd || query.linkTpCd || "";
    }

    // GridBuilder로 검색 실행
    if (integrationLogGridRef.current) {
      try {
        (
          integrationLogGridRef.current as {
            doSearch: (args?: unknown) => void;
          }
        ).doSearch();
      } catch (error) {
        console.error("GridBuilder doSearch 호출 중 오류:", error);
        setLoading(false);
      }
    } else {
      console.error("연동이력 목록 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setQuery(initialQuery);
    setError("");
    setIntegrationLogTotalCount(0);
    setSelectedLinkMdmCd("");
    setSelectedLinkTpCd("");

    // 연동이력 목록 그리드 초기화
    if (integrationLogGridRef.current) {
      try {
        (
          integrationLogGridRef.current as {
            resetData: (data: unknown[]) => void;
          }
        ).resetData([]);
      } catch (error) {
        console.error("연동이력 목록 그리드 초기화 중 오류:", error);
      }
    }
  };

  // 쿼리 변경 핸들러
  const handleQueryChange = (field: keyof Query, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (dateRange: [string, string]) => {
    setQuery((prev) => ({
      ...prev,
      regDtFrom: dateRange[0] || "",
      regDtTo: dateRange[1] || "",
    }));
  };

  // Enter 키 이벤트 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 연동매체 선택 핸들러
  const handleLinkMdmCdSelect = (value: string) => {
    // console.log('선택된 연동매체:', value);
    setSelectedLinkMdmCd(value);
    handleQueryChange("linkMdmCd", value);
    handleSearch();
  };

  // 연동방식 선택 핸들러
  const handleLinkTpCdSelect = (value: string) => {
    // console.log('선택된 연동방식:', value);
    setSelectedLinkTpCd(value);
    handleQueryChange("linkTpCd", value);
    handleSearch();
  };

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="연동이력관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        <div className="searchForm">
          <table>
            <colgroup>
              <col width="120px" />
              <col width="200px" />
              <col width="120px" />
              <col width="200px" />
            </colgroup>
            <tbody>
              <tr>
                <th>등록기간</th>
                <td colSpan={3}>
                  <MzDateRangePicker
                    value={[query.regDtFrom, query.regDtTo]}
                    onChange={handleDateRangeChange}
                    showQuickButtons={true}
                  />
                </td>
              </tr>
              <tr>
                <th>연동매체</th>
                <td>
                  <MzCommonCodeSelect
                    storageKey="integration-link-medium-codes"
                    grpCd="INT003"
                    selected={selectedLinkMdmCd}
                    onSelect={handleLinkMdmCdSelect}
                    size="2"
                  />
                </td>
                <th>연동방식</th>
                <td>
                  <MzCommonCodeSelect
                    storageKey="integration-link-type-codes"
                    grpCd="INT004"
                    selected={selectedLinkTpCd}
                    onSelect={handleLinkTpCdSelect}
                    size="2"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>
            초기화
          </MzButton>
          <MzButton
            fill="black"
            onClick={() => handleSearch()}
            disabled={loading}
          >
            {loading ? "검색중..." : "검색"}
          </MzButton>
        </div>
        {error && (
          <div style={{ marginTop: 10, color: "red", fontSize: "14px" }}>
            {error}
          </div>
        )}
      </div>

      {/* [02] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        <AdminTitle
          title="연동이력 목록"
          subTitle={
            integrationLogTotalCount > 0
              ? `(총 ${integrationLogTotalCount}건)`
              : undefined
          }
        />

        {/* 연동이력 검색 폼 */}
        <form id="integrationLogSearchForm" style={{ display: "none" }}>
          <input type="hidden" name="regDtFrom" value={query.regDtFrom} />
          <input type="hidden" name="regDtTo" value={query.regDtTo} />
          <input type="hidden" name="linkMdmCd" value={query.linkMdmCd} />
          <input type="hidden" name="linkTpCd" value={query.linkTpCd} />
          <input type="hidden" name="action" value="" />
        </form>

        <GridBuilder
          gridId="integrationLogGrid"
          config={integrationLogGridConfig}
          resizable={true}
          onInit={handleIntegrationLogGridInit}
          onSearchCallback={handleIntegrationLogSearch}
        />
      </div>
    </>
  );
};

export default IntegrationLogManagement;
