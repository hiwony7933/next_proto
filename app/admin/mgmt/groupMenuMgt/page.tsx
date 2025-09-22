"use client";
import React, { useState, useEffect, useRef } from "react";
import GridBuilder, { DateUtil } from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import MzButton from "../../../common/components/ui/mzButton";
import MzInputText from "../../../common/components/form/mzInputText";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzAlert from "../../../common/components/ui/mzAlert";
import MzCommonCodeSelect from "../../../common/components/form/mzCommonCodeSelect";
import styles from "../mgmt.module.scss";
import "../../styles/adminStyle.scss";
import "../../components/sample/exGridBuilder.scss";

// 업무그룹 정보 타입 정의
type JobGroup = {
  jobGrpCd: string;
  jobGrpNm: string;
  jobSctCd: string;
  useYn: string;
  sysRegrId?: string;
  sysRegDtimeStr?: string;
  sysModrId?: string;
  sysModDtimeStr?: string;
};

// 메뉴화면 맵핑 정보 타입 정의
type MenuMapping = {
  mrkNm: string;
  lvl: string;
  useYn: string;
  rtTgtSeq: string;
  jobGrpCd: string;
  orgUseYn: string;
  ancestorid: string;
};

// 최상위 메뉴 정보 타입 정의
type TopMenu = {
  ancestorid: string;
  rtTgtNm: string;
  lvl: number;
};

// 검색 조건 타입
type Query = {
  jobGrpNm: string;
  jobSctCd: string;
  useYn: string;
};

// 상수
const initialQuery: Query = { jobGrpNm: "", jobSctCd: "", useYn: "" };

// 업무그룹명 그리드 설정
const jobGroupGridConfig = {
  id: "jobGroupGrid",
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
      header: "업무그룹코드",
      name: "jobGrpCd",
      width: 150,
      align: "center",
      editable: "new",
      required: true,
      editor: {
        type: "text",
        options: {
          maxLength: 20,
        },
      },
    },
    {
      header: "업무그룹명",
      name: "jobGrpNm",
      width: 300,
      align: "center",
      editable: true,
      required: true,
      editor: {
        type: "text",
        options: {
          maxLength: 50,
        },
      },
    },
    {
      header: "사용자 구분",
      name: "jobSctCd",
      width: 120,
      align: "center",
      editable: true,
      required: true,
      editor: {
        type: "select",
        options: {
          listItems: [], // 동적으로 COM138 데이터를 가져와서 설정
        },
      },
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 100,
      align: "center",
      editable: true,
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
  form: "jobGroupSearchForm",
  saveAfterSearch: false,
  action: "/system/userMgmt.getStJobGrpBaseList.do",
  saveAction: "/system/userMgmt.putStJobGrpBaseList.do",
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
  scrollX: true,
  scrollY: true,
  useClientSort: false,
  editingEvent: "dblclick", // 'click'에서 'dblclick'으로 변경
  minRowHeight: 40,
  rowHeight: 40,
  requiredColumns: [
    { name: "jobGrpCd", header: "업무그룹코드" },
    { name: "jobGrpNm", header: "업무그룹명" },
    { name: "jobSctCd", header: "사용자 구분" },
  ],
};

// 메뉴화면 맵핑 그리드 설정
const menuMappingGridConfig = {
  id: "menuMappingGrid",
  rowHeaders: [], // 트리 그리드에서는 exGridBuilder에서 체크박스를 자동으로 추가
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "메뉴명",
      name: "mrkNm",
      width: 600,
      align: "left",
      editable: false,
    },
    {
      header: "LEVEL",
      name: "lvl",
      width: 80,
      align: "center",
      editable: false,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "대상순번",
      name: "rtTgtSeq",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      header: "업무그룹코드",
      name: "jobGrpCd",
      width: 120,
      align: "center",
      editable: false,
    },
    {
      header: "원본사용여부",
      name: "orgUseYn",
      width: 100,
      align: "center",
      editable: false,
    },
  ],
  height: 400,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: true,
    rowExcelAll: false,
    // 트리 그리드 전용 버튼들 추가
    treeCancel: true, // 취소 버튼
    treeSelectAll: true, // 전체선택 버튼
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "menuMappingSearchForm",
  saveAfterSearch: false,
  action: "/system/userMgmt.getStJobGrpRtInfoList.do",
  saveAction: "/system/userMgmt.putStJobGrpRtInfoList.do",
  actionAfterCallback: true,
  saveAfterCallback: true,
  saveBeforeCallback: true,
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
  scrollX: true,
  scrollY: true,
  useClientSort: false,
  editingEvent: "click",
  minRowHeight: 40,
  rowHeight: 40,
  // 트리 그리드 설정 개선
  tree: {
    col: 0, // 메뉴명 컬럼이 트리 컬럼
    levelref: "lvl", // 레벨 참조 필드
    open: true, // 기본 펼침 상태
    lock: true, // 트리 잠금
    checkbox: true, // 체크박스 사용
    checked: true, // 기본 체크 상태
    iconclickeventignore: true, // 아이콘 클릭 이벤트 무시
    useCascadingCheckbox: true, // 계층형 체크박스 사용
  },
};

