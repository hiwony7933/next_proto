import React, { useState, useRef } from "react";
import GridBuilder from "../../components/sample/exGridBuilder";
import Grid from "tui-grid";
import AdminTitle from "../../components/common/adminTitle";
import MzInputText from "../../../common/components/form/mzInputText";
import MzButton from "../../../common/components/ui/mzButton";
import "../../styles/adminStyle.scss";
import styles from "../mgmt.module.scss";

// 업무그룹 데이터 타입 정의
interface JobGroupRow {
  rowKey: number;
  jobGrpCd: string;
  jobGrpNm: string;
  jobSctCd: string;
  jobSctNm: string;
  useYn: string;
}

// GridBuilderRef 타입 정의
interface GridBuilderRef {
  getGrid: () => Grid | null;
  addRow: () => void;
  deleteSelectedRows: () => void;
  saveGridData: () => void;
  searchGridData: () => void;
  doSearch: () => void;
  setHeight: (height: number) => void;
}

// 모달 Props 인터페이스
interface JobGroupSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (jobGroup: {
    jobGrpCd: string;
    jobGrpNm: string;
    jobSctCd: string;
    jobSctNm: string;
    useYn: string;
  }) => void;
}

const JobGroupSearchModal: React.FC<JobGroupSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [jobGrpCd, setJobGrpCd] = useState("");
  const [jobGrpNm, setJobGrpNm] = useState("");
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [data, setData] = useState<JobGroupRow[]>([]);
  const [loading, setLoading] = useState(false);
  const jobGroupGridRef = useRef<GridBuilderRef>(null);

  // 업무그룹 그리드 설정
  const jobGroupGridConfig = {
    id: "jobGroupGrid",
    rowHeaders: ["rowNum"],
    header: {
      height: 40,
      complexColumns: [],
    },
    columns: [
      {
        header: "업무그룹코드",
        name: "jobGrpCd",
        width: 150,
        align: "center",
        editable: false,
      },
      {
        header: "업무그룹명",
        name: "jobGrpNm",
        width: 200,
        align: "left",
        editable: false,
      },
      {
        header: "업무구분",
        name: "jobSctNm",
        width: 120,
        align: "center",
        editable: false,
      },
      {
        header: "사용여부",
        name: "useYn",
        width: 100,
        align: "center",
        editable: false,
        formatter: ({ value }: { value: string }) =>
          value === "Y" ? "사용" : "미사용",
      },
    ],
    height: 300,
    rowBtnType: {
      rowAdd: false,
      rowDel: false,
      rowUpdate: false,
      rowExcelAll: true,
      excelFileName: "jobGroupSearchData",
    },
    pagingable: false,
    rowsPerPage: 10,
    rows: [10, 20, 50, 100],
    form: "jobGroupSearchForm",
    saveAfterSearch: false,
    action: "/system/userMgmt.getStJobGrpBaseList.do",
    actionAfterCallback: true,
    resizeOptions: {
      showButton: true,
      minHeight: 300,
      maxHeight: 800,
      step: 50,
    },
  };

  // 검색 버튼 클릭 시 GridBuilder의 검색 기능 사용
  const handleSearch = () => {
    setLoading(true);

    // 폼에 검색 조건 설정
    const form = document.querySelector(
      "#jobGroupSearchForm"
    ) as HTMLFormElement;
    if (form) {
      const jobGrpCdInput = form.querySelector(
        'input[name="jobGrpCd"]'
      ) as HTMLInputElement;
      const jobGrpNmInput = form.querySelector(
        'input[name="jobGrpNm"]'
      ) as HTMLInputElement;

      if (jobGrpCdInput) jobGrpCdInput.value = jobGrpCd;
      if (jobGrpNmInput) jobGrpNmInput.value = jobGrpNm;
    }

    if (jobGroupGridRef.current && jobGroupGridRef.current.doSearch) {
      jobGroupGridRef.current.doSearch();
    } else {
      console.error("업무그룹 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobGrpCd("");
    setJobGrpNm("");
    setData([]);

    // 폼 데이터도 초기화
    const form = document.querySelector(
      "#jobGroupSearchForm"
    ) as HTMLFormElement;
    if (form) {
      const jobGrpCdInput = form.querySelector(
        'input[name="jobGrpCd"]'
      ) as HTMLInputElement;
      const jobGrpNmInput = form.querySelector(
        'input[name="jobGrpNm"]'
      ) as HTMLInputElement;

      if (jobGrpCdInput) jobGrpCdInput.value = "";
      if (jobGrpNmInput) jobGrpNmInput.value = "";
    }

    // 그리드 데이터 초기화
    if (jobGroupGridRef.current && jobGroupGridRef.current.getGrid) {
      const grid = jobGroupGridRef.current.getGrid();
      if (grid && typeof grid.resetData === "function") {
        grid.resetData([]);
      }
    }
  };

  // 업무그룹 그리드 초기화
  const handleJobGroupGridInit = (grid: Grid) => {
    if (jobGroupGridRef.current) {
      // GridBuilderRef는 이미 올바른 타입이므로 추가 설정이 필요하지 않음
    }
    setLoading(false);

    // 행 더블클릭 이벤트 처리 - 적용 버튼과 동일한 동작
    grid.on("dblclick", (ev: { rowKey: number }) => {
      // 더블클릭된 행의 데이터를 가져와서 적용
      const clickedRow = grid.getRow(ev.rowKey);
      if (clickedRow) {
        // 적용 버튼과 동일한 동작 실행
        const payload = {
          jobGrpCd: clickedRow.jobGrpCd,
          jobGrpNm: clickedRow.jobGrpNm,
          jobSctCd: clickedRow.jobSctCd,
          jobSctNm: clickedRow.jobSctNm,
          useYn: clickedRow.useYn,
        };

        onSelect(payload);
        onClose();
      }
    });
  };

  // 업무그룹 검색 콜백
  const handleJobGroupSearch = (response: unknown) => {
    setLoading(false);

    // 검색 결과 처리
    if (response && typeof response === "object") {
      const responseObj = response as { data?: JobGroupRow[]; total?: number };

      if (responseObj.data) {
        const transformedData = responseObj.data.map(
          (item: any, index: number) => ({
            rowKey: index + 1,
            jobGrpCd: item.jobGrpCd || "",
            jobGrpNm: item.jobGrpNm || "",
            jobSctCd: item.jobSctCd || "",
            jobSctNm: item.jobSctNm || "",
            useYn: item.useYn || "Y",
          })
        );
        setData(transformedData);
        console.log("업무그룹 검색 결과:", transformedData.length, "건");
      } else {
        setData([]);
        console.log("업무그룹 검색 결과: 0건");
      }
    }
  };

  // 엔터키 검색 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setJobGrpCd("");
    setJobGrpNm("");
    setData([]);
    setIsFormShowHide(false);
    setLoading(false); // 로딩 상태도 초기화

    // 폼 데이터도 초기화
    const form = document.querySelector(
      "#jobGroupSearchForm"
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles["mgmt-modal-overlay"]}>
      <div className={styles["mgmt-modal-content"]}>
        {/* 모달 헤더 */}
        <div className={styles["mgmt-modal-header"]}>
          <h2 className={styles["mgmt-modal-title"]}>업무그룹 검색</h2>
          <button onClick={handleClose} className={styles["mgmt-modal-close"]}>
            ×
          </button>
        </div>

        {/* 검색 폼 */}
        <form id="jobGroupSearchForm" style={{ display: "none" }}>
          <input type="hidden" name="action" value="" />
          <input type="hidden" name="jobGrpCd" defaultValue="" />
          <input type="hidden" name="jobGrpNm" defaultValue="" />
        </form>

        {/* 상단 검색 영역 */}
        <div
          className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}
        >
          <AdminTitle
            title="업무그룹검색"
            showHide={true}
            setIsFormShowHide={setIsFormShowHide}
            isFormShowHide={isFormShowHide}
          />
          <div className="searchForm">
            <table>
              <colgroup>
                <col width="120px" />
                <col width="240px" />
                <col width="120px" />
                <col width="240px" />
              </colgroup>
              <tbody>
                <tr>
                  <th>업무그룹코드</th>
                  <td>
                    <MzInputText
                      mzSize="2"
                      value={jobGrpCd}
                      onChange={(e) => setJobGrpCd(e.target.value)}
                      placeholder="업무그룹코드 입력"
                      onKeyDown={handleKeyPress}
                    />
                  </td>
                  <th>업무그룹명</th>
                  <td>
                    <MzInputText
                      mzSize="2"
                      value={jobGrpNm}
                      onChange={(e) => setJobGrpNm(e.target.value)}
                      placeholder="업무그룹명 입력"
                      onKeyDown={handleKeyPress}
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
            <MzButton fill="black" onClick={handleSearch} disabled={loading}>
              {loading ? "검색중..." : "검색"}
            </MzButton>
          </div>
        </div>

        {/* 업무그룹 리스트 */}
        <AdminTitle
          title="업무그룹 리스트"
          subTitle={`(총 ${data.length}건)`}
        />

        {/* GridBuilder 컴포넌트 사용 */}
        <GridBuilder
          ref={jobGroupGridRef}
          gridId="jobGroupGrid"
          config={jobGroupGridConfig}
          resizable={true}
          onInit={handleJobGroupGridInit}
          onSearchCallback={handleJobGroupSearch}
        />

        {/* 하단 버튼 영역 */}
        <div className={styles["mgmt-modal-actions"]}>
          <MzButton
            stroke="black"
            onClick={handleClose}
            style={{ minWidth: 120 }}
          >
            닫기
          </MzButton>
        </div>
      </div>
    </div>
  );
};

export default JobGroupSearchModal;
