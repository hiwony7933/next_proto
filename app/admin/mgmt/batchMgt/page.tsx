"use client";
import React, { useState, useEffect, useRef } from "react";
import GridBuilder, { DateUtil } from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import "../../styles/adminStyle.scss";
import "../../components/sample/exGridBuilder.scss";
import MzButton from "../../../common/components/ui/mzButton";
import MzInputText from "../../../common/components/form/mzInputText";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzAlert from "../../../common/components/ui/mzAlert";
import {
  runBatch,
  BatchInfo,
  RunBatchReqDto,
} from "../../../admin/api/batchMgt";

// ButtonRenderer 클래스 정의
class ButtonRenderer {
  el: HTMLButtonElement;

  constructor(props: any) {
    const { options } = props.columnInfo.renderer;
    const button = document.createElement("button");
    button.textContent = options.text || "버튼";
    button.className = options.className || "btn-default";
    button.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
    `;

    if (options.className === "btn-black") {
      button.style.cssText += `
        background: #333;
        color: white;
        border-color: #333;
      `;
    }

    this.el = button;
  }

  getElement() {
    return this.el;
  }

  render() {
    // 버튼 렌더링 시 추가 작업이 필요한 경우 여기에 구현
  }
}

// 배치 정보 타입 정의
type Batch = BatchInfo;

// 검색 조건 타입
type Query = {
  batchNm: string;
  useYn: string;
};

// 상수
const initialQuery: Query = { batchNm: "", useYn: "" };

// 배치 목록 그리드 설정
const batchListGridConfig = {
  id: "batchListGrid",
  rowHeaders: [
    {
      type: "checkbox",
    },
  ],
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "배치ID",
      name: "batchId",
      width: 150,
      align: "center",
      editable: true,
      editor: {
        type: "text",
        options: {
          activatingEvent: "click",
        },
      },
    },
    {
      header: "배치명",
      name: "batchNm",
      width: 200,
      align: "center",
      editable: true,
      editor: "text",
    },
    {
      header: "배치설명",
      name: "batchDesc",
      width: 200,
      align: "center",
      editable: true,
      editor: "text",
    },
    {
      header: "중복실행여부",
      name: "dupExePsbYn",
      width: 100,
      align: "center",
      editable: true,
      editor: {
        type: "select",
        options: {
          listItems: [
            { text: "Y", value: "Y" },
            { text: "N", value: "N" },
          ],
        },
      },
      formatter: ({ value }: { value: string }) => (value === "Y" ? "Y" : "N"),
    },
    {
      header: "실행여부",
      name: "exeYn",
      width: 100,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string }) =>
        value === "Y" ? "실행중" : "대기",
    },
    {
      header: "배치실행",
      name: "callPrc",
      width: 100,
      align: "center",
      editable: false,
      renderer: {
        type: ButtonRenderer,
        options: {
          text: "실행",
          className: "btn-black",
        },
      },
    },
    {
      header: "스케쥴주기(크론식)",
      name: "cronCycl",
      width: 200,
      align: "center",
      editable: true,
      editor: "text",
    },
    {
      header: "시작일시",
      name: "strtDtime",
      width: 150,
      align: "center",
      editable: true,
      editor: "text",
      disabled: true,
    },
    {
      header: "종료일시",
      name: "endDtime",
      width: 150,
      align: "center",
      editable: true,
      editor: "text",
      disabled: true,
    },
    {
      header: "매개변수",
      name: "prmt",
      width: 200,
      align: "center",
      editable: true,
      editor: "text",
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 100,
      align: "center",
      editable: true,
      editor: {
        type: "select",
        options: {
          listItems: [
            { text: "Y", value: "Y" },
            { text: "N", value: "N" },
          ],
        },
      },
      formatter: ({ value }: { value: string }) =>
        value === "Y" ? "사용" : "미사용",
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
      name: "sysRegDtimeStr",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
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
      name: "sysModDtimeStr",
      width: 150,
      align: "center",
      editable: false,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
    },
  ],
  height: 400,
  rowBtnType: {
    rowAdd: true,
    rowDel: true,
    rowUpdate: true,
    rowExcelAll: false,
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "batchSearchForm",
  saveAfterSearch: false,
  action: "/system/monitoringMgmt.getBatchList.do",
  saveAction: "/system/monitoringMgmt.putBatchList.do",
  actionAfterCallback: true,
  saveAfterCallback: true,
  saveBeforeCallback: true,
  onAddAfterCallback: true,
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
  // 추가 설정
  scrollX: true,
  scrollY: true,
  useClientSort: false,
  editingEvent: "click",
  minRowHeight: 40,
  rowHeight: 40,
};

const BatchManagement: React.FC = () => {
  // 상태 관리
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [batchListTotalCount, setBatchListTotalCount] = useState<number>(0);

  // GridBuilder refs
  const batchListGridRef = useRef<unknown>(null);

  // 배치 목록 그리드 초기화
  const handleBatchListGridInit = (grid: unknown) => {
    batchListGridRef.current = grid;

    // 배치 실행 버튼 클릭 이벤트
    try {
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "click",
        (ev: unknown) => {
          try {
            const { rowKey, columnName } = ev as {
              rowKey: number;
              columnName: string;
            };

            if (
              columnName === "callPrc" &&
              rowKey !== undefined &&
              rowKey !== null
            ) {
              const batchId = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "batchId");
              const exeYn = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "exeYn");
              const useYn = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "useYn");
              const prmt = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "prmt");

              if (batchId) {
                handleRunBatch(batchId, exeYn, useYn, prmt);
              }
            }
          } catch (error) {
            console.error("배치 실행 버튼 클릭 이벤트 처리 중 오류:", error);
          }
        }
      );

      // 시작일시, 종료일시 더블클릭 이벤트
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "dblclick",
        (ev: unknown) => {
          try {
            const { rowKey, columnName } = ev as {
              rowKey: number;
              columnName: string;
            };

            if (
              (columnName === "strtDtime" || columnName === "endDtime") &&
              rowKey !== undefined &&
              rowKey !== null
            ) {
              const currentValue = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, columnName);

              if (
                !currentValue ||
                currentValue === "" ||
                currentValue === null ||
                currentValue === undefined
              ) {
                const now = new Date();
                const formattedTimestamp = formatDateTime(now);

                (
                  grid as {
                    setValue: (
                      rowKey: number,
                      col: string,
                      value: string
                    ) => void;
                  }
                ).setValue(rowKey, columnName, formattedTimestamp);

                // 체크박스 체크
                (
                  grid as {
                    setValue: (
                      rowKey: number,
                      col: string,
                      value: boolean
                    ) => void;
                  }
                ).setValue(rowKey, "check", true);
              }
            }
          } catch (error) {
            console.error("더블클릭 이벤트 처리 중 오류:", error);
          }
        }
      );
    } catch (error) {
      console.error("그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 배치 목록 검색 콜백
  const handleBatchListSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: Batch[]; total?: number };

      if (responseObj.data) {
        setBatches(responseObj.data);

        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setBatchListTotalCount(totalCount);
      } else {
        setBatches([]);
        setBatchListTotalCount(0);
      }
    }

    // 검색 완료 후 로딩 상태 해제
    setLoading(false);
  };

  // 배치 목록 저장 전 콜백
  const handleBatchListSaveBefore = (): boolean => {
    // GridBuilder에서 자체적으로 체크된 행 확인과 confirm을 처리하므로
    // 여기서는 기본 검증만 수행
    return true;
  };

  // 배치 목록 저장 콜백
  const handleBatchListSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      // GridBuilder에서 이미 성공 메시지를 출력하므로 여기서는 출력하지 않음

      // 저장 성공 시 배치 목록 다시 조회
      handleSearch();
    } else {
      // 실패 시에만 메시지 출력 (GridBuilder에서 실패 메시지를 출력하지 않는 경우)
      if (!responseObj?.message) {
        MzAlert.alert("배치 정보 저장에 실패했습니다.");
      }
    }
  };

  // 배치 목록 추가 후 콜백
  const handleBatchListAddAfter = () => {
    if (batchListGridRef.current) {
      try {
        const grid = batchListGridRef.current as any;

        // 최근 추가된 행의 인덱스를 찾아서 기본값 설정
        const rowCount = grid.getRowCount();
        if (rowCount > 0) {
          const lastRowIdx = rowCount - 1;

          // 기본값 설정
          grid.setValue(lastRowIdx, "dupExePsbYn", "N");
          grid.setValue(lastRowIdx, "exeYn", "N");
          grid.setValue(lastRowIdx, "useYn", "Y");
        }
      } catch (error) {
        console.error("배치 추가 후 기본값 설정 중 오류:", error);
      }
    }
  };

  // 배치 실행 처리
  const handleRunBatch = async (
    batchId: string,
    exeYn: string,
    useYn: string,
    prmt: string
  ) => {
    try {
      // 실행 중인지 확인
      if (exeYn === "Y") {
        MzAlert.alert("배치가 이미 실행 중입니다.");
        return;
      }

      // 사용 여부 확인
      if (useYn === "N") {
        MzAlert.alert("사용하지 않는 배치입니다.");
        return;
      }

      const confirmResult = await MzAlert.confirm(
        `배치 [${batchId}]를 실행하시겠습니까?`
      );
      if (!confirmResult.isConfirmed) return;

      setLoading(true);

      const params: RunBatchReqDto = {
        batchId: batchId,
        prmt: prmt,
      };

      const result = await runBatch(params);

      if (result.data.succeeded) {
        MzAlert.alert("배치 작업 실행 요청이 완료되었습니다.");
        // 배치 목록 다시 조회하여 실행 상태 업데이트
        handleSearch();
      } else {
        MzAlert.alert(result.data.message || "배치 실행에 실패했습니다.");
      }
    } catch (error) {
      console.error("배치 실행 중 오류:", error);
      MzAlert.alert("배치 실행 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜를 'yyyy-MM-dd HH:mm:ss' 형식의 문자열로 변환하는 헬퍼 함수
  const formatDateTime = (date: Date): string => {
    if (!(date instanceof Date)) {
      return "";
    }
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  };

  // 검색
  const handleSearch = async (customQuery?: Partial<Query>) => {
    setLoading(true);
    setError("");

    // 폼에 검색 조건 설정
    const form = document.querySelector("#batchSearchForm") as HTMLFormElement;
    if (form) {
      const batchNmInput = form.querySelector(
        'input[name="batchNm"]'
      ) as HTMLInputElement;
      const useYnInput = form.querySelector(
        'input[name="useYn"]'
      ) as HTMLInputElement;

      if (batchNmInput)
        batchNmInput.value = customQuery?.batchNm || query.batchNm || "";
      if (useYnInput)
        useYnInput.value = customQuery?.useYn || query.useYn || "";
    }

    // GridBuilder로 검색 실행
    if (batchListGridRef.current) {
      try {
        (
          batchListGridRef.current as { doSearch: (args?: unknown) => void }
        ).doSearch();
      } catch (error) {
        console.error("GridBuilder doSearch 호출 중 오류:", error);
        setLoading(false);
      }
    } else {
      console.error("배치 목록 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setQuery(initialQuery);
    setBatches([]);
    setError("");
    setBatchListTotalCount(0);

    // 배치 목록 그리드 초기화
    if (batchListGridRef.current) {
      try {
        (
          batchListGridRef.current as { resetData: (data: unknown[]) => void }
        ).resetData([]);
      } catch (error) {
        console.error("배치 목록 그리드 초기화 중 오류:", error);
      }
    }
  };

  // 쿼리 변경 핸들러
  const handleQueryChange = (field: keyof Query, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  // Enter 키 이벤트 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    // 초기 로드 시에는 검색하지 않음 (사용자가 검색 조건을 입력하도록 유도)
  }, []);

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="배치 관리"
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
                <th>배치명</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    id="search-batchNm"
                    name="batchNm"
                    value={query.batchNm}
                    onChange={(e) =>
                      handleQueryChange("batchNm", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    placeholder="배치명을 입력해주세요."
                    style={{ width: "180px" }}
                  />
                </td>
                <th>사용여부</th>
                <td>
                  <MzSelectBox
                    size="2"
                    type="dropdown"
                    className="dropdown"
                    options={["전체", "사용", "미사용"]}
                    selected={
                      query.useYn === ""
                        ? "전체"
                        : query.useYn === "Y"
                          ? "사용"
                          : "미사용"
                    }
                    style={{ width: "160px" }}
                    onSelect={(v) => {
                      const selected = typeof v === "string" ? v : v[0];
                      const useYn =
                        selected === "전체"
                          ? ""
                          : selected === "사용"
                            ? "Y"
                            : "N";
                      handleQueryChange("useYn", useYn);
                    }}
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
          title="배치 목록"
          subTitle={
            batchListTotalCount > 0
              ? `(총 ${batchListTotalCount}건)`
              : undefined
          }
        />

        {/* 배치 검색 폼 */}
        <form id="batchSearchForm" style={{ display: "none" }}>
          <input type="hidden" name="batchNm" value={query.batchNm} />
          <input type="hidden" name="useYn" value={query.useYn} />
          <input type="hidden" name="action" value="" />
        </form>

        <GridBuilder
          gridId="batchListGrid"
          config={batchListGridConfig}
          resizable={true}
          onInit={handleBatchListGridInit}
          onSearchCallback={handleBatchListSearch}
          onSaveCallback={handleBatchListSave}
          onSaveBeforeCallback={handleBatchListSaveBefore}
          onAddAfterCallback={handleBatchListAddAfter}
        />
      </div>
    </>
  );
};

export default BatchManagement;