const GroupMenuManagement: React.FC = () => {
  // 상태 관리
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [jobGroups, setJobGroups] = useState<JobGroup[]>([]);
  const [menuMappings, setMenuMappings] = useState<MenuMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [jobGroupTotalCount, setJobGroupTotalCount] = useState<number>(0);
  const [menuMappingTotalCount, setMenuMappingTotalCount] = useState<number>(0);
  const [selectedJobGroup, setSelectedJobGroup] = useState<string>("");
  const [selectedJobSctCd, setSelectedJobSctCd] = useState<string>("");

  // 사용자 구분 선택 상태 추가
  const [selectedJobSctCdForSearch, setSelectedJobSctCdForSearch] =
    useState<string>("");

  // 최상위 메뉴 목록 상태 추가
  const [topMenus, setTopMenus] = useState<TopMenu[]>([]);
  const [selectedTopMenu, setSelectedTopMenu] = useState<string>("");

  // COM138 사용자 구분 코드 데이터 상태 추가
  const [jobSctCdOptions, setJobSctCdOptions] = useState<
    Array<{ text: string; value: string }>
  >([]);

  // GridBuilder refs
  const jobGroupGridRef = useRef<unknown>(null);
  const menuMappingGridRef = useRef<unknown>(null);

  // COM138 사용자 구분 코드 데이터 조회
  const fetchJobSctCdOptions = async () => {
    try {
      const response = await fetch(
        "/system/commonCodeRepository.getCodeDetailList.do",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grpCd: "COM138",
            useYn: "Y",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const options = result.data
            .filter((item: any) => item && item.cd && item.mrkNm)
            .map((item: any) => ({
              text: item.mrkNm || item.cdNm || "",
              value: item.cd,
            }));
          setJobSctCdOptions(options);
        }
      } else {
        console.error("COM138 사용자 구분 코드 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("COM138 사용자 구분 코드 조회 중 오류:", error);
    }
  };

  // 최상위 메뉴 목록 조회
  const fetchTopMenus = async () => {
    try {
      const response = await fetch("/system/userMgmt.getStJobGrpBaseCombo.do", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setTopMenus(result.data);
          // 첫 번째 메뉴를 기본 선택 (상태만 설정, 조회는 하지 않음)
          if (result.data.length > 0) {
            const firstMenu = result.data[0];
            setSelectedTopMenu(firstMenu.ancestorid);
          }
        }
      } else {
        console.error("최상위 메뉴 목록 조회 실패:");
      }
    } catch (error) {
      console.error("최상위 메뉴 목록 조회 중 오류:", error);
    }
  };

  // 업무그룹명 그리드 초기화
  const handleJobGroupGridInit = (grid: unknown) => {
    try {
      // 그리드가 유효한지 확인
      if (!grid || typeof (grid as any).getData !== "function") {
        console.warn("Invalid grid passed to handleJobGroupGridInit");
        return;
      }

      jobGroupGridRef.current = grid;

      // COM138 사용자 구분 코드 데이터를 그리드 컬럼에 설정
      if (jobSctCdOptions.length > 0) {
        const gridInstance = grid as any;
        const columnIndex = 2; // 사용자 구분 컬럼 인덱스 (0-based)

        if (gridInstance.setColumnOptions) {
          gridInstance.setColumnOptions(columnIndex, {
            editor: {
              type: "select",
              options: {
                listItems: jobSctCdOptions,
              },
            },
          });
        }
      }

      // 업무그룹명 그리드 클릭 이벤트
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "click",
        (ev: unknown) => {
          try {
            const { rowKey, columnName } = ev as {
              rowKey: number;
              columnName: string;
            };

            if (
              rowKey !== undefined &&
              rowKey !== null &&
              columnName === "jobGrpCd"
            ) {
              const jobGrpCd = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "jobGrpCd");
              const jobSctCd = (
                grid as { getValue: (rowKey: number, col: string) => string }
              ).getValue(rowKey, "jobSctCd");

              console.log("업무그룹 클릭:", {
                jobGrpCd,
                jobSctCd,
                rowKey,
                columnName,
              });

              if (jobGrpCd && jobSctCd) {
                setSelectedJobGroup(jobGrpCd);
                setSelectedJobSctCd(jobSctCd);

                // 드롭다운 첫번째 항목으로 메뉴화면 맵핑 그리드 검색
                if (topMenus.length > 0) {
                  const firstMenu = topMenus[0];
                  console.log(
                    "업무그룹 클릭 시 드롭다운 첫번째 메뉴:",
                    firstMenu
                  );

                  setSelectedTopMenu(firstMenu.ancestorid);
                  // handleMenuMappingSearch 호출 제거 - useEffect에서 처리
                } else {
                  console.log(
                    "업무그룹 클릭 시 topMenus가 비어있음, 메뉴화면 맵핑 조회 건너뜀"
                  );
                }
              }
            }
          } catch (error) {
            console.error("업무그룹명 그리드 클릭 이벤트 처리 중 오류:", error);
          }
        }
      );
    } catch (error) {
      console.error("업무그룹명 그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 메뉴화면 맵핑 그리드 초기화
  const handleMenuMappingGridInit = (grid: unknown) => {
    try {
      menuMappingGridRef.current = grid;

      // 메뉴화면 맵핑 그리드 클릭 이벤트 (원본 SBGrid 방식)
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "click",
        (ev: unknown) => {
          try {
            const { rowKey, columnName } = ev as {
              rowKey: number;
              columnName: string;
            };

            if (rowKey !== undefined && rowKey !== null) {
              const gridInstance = grid as any;

              // 체크박스 상태 확인 및 처리
              const checkedYn = gridInstance.getTreeCheckboxChecked?.(
                rowKey,
                "viewpoint"
              )
                ? "Y"
                : "N";

              // useYn 값 업데이트
              gridInstance.setValue?.(rowKey, "useYn", checkedYn);

              // 원본값과 비교하여 상태 업데이트
              const orgUseYn = gridInstance.getValue?.(rowKey, "orgUseYn");
              if (checkedYn !== orgUseYn) {
                gridInstance.setRowStatus?.(rowKey, "update");
              } else {
                gridInstance.removeRowStatus?.(rowKey, "update");
              }

              // 자식 노드들 처리 (원본 SBGrid 방식)
              const childRows = gridInstance.getTreeChildRows?.(rowKey);
              if (childRows && childRows.length > 0) {
                childRows.forEach((childRowKey: number) => {
                  try {
                    // 자식 노드의 useYn 값 업데이트
                    gridInstance.setValue?.(childRowKey, "useYn", checkedYn);

                    // 자식 노드의 체크박스 상태 업데이트
                    if (checkedYn === "Y") {
                      gridInstance.check?.(childRowKey);
                    } else {
                      gridInstance.uncheck?.(childRowKey);
                    }

                    // 자식 노드의 상태 업데이트
                    const childOrgUseYn = gridInstance.getValue?.(
                      childRowKey,
                      "orgUseYn"
                    );
                    if (checkedYn !== childOrgUseYn) {
                      gridInstance.setRowStatus?.(childRowKey, "update");
                    } else {
                      gridInstance.removeRowStatus?.(childRowKey, "update");
                    }
                  } catch (childError) {
                    console.warn(
                      `Child row ${childRowKey} processing failed:`,
                      childError
                    );
                  }
                });
              }
            }
          } catch (error) {
            console.error(
              "메뉴화면 맵핑 그리드 클릭 이벤트 처리 중 오류:",
              error
            );
          }
        }
      );

      // 트리 그리드 전용 이벤트 핸들러 (계층형 체크박스 처리는 exGridBuilder에서 처리)
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "check",
        (ev: unknown) => {
          try {
            const { rowKey } = ev as { rowKey: number };
            if (rowKey !== undefined && rowKey !== null) {
              // 계층형 체크박스 처리는 exGridBuilder의 handleTreeCheckbox에서 처리됨
              //console.log('Tree node checked:', rowKey);
            }
          } catch (error) {
            console.error("트리 그리드 체크 이벤트 처리 중 오류:", error);
          }
        }
      );

      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "uncheck",
        (ev: unknown) => {
          try {
            const { rowKey } = ev as { rowKey: number };
            if (rowKey !== undefined && rowKey !== null) {
              // 계층형 체크박스 처리는 exGridBuilder의 handleTreeCheckbox에서 처리됨
              //console.log('Tree node unchecked:', rowKey);
            }
          } catch (error) {
            console.error("트리 그리드 체크 해제 이벤트 처리 중 오류:", error);
          }
        }
      );

      // 트리 확장/축소 이벤트 핸들러 (원본 SBGrid의 aftertreeopened/aftertreeclosed)
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "expand",
        (ev: unknown) => {
          try {
            // console.log('Tree expanded:', ev);
            // 확장 후 상태 새로고침 (원본 SBGrid의 aftertreeopened와 동일)
            const gridInstance = grid as any;
            if (typeof gridInstance.refreshStatus === "function") {
              setTimeout(() => {
                gridInstance.refreshStatus();
              }, 100);
            }
          } catch (error) {
            console.error("트리 확장 이벤트 처리 중 오류:", error);
          }
        }
      );

      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "collapse",
        (ev: unknown) => {
          try {
            // console.log('Tree collapsed:', ev);
            // 축소 후 상태 새로고침 (원본 SBGrid의 aftertreeclosed와 동일)
            const gridInstance = grid as any;
            if (typeof gridInstance.refreshStatus === "function") {
              setTimeout(() => {
                gridInstance.refreshStatus();
              }, 100);
            }
          } catch (error) {
            console.error("트리 축소 이벤트 처리 중 오류:", error);
          }
        }
      );
    } catch (error) {
      console.error("메뉴화면 맵핑 그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 업무그룹명 그리드 검색 콜백
  const handleJobGroupSearch = (response: unknown) => {
    console.log("handleJobGroupSearch 호출됨:", response);

    if (response && typeof response === "object") {
      const responseObj = response as { data?: JobGroup[]; total?: number };

      if (responseObj.data) {
        setJobGroups(responseObj.data);

        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setJobGroupTotalCount(totalCount);

        // 첫 번째 행이 있으면 자동으로 선택 (메뉴화면 맵핑 조회는 useEffect에서 처리)
        if (responseObj.data.length > 0) {
          const firstRow = responseObj.data[0];
          console.log("첫 번째 업무그룹 선택:", firstRow);

          setSelectedJobGroup(firstRow.jobGrpCd);
          setSelectedJobSctCd(firstRow.jobSctCd);
          // handleMenuMappingSearch 호출 제거 - useEffect에서 처리
        }
      } else {
        setJobGroups([]);
        setJobGroupTotalCount(0);
        setSelectedJobGroup("");
        setSelectedJobSctCd("");
        setMenuMappings([]);
        setMenuMappingTotalCount(0);
      }
    }

    setLoading(false);
  };

  // 메뉴화면 맵핑 그리드 검색 콜백
  const handleMenuMappingSearchCallback = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: MenuMapping[]; total?: number };

      if (responseObj.data) {
        // 데이터를 트리 구조에 맞게 정렬
        const sortedData = sortMenuDataForTree(responseObj.data);
        setMenuMappings(sortedData);

        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setMenuMappingTotalCount(totalCount);
      } else {
        setMenuMappings([]);
        setMenuMappingTotalCount(0);
      }
    }
  };

  // 메뉴 데이터를 트리 구조에 맞게 정렬하는 함수
  const sortMenuDataForTree = (data: MenuMapping[]): MenuMapping[] => {
    if (!data || data.length === 0) return [];

    // 트리 구조를 위한 데이터 변환
    const treeData = data.map((item, index) => ({
      ...item,
      rowKey: index + 1, // TUI Grid에서 필요한 rowKey 추가
      _attributes: {
        tree: {
          parentRowKey: null,
          childRowKeys: [],
          expanded: true,
          hidden: false,
        },
      },
    }));

    // 부모-자식 관계 설정
    const nodeMap = new Map();

    // 먼저 모든 노드를 맵에 저장
    treeData.forEach((item) => {
      nodeMap.set(item.rtTgtSeq, item);
    });

    // 부모-자식 관계 설정
    treeData.forEach((item) => {
      const level = parseInt(item.lvl);

      if (level > 1) {
        // 부모 노드 찾기
        const parentNode = nodeMap.get(item.ancestorid);
        if (parentNode) {
          item._attributes.tree.parentRowKey = parentNode.rowKey;
          parentNode._attributes.tree.childRowKeys.push(item.rowKey);
        }
      }
    });

    return treeData;
  };

  // 메뉴화면 맵핑 검색
  const handleMenuMappingSearch = (
    jobGrpCd: string,
    jobSctCd: string,
    ancestorid?: string
  ) => {
    console.log("handleMenuMappingSearch 호출됨:", {
      jobGrpCd,
      jobSctCd,
      ancestorid,
    });

    if (!jobGrpCd || !jobSctCd) {
      console.log("jobGrpCd 또는 jobSctCd가 없어서 메뉴화면 맵핑 조회 건너뜀");
      return;
    }

    // 메뉴화면 맵핑 검색을 위한 동적 폼 생성
    let menuMappingForm = document.querySelector(
      "#menuMappingSearchForm"
    ) as HTMLFormElement;
    if (!menuMappingForm) {
      menuMappingForm = document.createElement("form");
      menuMappingForm.id = "menuMappingSearchForm";
      menuMappingForm.style.display = "none";
      document.body.appendChild(menuMappingForm);
    }

    // 기존 필드들 제거
    menuMappingForm.innerHTML = "";

    // 검색 조건 필드들 생성
    const jobGrpCdInput = document.createElement("input");
    jobGrpCdInput.type = "hidden";
    jobGrpCdInput.name = "jobGrpCd";
    jobGrpCdInput.value = jobGrpCd;
    menuMappingForm.appendChild(jobGrpCdInput);

    const rtTgtSctCdInput = document.createElement("input");
    rtTgtSctCdInput.type = "hidden";
    rtTgtSctCdInput.name = "rtTgtSctCd";
    rtTgtSctCdInput.value = jobSctCd;
    menuMappingForm.appendChild(rtTgtSctCdInput);

    // ancestorid가 명시적으로 'ALL'인 경우에만 ancestorid 필드를 전송하지 않음
    if (ancestorid && ancestorid !== "ALL") {
      const ancestoridInput = document.createElement("input");
      ancestoridInput.type = "hidden";
      ancestoridInput.name = "ancestorid";
      ancestoridInput.value = ancestorid;
      menuMappingForm.appendChild(ancestoridInput);
    }

    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "";
    menuMappingForm.appendChild(actionInput);

    console.log("메뉴화면 맵핑 폼 생성 완료:", {
      jobGrpCd,
      jobSctCd,
      ancestorid,
      formFields: menuMappingForm.innerHTML,
    });

    // 메뉴화면 맵핑 그리드 검색 실행
    if (menuMappingGridRef.current) {
      try {
        console.log("메뉴화면 맵핑 그리드 doSearch 호출");
        (
          menuMappingGridRef.current as { doSearch: (args?: unknown) => void }
        ).doSearch();
      } catch (error) {
        console.error("메뉴화면 맵핑 그리드 doSearch 호출 중 오류:", error);
      }
    } else {
      console.error("menuMappingGridRef.current가 null입니다.");
    }
  };

  // 업무그룹명 그리드 저장 전 콜백
  const handleJobGroupSaveBefore = (): boolean => {
    return true;
  };

  // 업무그룹명 그리드 저장 콜백
  const handleJobGroupSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      handleSearch();
    } else {
      if (!responseObj?.message) {
        MzAlert.alert("업무그룹 정보 저장에 실패했습니다.");
      }
    }
  };

  // 메뉴화면 맵핑 그리드 저장 전 콜백
  const handleMenuMappingSaveBefore = (): boolean => {
    return true;
  };

  // 메뉴화면 맵핑 그리드 저장 전 콜백 (원본 SBGrid 방식)
  const handleMenuMappingSaveBeforeWithTree = (): boolean => {
    if (!menuMappingGridRef.current) return false;

    const grid = menuMappingGridRef.current as any;

    // 변경된 데이터가 있는지 확인
    if (typeof grid.getUpdateData === "function") {
      const selectRows = grid.getUpdateData(true, "all");

      if (!selectRows || selectRows.length === 0) {
        MzAlert.alert("변경된 데이터가 없습니다.");
        return false;
      }
    }

    return true;
  };

  // 메뉴화면 맵핑 그리드 저장 콜백
  const handleMenuMappingSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      MzAlert.alert("메뉴화면 맵핑 정보가 저장되었습니다.");
      if (selectedJobGroup && selectedJobSctCd) {
        handleMenuMappingSearch(
          selectedJobGroup,
          selectedJobSctCd,
          selectedTopMenu
        );
      }
    } else {
      if (!responseObj?.message) {
        MzAlert.alert("메뉴화면 맵핑 정보 저장에 실패했습니다.");
      }
    }
  };

  // 업무그룹명 그리드 추가 후 콜백
  const handleJobGroupAddAfter = () => {
    if (jobGroupGridRef.current) {
      try {
        const grid = jobGroupGridRef.current as any;

        // 최근 추가된 행의 인덱스를 찾아서 기본값 설정
        const rowCount = grid.getRowCount();
        if (rowCount > 0) {
          const lastRowIdx = rowCount - 1;

          // 기본값 설정
          grid.setValue(lastRowIdx, "jobSctCd", query.jobSctCd || "USER");
          grid.setValue(lastRowIdx, "useYn", "Y");

          // 체크박스 체크
          grid.setValue(lastRowIdx, "check", true);
        }
      } catch (error) {
        console.error("업무그룹 추가 후 기본값 설정 중 오류:", error);
      }
    }
  };

  // 검색
  const handleSearch = async (customQuery?: Partial<Query>) => {
    setLoading(true);
    setError("");

    // 폼에 검색 조건 설정
    let form = document.querySelector("#jobGroupSearchForm") as HTMLFormElement;
    if (!form) {
      // form이 없으면 동적으로 생성
      form = document.createElement("form");
      form.id = "jobGroupSearchForm";
      form.style.display = "none";
      document.body.appendChild(form);
    }

    // 기존 필드들 제거
    form.innerHTML = "";

    // 검색 조건 필드들 생성
    const jobGrpNmInput = document.createElement("input");
    jobGrpNmInput.type = "hidden";
    jobGrpNmInput.name = "jobGrpNm";
    jobGrpNmInput.value = customQuery?.jobGrpNm || query.jobGrpNm || "";
    form.appendChild(jobGrpNmInput);

    const jobSctCdInput = document.createElement("input");
    jobSctCdInput.type = "hidden";
    jobSctCdInput.name = "jobSctCd";
    jobSctCdInput.value = customQuery?.jobSctCd || query.jobSctCd || "";
    form.appendChild(jobSctCdInput);

    const useYnInput = document.createElement("input");
    useYnInput.type = "hidden";
    useYnInput.name = "useYn";
    useYnInput.value = customQuery?.useYn || query.useYn || "";
    form.appendChild(useYnInput);

    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "";
    form.appendChild(actionInput);

    // GridBuilder로 검색 실행
    if (jobGroupGridRef.current) {
      try {
        (
          jobGroupGridRef.current as { doSearch: (args?: unknown) => void }
        ).doSearch();
      } catch (error) {
        console.error("GridBuilder doSearch 호출 중 오류:", error);
        setLoading(false);
      }
    } else {
      console.error("업무그룹명 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setQuery(initialQuery);
    setJobGroups([]);
    setMenuMappings([]);
    setError("");
    setJobGroupTotalCount(0);
    setMenuMappingTotalCount(0);
    setSelectedJobGroup("");
    setSelectedJobSctCd("");
    setSelectedJobSctCdForSearch("");
    setTopMenus([]);
    setSelectedTopMenu("");

    // 폼 초기화
    const form = document.querySelector(
      "#jobGroupSearchForm"
    ) as HTMLFormElement;
    if (form) {
      form.reset();
      // 히든 필드들도 초기화
      const jobSctCdInput = form.querySelector(
        'input[name="jobSctCd"]'
      ) as HTMLInputElement;
      const useYnInput = form.querySelector(
        'input[name="useYn"]'
      ) as HTMLInputElement;
      if (jobSctCdInput) jobSctCdInput.value = "";
      if (useYnInput) useYnInput.value = "";
    }

    // 업무그룹명 그리드 초기화
    if (jobGroupGridRef.current) {
      try {
        (
          jobGroupGridRef.current as { resetData: (data: unknown[]) => void }
        ).resetData([]);
      } catch (error) {
        console.error("업무그룹명 그리드 초기화 중 오류:", error);
      }
    }

    // 메뉴화면 맵핑 그리드 초기화
    if (menuMappingGridRef.current) {
      try {
        (
          menuMappingGridRef.current as { resetData: (data: unknown[]) => void }
        ).resetData([]);
      } catch (error) {
        console.error("메뉴화면 맵핑 그리드 초기화 중 오류:", error);
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

  // 전체선택/해제 토글 (트리 구조 고려)
  const handleToggleAllSelection = () => {
    if (!menuMappingGridRef.current) return;

    const grid = menuMappingGridRef.current as any;
    const rowCount = grid.getRowCount();

    if (rowCount <= 1) {
      MzAlert.alert("선택할 데이터가 없습니다.");
      return;
    }

    // 현재 상태 확인 후 토글
    const currentState = grid.getValue(1, "check");
    const newState = !currentState;

    // 트리 전체 선택/해제 사용
    if (typeof grid.setTreeCheckboxAll === "function") {
      grid.setTreeCheckboxAll(newState);
    } else {
      // 폴백: 일반 체크박스 처리
      for (let i = 1; i < rowCount; i++) {
        if (newState) {
          grid.check(i);
        } else {
          grid.uncheck(i);
        }

        // useYn 값 업데이트
        const newUseYn = newState ? "Y" : "N";
        grid.setValue(i, "useYn", newUseYn);

        // 원본값과 비교하여 상태 업데이트
        const orgUseYn = grid.getValue(i, "orgUseYn");
        if (newUseYn !== orgUseYn) {
          grid.setRowStatus(i, "update");
        } else {
          try {
            grid.removeRowStatus?.(i, "update");
          } catch (e) {
            // removeRowStatus가 없으면 무시
          }
        }
      }
    }
  };

  // 사용자 구분 선택 핸들러
  const handleJobSctCdSelect = (value: string) => {
    // console.log('선택된 사용자 구분:', value);
    setSelectedJobSctCdForSearch(value);
    handleQueryChange("jobSctCd", value);
  };

  // 최상위 메뉴 선택 핸들러
  const handleTopMenuSelect = (value: string) => {
    // console.log('선택된 최상위 메뉴:', value);

    // "전체" 선택 시 확인 알람
    if (value === "ALL") {
      if (
        confirm("전체 선택시 조회 속도가 느립니다. 계속 진행 하시겠습니까?")
      ) {
        setSelectedTopMenu(value);
        // 선택된 메뉴에 따라 메뉴화면 맵핑 그리드 검색
        if (selectedJobGroup && selectedJobSctCd) {
          handleMenuMappingSearch(selectedJobGroup, selectedJobSctCd, value);
        }
      }
    } else {
      setSelectedTopMenu(value);
      // 선택된 메뉴에 따라 메뉴화면 맵핑 그리드 검색
      if (selectedJobGroup && selectedJobSctCd) {
        handleMenuMappingSearch(selectedJobGroup, selectedJobSctCd, value);
      }
    }
  };

  // 메뉴 매핑 취소 핸들러 (원본 SBGrid 방식)
  const handleMenuMappingCancel = () => {
    if (!menuMappingGridRef.current) return;

    const grid = menuMappingGridRef.current as any;
    const rowCount = grid.getRowCount();

    if (rowCount <= 1) {
      MzAlert.alert("초기화할 데이터가 없습니다.");
      return;
    }

    // 원본과 동일한 메시지 표시
    MzAlert.alert("그리드 정보를 초기화합니다.");

    // exGridBuilder의 초기화 메서드 사용
    if (typeof grid.resetTreeGrid === "function") {
      const resetSuccess = grid.resetTreeGrid();
      if (resetSuccess) {
        // console.log('메뉴화면 매핑 그리드 초기화 완료');
      } else {
        console.warn("그리드 초기화 실패, 재검색으로 폴백");
        // 초기화 실패 시 재검색으로 폴백
        if (selectedJobGroup && selectedJobSctCd) {
          handleMenuMappingSearch(
            selectedJobGroup,
            selectedJobSctCd,
            selectedTopMenu
          );
        }
      }
    } else {
      // resetTreeGrid 메서드가 없는 경우 재검색으로 폴백
      console.warn("resetTreeGrid 메서드가 없음, 재검색으로 폴백");
      if (selectedJobGroup && selectedJobSctCd) {
        handleMenuMappingSearch(
          selectedJobGroup,
          selectedJobSctCd,
          selectedTopMenu
        );
      }
    }
  };

  // 메뉴 매핑 수동 저장 핸들러 (원본 SBGrid의 btn_menu_scr_mppg_save와 동일)
  const handleMenuMappingSaveManual = () => {
    if (!menuMappingGridRef.current) return;

    const grid = menuMappingGridRef.current as any;
    const rowCount = grid.getRowCount();

    if (rowCount <= 1) {
      MzAlert.alert("저장할 데이터가 없습니다.");
      return;
    }

    // 접혀있는 트리를 펼친 후 저장 처리 (원본과 동일)
    if (typeof grid.openTreeNodeAll === "function") {
      grid.openTreeNodeAll(true, () => {
        // 변경된 데이터 확인
        if (typeof grid.getUpdateData === "function") {
          const selectRows = grid.getUpdateData(true, "all");

          if (!selectRows || selectRows.length === 0) {
            MzAlert.alert("변경된 데이터가 없습니다.");
            return;
          }

          // GridBuilder의 저장 기능 호출
          if (typeof grid.saveGridData === "function") {
            grid.saveGridData();
          } else {
            // 폴백: 직접 저장 처리
            handleDirectSave();
          }
        } else {
          // GridBuilder의 저장 기능 호출
          if (typeof grid.saveGridData === "function") {
            grid.saveGridData();
          } else {
            handleDirectSave();
          }
        }
      });
    } else {
      // GridBuilder의 저장 기능 호출
      if (typeof grid.saveGridData === "function") {
        grid.saveGridData();
      } else {
        handleDirectSave();
      }
    }
  };

  // 직접 저장 처리 (GridBuilder의 saveGridData가 없는 경우)
  const handleDirectSave = async () => {
    if (!menuMappingGridRef.current) return;

    const grid = menuMappingGridRef.current as any;

    try {
      setLoading(true);

      // 변경된 데이터 수집
      const updateData: any[] = [];
      const rowCount = grid.getRowCount();

      for (let i = 1; i < rowCount; i++) {
        try {
          const newUseYn = grid.getValue?.(i, "useYn");
          const orgUseYn = grid.getValue?.(i, "orgUseYn");

          if (newUseYn !== orgUseYn) {
            const rowData = grid.getRow?.(i);
            if (rowData) {
              updateData.push({
                ...rowData,
                useYn: newUseYn,
                status: "u",
              });
            }
          }
        } catch (error) {
          console.warn(`Row ${i} data collection failed:`, error);
        }
      }

      if (updateData.length === 0) {
        MzAlert.alert("변경된 데이터가 없습니다.");
        return;
      }

      // 저장 요청
      const data = {
        menuMappingGrid: updateData,
      };

      const response = await fetch(
        "/system/userMgmt.putStJobGrpRtInfoList.do",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.succeeded) {
        MzAlert.alert("메뉴화면 맵핑 정보가 저장되었습니다.");
        // 저장 후 재검색
        if (selectedJobGroup && selectedJobSctCd) {
          handleMenuMappingSearch(
            selectedJobGroup,
            selectedJobSctCd,
            selectedTopMenu
          );
        }
      } else {
        MzAlert.alert(result.message || "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 중 오류:", error);
      MzAlert.alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    // COM138 사용자 구분 코드 데이터 로드
    fetchJobSctCdOptions();
    // 최상위 메뉴 목록 로드
    fetchTopMenus();

    // 업무그룹 검색용 폼 생성
    let jobGroupForm = document.querySelector(
      "#jobGroupSearchForm"
    ) as HTMLFormElement;
    if (!jobGroupForm) {
      jobGroupForm = document.createElement("form");
      jobGroupForm.id = "jobGroupSearchForm";
      jobGroupForm.style.display = "none";
      document.body.appendChild(jobGroupForm);
    }

    // 메뉴화면 맵핑 검색용 별도 폼 생성
    let menuMappingForm = document.querySelector(
      "#menuMappingSearchForm"
    ) as HTMLFormElement;
    if (!menuMappingForm) {
      menuMappingForm = document.createElement("form");
      menuMappingForm.id = "menuMappingSearchForm";
      menuMappingForm.style.display = "none";
      document.body.appendChild(menuMappingForm);
    }
  }, []);

  // useEffect 제거 - 중복 호출 방지

  // jobSctCdOptions가 변경될 때 그리드 컬럼 옵션 업데이트
  useEffect(() => {
    if (jobGroupGridRef.current && jobSctCdOptions.length > 0) {
      const gridInstance = jobGroupGridRef.current as any;
      const columnIndex = 2; // 사용자 구분 컬럼 인덱스 (0-based)

      if (gridInstance.setColumnOptions) {
        gridInstance.setColumnOptions(columnIndex, {
          editor: {
            type: "select",
            options: {
              listItems: jobSctCdOptions,
            },
          },
        });
      }
    }
  }, [jobSctCdOptions]);

  // topMenus가 변경될 때 메뉴화면 맵핑 조회 실행
  useEffect(() => {
    if (selectedJobGroup && selectedJobSctCd && selectedTopMenu) {
      console.log("useEffect에서 메뉴화면 맵핑 조회:", {
        selectedJobGroup,
        selectedJobSctCd,
        selectedTopMenu,
      });
      handleMenuMappingSearch(
        selectedJobGroup,
        selectedJobSctCd,
        selectedTopMenu
      );
    }
  }, [selectedJobGroup, selectedJobSctCd, selectedTopMenu]);

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="업무그룹별메뉴관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />

        {/* 검색 폼 */}
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
                <th>업무 그룹명</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    id="search-jobGrpNm"
                    name="jobGrpNm"
                    value={query.jobGrpNm}
                    onChange={(e) =>
                      handleQueryChange("jobGrpNm", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    placeholder="업무 그룹명을 입력해주세요."
                    style={{ width: "180px" }}
                  />
                </td>
                <th>사용자 구분</th>
                <td>
                  <MzCommonCodeSelect
                    storageKey="job-section-codes"
                    grpCd="COM138"
                    selected={selectedJobSctCdForSearch}
                    onSelect={handleJobSctCdSelect}
                    size="2"
                  />
                </td>
              </tr>
              <tr>
                <th>사용 여부</th>
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
                <th></th>
                <td></td>
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
        <div
          className={`${styles["group-menu-mgt-main"]} ${styles["mgmt-main-layout"]}`}
        >
          {/* 좌측: 업무그룹명 그리드 */}
          <div className={styles["mgmt-left-section"]}>
            <div className={styles["mgmt-title-control"]}>
              <AdminTitle
                title="업무그룹명"
                subTitle={
                  jobGroupTotalCount > 0
                    ? `(총 ${jobGroupTotalCount}건)`
                    : undefined
                }
              />
            </div>

            <GridBuilder
              gridId="jobGroupGrid"
              config={jobGroupGridConfig}
              resizable={true}
              onInit={handleJobGroupGridInit}
              onSearchCallback={handleJobGroupSearch}
              onSaveCallback={handleJobGroupSave}
              onSaveBeforeCallback={handleJobGroupSaveBefore}
              onAddAfterCallback={handleJobGroupAddAfter}
            />
          </div>

          {/* 우측: 메뉴화면 맵핑 그리드 */}
          <div className={styles["mgmt-right-section"]}>
            <div className={styles["mgmt-title-control"]}>
              <AdminTitle
                title="메뉴화면 맵핑"
                subTitle={
                  menuMappingTotalCount > 0
                    ? `(총 ${menuMappingTotalCount}건)`
                    : undefined
                }
              />
              <MzSelectBox
                size="2"
                type="dropdown"
                className="dropdown"
                options={[...topMenus.map((menu) => menu.rtTgtNm), "전체"]}
                selected={
                  selectedTopMenu === "ALL"
                    ? "전체"
                    : selectedTopMenu
                      ? topMenus.find(
                          (menu) => menu.ancestorid === selectedTopMenu
                        )?.rtTgtNm || "대시보드"
                      : "대시보드"
                }
                style={{ width: "160px" }}
                onSelect={(v) => {
                  const selected = typeof v === "string" ? v : v[0];
                  if (selected === "전체") {
                    handleTopMenuSelect("ALL");
                  } else {
                    const selectedMenu = topMenus.find(
                      (menu) => menu.rtTgtNm === selected
                    );
                    if (selectedMenu) {
                      handleTopMenuSelect(selectedMenu.ancestorid);
                    }
                  }
                }}
              />
            </div>

            <GridBuilder
              gridId="menuMappingGrid"
              config={menuMappingGridConfig}
              resizable={true}
              onInit={handleMenuMappingGridInit}
              onSearchCallback={handleMenuMappingSearchCallback}
              onSaveCallback={handleMenuMappingSave}
              onSaveBeforeCallback={handleMenuMappingSaveBeforeWithTree}
              onTreeCancelCallback={handleMenuMappingCancel}
              onTreeSelectAllCallback={handleToggleAllSelection}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupMenuManagement;
