"use client";
import React, { useState, useRef } from "react";
import MzInputText from "../../../common/components/form/mzInputText";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzButton from "../../../common/components/ui/mzButton";
import MzAlert from "../../../common/components/ui/mzAlert";
import GridBuilder, {
  DateUtil,
} from "../../../admin/components/sample/exGridBuilder";
import AdminTitle from "../../../admin/components/common/adminTitle";
import "../../styles/adminStyle.scss";
import styles from "../mgmt.module.scss";

// 명명규칙에 따라 변수명 지정
const initialQuery = {
  grpCd: "", // 공통코드ID (백엔드 필드명에 맞춤)
  grpCdNm: "", // 공통코드명 (백엔드 필드명에 맞춤)
  useYn: "", // 사용여부
};

const useYnOptions = ["전체", "사용", "사용안함"];

// 사용여부 값 매핑
const getUseYnValue = (displayValue: string): string => {
  switch (displayValue) {
    case "사용":
      return "Y";
    case "사용안함":
      return "N";
    default:
      return "";
  }
};

// 코드 그룹 그리드 설정
const codeGroupGridConfig = {
  id: "codeGroupGrid",
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
      header: "공통코드ID",
      name: "grpCd",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 20,
        },
      },
      editable: "new",
      required: true,
    },
    {
      header: "공통코드명",
      name: "grpCdNm",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
      editable: true,
      required: true,
    },
    {
      header: "코드설명",
      name: "grpCdDesc",
      width: 180,
      editor: {
        type: "text",
        options: {
          maxLength: 200,
        },
      },
      editable: true,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 80,
      formatter: "listItemText",
      editor: {
        type: "select",
        options: {
          listItems: [
            { text: "사용", value: "Y" },
            { text: "사용안함", value: "N" },
          ],
        },
      },
      editable: true,
    },
    {
      header: "정렬순서",
      name: "sortSeq",
      width: 80,
      editor: {
        type: "text",
        options: {
          maxLength: 5,
        },
      },
      editable: true,
    },
    {
      header: "등록자",
      name: "sysRegrId",
      width: 100,
      editable: false,
    },
    {
      header: "등록일시",
      name: "sysRegDtime",
      width: 140,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
      editable: false,
    },
    {
      header: "수정자",
      name: "sysModrId",
      width: 100,
      editable: false,
    },
    {
      header: "수정일시",
      name: "sysModDtime",
      width: 140,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
      editable: false,
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: true,
    rowDel: true,
    rowUpdate: true,
    rowExcelAll: true,
    excelFileName: "codeGroupData",
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "codeMgtForm",
  saveAfterSearch: false, // 저장 후 자동 조회 비활성화 (수동으로 처리)
  saveAfterCallback: true, // 저장 후 콜백 활성화
  actionAfterCallback: true, // 검색 후 콜백 활성화
  action: "/system/baseInfoMgmt.getStGrpCdList.do",
  saveAction: "/system/baseInfoMgmt.putStGrpCdList.do",
  excelAction: "/baseInfoMgmt.getCodeListExcelDownload.do",
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

// 코드 상세 그리드 설정
const codeDetailGridConfig = {
  id: "codeDetailGrid",
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
      header: "공통코드ID",
      name: "grpCd",
      width: 120,
      editable: false,
      required: true,
      copyOnAdd: "codeDetailForm_grpCd", // 행 추가 시 자동으로 그룹코드 설정
    },
    {
      header: "코드ID",
      name: "cd",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 20,
        },
      },
      editable: "new",
      required: true,
    },
    {
      header: "코드명",
      name: "cdNm",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
      editable: true,
      required: true,
      defaultVal: "",
    },
    {
      header: "그룹구분코드",
      name: "grpSctCd",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 10,
        },
      },
      editable: true,
    },
    {
      header: "그룹구분명",
      name: "grpSctNm",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
      editable: true,
    },
    {
      header: "매핑코드값",
      name: "grpSctCd",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
      editable: true,
    },
    {
      header: "코드경로",
      name: "cdPathAddr",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 200,
        },
      },
      editable: true,
    },
    {
      header: "표시명",
      name: "mrkNm",
      width: 120,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
      editable: true,
      defaultVal: "",
    },
    {
      header: "코드설명",
      name: "cdDesc",
      width: 180,
      editor: {
        type: "text",
        options: {
          maxLength: 200,
        },
      },
      editable: true,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 80,
      formatter: "listItemText",
      editor: {
        type: "select",
        options: {
          listItems: [
            { text: "사용", value: "Y" },
            { text: "사용안함", value: "N" },
          ],
        },
      },
      editable: true,
      required: true,
      defaultVal: "Y",
    },
    {
      header: "정렬순서",
      name: "sortSeq",
      width: 80,
      editor: {
        type: "text",
        options: {
          maxLength: 5,
        },
      },
      editable: true,
    },
    {
      header: "참조1값",
      name: "ref1Val",
      width: 100,
      editor: {
        type: "text",
        options: {
          maxLength: 100,
        },
      },
      editable: true,
    },
    {
      header: "참조2값",
      name: "ref2Val",
      width: 100,
      editor: {
        type: "text",
        options: {
          maxLength: 100,
        },
      },
      editable: true,
    },
    {
      header: "참조3값",
      name: "ref3Val",
      width: 100,
      editor: {
        type: "text",
        options: {
          maxLength: 100,
        },
      },
      editable: true,
    },
    {
      header: "참조4값",
      name: "ref4Val",
      width: 100,
      editor: {
        type: "text",
        options: {
          maxLength: 100,
        },
      },
      editable: true,
    },
    {
      header: "참조5값",
      name: "ref5Val",
      width: 100,
      editor: {
        type: "text",
        options: {
          maxLength: 100,
        },
      },
      editable: true,
    },
    {
      header: "등록자",
      name: "sysRegrId",
      width: 100,
      editable: false,
    },
    {
      header: "등록일시",
      name: "sysRegDtime",
      width: 140,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
      editable: false,
    },
    {
      header: "수정자",
      name: "sysModrId",
      width: 100,
      editable: false,
    },
    {
      header: "수정일시",
      name: "sysModDtime",
      width: 140,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
      editable: false,
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: true,
    rowDel: true,
    rowUpdate: true,
    rowExcelAll: true,
    excelFileName: "codeDetailData",
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "codeDetailForm", // 별도 폼 사용
  saveAfterSearch: false, // 저장 후 자동 조회 비활성화 (수동으로 처리)
  saveAfterCallback: true, // 저장 후 콜백 활성화
  actionAfterCallback: true, // 검색 후 콜백 활성화
  action: "/system/baseInfoMgmt.getStStdCdList.do",
  saveAction: "/system/baseInfoMgmt.putStStdCdList.do",
  excelAction: "/baseInfoMgmt.getCodeListExcelDownload.do",
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

const CodeMgt = () => {
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [codeGroupTotalCount, setCodeGroupTotalCount] = useState<number>(0);
  const [codeDetailTotalCount, setCodeDetailTotalCount] = useState<number>(0);
  const codeGroupGridRef = useRef<unknown>(null);
  const codeDetailGridRef = useRef<unknown>(null);

  // 검색 조건 변경 핸들러
  const handleQueryChange = (field: keyof typeof query, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  // 검색 조건이 변경될 때마다 히든 필드 업데이트
  React.useEffect(() => {
    const useYnInput = document.querySelector(
      'input[name="useYn"]'
    ) as HTMLInputElement;
    if (useYnInput) {
      useYnInput.value = query.useYn;
    }
  }, [query.useYn]);

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    // 폼에 검색 조건 설정
    const form = document.querySelector("#codeMgtForm") as HTMLFormElement;
    if (form) {
      // 폼 데이터를 직접 설정
      const formData = new FormData(form);
      formData.set("grpCd", query.grpCd);
      formData.set("grpCdNm", query.grpCdNm);
      formData.set("useYn", query.useYn);

      // 폼 요소들의 value도 직접 설정
      const grpCdInput = form.querySelector("#grpCd") as HTMLInputElement;
      const grpCdNmInput = form.querySelector("#grpCdNm") as HTMLInputElement;
      const useYnInput = form.querySelector(
        'input[name="useYn"]'
      ) as HTMLInputElement;

      if (grpCdInput) grpCdInput.value = query.grpCd;
      if (grpCdNmInput) grpCdNmInput.value = query.grpCdNm;
      if (useYnInput) useYnInput.value = query.useYn;
    }

    if (codeGroupGridRef.current) {
      (
        codeGroupGridRef.current as { doSearch: (args?: unknown) => void }
      ).doSearch();
    } else {
      console.error("코드 그룹 그리드가 초기화되지 않았습니다.");
    }
  };

  // 초기화 버튼 클릭 핸들러
  const handleReset = () => {
    setQuery(initialQuery);
    setCodeGroupTotalCount(0);
    setCodeDetailTotalCount(0);
    const form = document.querySelector("#codeMgtForm") as HTMLFormElement;
    if (form) {
      form.reset();
      // 히든 필드도 초기화
      const useYnInput = form.querySelector(
        'input[name="useYn"]'
      ) as HTMLInputElement;
      if (useYnInput) {
        useYnInput.value = "";
      }
    }

    // 그리드 데이터 초기화
    if (codeGroupGridRef.current) {
      (
        codeGroupGridRef.current as { resetData: (data: unknown[]) => void }
      ).resetData([]);
    }
  };

  // 코드 그룹 그리드 초기화
  const handleCodeGroupGridInit = (grid: unknown) => {
    codeGroupGridRef.current = grid;

    // 행 클릭 시 코드 상세 조회
    try {
      (
        grid as {
          on: (event: string, cb: (ev: unknown) => void) => void;
          getValue: (rowKey: number, col: string) => string;
        }
      ).on("click", (ev: unknown) => {
        try {
          const { rowKey } = ev as { rowKey: number };
          if (rowKey !== undefined && rowKey !== null) {
            const grpCd = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "grpCd");
            if (grpCd && codeDetailGridRef.current) {
              // 코드 상세 조회를 위한 별도 폼에 값 설정
              const detailForm = document.querySelector(
                "#codeDetailForm"
              ) as HTMLFormElement;
              if (detailForm) {
                // 기존 필드들 제거
                detailForm.innerHTML = "";

                // 상세조회용 grpCd 필드 생성
                const detailGrpCdInput = document.createElement("input");
                detailGrpCdInput.type = "hidden";
                detailGrpCdInput.name = "grpCd";
                detailGrpCdInput.value = grpCd;
                detailForm.appendChild(detailGrpCdInput);

                // copyOnAdd용 grpCd 필드 생성
                const copyOnAddGrpCdInput = document.createElement("input");
                copyOnAddGrpCdInput.type = "hidden";
                copyOnAddGrpCdInput.id = "codeDetailForm_grpCd";
                copyOnAddGrpCdInput.value = grpCd;
                detailForm.appendChild(copyOnAddGrpCdInput);
              }

              // 코드 상세 그리드 조회
              (
                codeDetailGridRef.current as {
                  doSearch: (args?: unknown) => void;
                }
              ).doSearch();
            }
          }
        } catch (error) {
          console.error("행 클릭 이벤트 처리 중 오류:", error);
        }
      });
    } catch (error) {
      console.error("그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 코드 상세 그리드 초기화
  const handleCodeDetailGridInit = (grid: unknown) => {
    codeDetailGridRef.current = grid;
  };

  // 코드 그룹 검색 콜백
  const handleCodeGroupSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: any[]; total?: number };

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setCodeGroupTotalCount(totalCount);
      } else {
        setCodeGroupTotalCount(0);
      }
    }
  };

  // 코드 상세 검색 콜백
  const handleCodeDetailSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: any[]; total?: number };

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setCodeDetailTotalCount(totalCount);
      } else {
        setCodeDetailTotalCount(0);
      }
    }
  };

  // 코드 그룹 저장 콜백
  const handleCodeGroupSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      // GridBuilder에서 이미 성공 메시지를 출력하므로 여기서는 출력하지 않음

      // 저장 성공 시 코드 그룹 목록 다시 조회
      setTimeout(() => {
        if (codeGroupGridRef.current) {
          (
            codeGroupGridRef.current as { doSearch: (args?: unknown) => void }
          ).doSearch();
        }

        // 현재 선택된 그룹코드가 있다면 코드 상세도 다시 조회
        const detailForm = document.querySelector(
          "#codeDetailForm"
        ) as HTMLFormElement;
        if (detailForm) {
          const grpCdInput = detailForm.querySelector(
            'input[name="grpCd"]'
          ) as HTMLInputElement;
          if (grpCdInput && grpCdInput.value && codeDetailGridRef.current) {
            (
              codeDetailGridRef.current as {
                doSearch: (args?: unknown) => void;
              }
            ).doSearch();
          }
        }
      }, 100);
    } else {
      // 실패 시에만 메시지 출력 (GridBuilder에서 실패 메시지를 출력하지 않는 경우)
      if (!responseObj?.message) {
        MzAlert.alert("코드 그룹 저장에 실패했습니다.");
      }
    }
  };

  // 코드 상세 저장/삭제 콜백
  const handleCodeDetailSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      // GridBuilder에서 이미 성공 메시지를 출력하므로 여기서는 출력하지 않음

      // 저장/삭제 후 현재 선택된 그룹코드로 다시 조회
      if (codeDetailGridRef.current) {
        // 현재 선택된 그룹코드 확인
        const detailForm = document.querySelector(
          "#codeDetailForm"
        ) as HTMLFormElement;
        if (detailForm) {
          const grpCdInput = detailForm.querySelector(
            'input[name="grpCd"]'
          ) as HTMLInputElement;
          if (grpCdInput && grpCdInput.value) {
            // 저장/삭제 후 수동으로 조회
            setTimeout(() => {
              if (codeDetailGridRef.current) {
                (
                  codeDetailGridRef.current as {
                    doSearch: (args?: unknown) => void;
                  }
                ).doSearch();
              }
            }, 100);
          }
        }
      }
    } else {
      // 실패 시에만 메시지 출력 (GridBuilder에서 실패 메시지를 출력하지 않는 경우)
      if (!responseObj?.message) {
        MzAlert.alert("코드 상세 저장에 실패했습니다.");
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

  // 페이지 로드 시 초기화
  React.useEffect(() => {
    // 코드 상세 조회용 별도 폼 생성
    let detailForm = document.querySelector(
      "#codeDetailForm"
    ) as HTMLFormElement;
    if (!detailForm) {
      detailForm = document.createElement("form");
      detailForm.id = "codeDetailForm";
      detailForm.style.display = "none";
      document.body.appendChild(detailForm);
    }
  }, []);

  return (
    <div className="code-mgt-wrap">
      {/* 상단 검색 조건 영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="코드 관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />

        {/* 검색 폼 */}
        <div className="searchForm">
          <form id="codeMgtForm">
            <input type="hidden" name="action" value="" />
            <table>
              <colgroup>
                <col width="140px" />
                <col width="240px" />
                <col width="140px" />
                <col width="240px" />
                <col width="140px" />
                <col width="180px" />
              </colgroup>
              <tbody>
                <tr>
                  <th>공통코드ID</th>
                  <td>
                    <MzInputText
                      id="grpCd"
                      name="grpCd"
                      value={query.grpCd}
                      onChange={(e) =>
                        handleQueryChange("grpCd", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="공통코드ID"
                      mzSize="2"
                    />
                  </td>
                  <th>공통코드명</th>
                  <td>
                    <MzInputText
                      id="grpCdNm"
                      name="grpCdNm"
                      value={query.grpCdNm}
                      onChange={(e) =>
                        handleQueryChange("grpCdNm", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="공통코드명"
                      mzSize="2"
                    />
                  </td>
                  <th>사용여부</th>
                  <td>
                    <MzSelectBox
                      id="useYn"
                      options={useYnOptions}
                      selected={query.useYn}
                      onSelect={(val) =>
                        handleQueryChange("useYn", getUseYnValue(val as string))
                      }
                      size="2"
                    />
                    <input
                      type="hidden"
                      name="useYn"
                      value={query.useYn}
                      onChange={() => {}}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>

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
        {/* 코드 그룹 그리드 */}
        <AdminTitle
          title="코드 그룹"
          subTitle={
            codeGroupTotalCount > 0
              ? `(총 ${codeGroupTotalCount}건)`
              : undefined
          }
        />
        <GridBuilder
          gridId="codeGroupGrid"
          config={codeGroupGridConfig}
          resizable={true}
          onInit={handleCodeGroupGridInit}
          onSearchCallback={handleCodeGroupSearch}
          onSaveCallback={handleCodeGroupSave}
        />
      </div>

      {/* [03] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        {/* 코드 상세 그리드 */}
        <AdminTitle
          title="코드 상세"
          subTitle={
            codeDetailTotalCount > 0
              ? `(총 ${codeDetailTotalCount}건)`
              : undefined
          }
        />
        <GridBuilder
          gridId="codeDetailGrid"
          config={codeDetailGridConfig}
          resizable={true}
          onInit={handleCodeDetailGridInit}
          onSearchCallback={handleCodeDetailSearch}
          onSaveCallback={handleCodeDetailSave}
        />
      </div>
    </div>
  );
};

export default CodeMgt;
