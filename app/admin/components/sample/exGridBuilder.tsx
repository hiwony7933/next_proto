"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import type Grid from "tui-grid";
import "tui-grid/dist/tui-grid.css";
import axios from "axios";
import MzBtnResize from "../../components/common/mzBtnResize";
import "./exGridBuilder.scss";

// CheckboxRenderer 클래스 정의
export class CheckboxRenderer {
  el: HTMLElement;

  constructor(props: any) {
    const { grid, rowKey } = props;
    const gridId = grid.id;

    const label = document.createElement("label");
    label.className = "checkbox tui-grid-row-header-checkbox";
    label.setAttribute("for", `checkbox-${gridId}-${rowKey}`);

    const hiddenInput = document.createElement("input");
    hiddenInput.className = "hidden-input";
    hiddenInput.id = `checkbox-${gridId}-${rowKey}`;

    const customInput = document.createElement("span");
    customInput.className = "custom-input";

    label.appendChild(hiddenInput);
    label.appendChild(customInput);

    hiddenInput.type = "checkbox";
    label.addEventListener("click", (ev) => {
      ev.preventDefault();

      if ((ev as any).shiftKey) {
        grid[!hiddenInput.checked ? "checkBetween" : "uncheckBetween"](rowKey);
        return;
      }

      grid[!hiddenInput.checked ? "check" : "uncheck"](rowKey);
    });

    this.el = label;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props: any) {
    const hiddenInput = this.el.querySelector(
      ".hidden-input"
    ) as HTMLInputElement;
    const checked = Boolean(props.value);
    if (hiddenInput) {
      hiddenInput.checked = checked;
    }
  }
}

// DateUtil 구현
export const DateUtil = {
  getDateObject: (value: any) => {
    if (!value) return { format: () => "" };
    const date = new Date(value);
    return {
      format: (pattern: string) => {
        if (pattern === "yyyy-MM-dd HH:mm:ss") {
          return date.toISOString().slice(0, 19).replace("T", " ");
        }
        return date.toLocaleString("ko-KR");
      },
    };
  },
};

// Types
interface GridConfig {
  id: string;
  el?: HTMLElement;
  columns: any[];
  data?: any[];
  header?: {
    height?: number;
    complexColumns?: any[];
  };
  rowHeaders?: any[];
  bodyHeight?: number;
  columnOptions?: any;
  scrollX?: boolean;
  scrollY?: boolean;
  useClientSort?: boolean;
  editingEvent?: string;
  minRowHeight?: number;
  summary?: any;
  rowHeight?: number;
  action?: string;
  saveAction?: string;
  excelAction?: string;
  form?: string;
  rowBtnType?: {
    rowAdd?: boolean;
    rowDel?: boolean;
    rowUpdate?: boolean;
    rowExcelAll?: boolean;
    excelFileName?: string;
    rowRegPop?: {
      action?: string;
      winname?: string;
      width?: number;
      height?: number;
    };
    // 트리 그리드 전용 버튼들
    treeSelectAll?: boolean; // 트리 전체선택 버튼
    treeCancel?: boolean; // 트리 취소 버튼
  };
  toolbar?: {
    items?: any[];
  };
  pagingable?: boolean;
  rows?: number[];
  rowsPerPage?: number;
  keywordSearch?: boolean;
  columnAlign?: string;
  columnValign?: string;
  requiredColumns?: any[];
  height?: number;
  saveAfterSearch?: boolean;
  saveAfterCallback?: boolean;
  saveAfterSearchCallback?: boolean;
  actionAfterCallback?: boolean;
  onAddAfterCallback?: boolean;
  deleteBeforeCallback?: boolean;
  saveBeforeCallback?: boolean;
  prevKeyword?: string | null;
  isMax?: boolean;
  resizable?: boolean; // 리사이즈 기능 사용 여부
  resizeOptions?: {
    showButton?: boolean; // 리사이즈 버튼 표시 여부
    minHeight?: number; // 최소 높이
    maxHeight?: number; // 최대 높이
    step?: number; // 리사이즈 단위
  };
  // 트리 그리드 설정 추가
  tree?: {
    col?: number; // 트리 컬럼 인덱스
    levelref?: string; // 레벨 참조 필드명
    open?: boolean; // 기본 펼침 상태
    lock?: boolean; // 트리 잠금
    checkbox?: boolean; // 체크박스 사용 여부
    checked?: boolean; // 기본 체크 상태
    iconclickeventignore?: boolean; // 아이콘 클릭 이벤트 무시
  };
  enableNewRowAsCreate?: boolean; // 신규행 추가 시 createList로 분류되도록 하는 설정
}

interface GridBuilderProps {
  gridId: string;
  config: GridConfig;
  resizable?: boolean;
  onInit?: (grid: Grid) => void;
  onSearchCallback?: (response: any) => void;
  onSaveCallback?: (response: any) => void;
  onRegPopCallback?: () => void;
  onAddAfterCallback?: () => void;
  onDeleteBeforeCallback?: () => boolean;
  onSaveBeforeCallback?: () => boolean;
  // 트리 그리드 전용 콜백들
  onTreeSelectAllCallback?: () => void; // 트리 전체선택 콜백
  onTreeCancelCallback?: () => void; // 트리 취소 콜백
}

interface GridBuilderRef {
  getGrid: () => Grid | null;
  addRow: () => void;
  deleteSelectedRows: () => void;
  saveGridData: () => void;
  searchGridData: () => void;
  doSearch: () => void;
  setHeight: (height: number) => void;
}

const GridBuilder = forwardRef<GridBuilderRef, GridBuilderProps>(
  (
    {
      gridId,
      config,
      resizable,
      onInit,
      onSearchCallback,
      onSaveCallback,
      onRegPopCallback,
      onAddAfterCallback,
      onDeleteBeforeCallback,
      onSaveBeforeCallback,
      onTreeSelectAllCallback,
      onTreeCancelCallback,
    },
    ref
  ) => {
    const gridRef = useRef<Grid | null>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const configRef = useRef<GridConfig>(config);
    const [isLoading, setIsLoading] = useState(false);
    const [currentGridHeight, setCurrentGridHeight] = useState(
      configRef.current.height || configRef.current.bodyHeight || 400
    );
    const gridDataRef = useRef<Record<string | number, any>>({});
    const isMouseDownRef = useRef(false);
    const isInitializingRef = useRef(false);
    const documentClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(
      null
    );
    const editingCellRef = useRef<{
      rowKey: number;
      columnName: string;
    } | null>(null);

    // Constants
    const _INT_TIME_OUT = 30000;
    const _MSG_EMPTY_GRID =
      "The grid id or event listener object does not exist.";
    const _MSG_EMPTY_GRID_ACTION =
      "Request URL is missing from Config. [action]";
    const _MSG_EMPTY_GRID_FORM = "Form is missing from Config. [form]";

    // 기본 설정
    const defaultConfig: GridConfig = {
      scrollX: true,
      scrollY: true,
      bodyHeight: 400,
      rowHeaders: ["rowNum"],
      minRowHeight: 40,
      columnOptions: {
        resizable: true,
        frozenCount: 0,
        frozenBorderWidth: 2,
      },
      summary: {
        height: 40,
        position: "bottom",
        columnContent: {},
      },
      useClientSort: false,
      editingEvent: "dblclick",
      rowHeight: 40,
      header: {
        height: 40,
        complexColumns: [],
      },
      keywordSearch: true,
      prevKeyword: null,
      isMax: false,
      resizable:
        resizable !== undefined ? resizable : config.resizable || false,
      resizeOptions: {
        showButton: true,
        minHeight: 200,
        maxHeight: 800,
        step: 5,
        ...config.resizeOptions,
      },
      ...config,
    };

    // Initialize grid
    useEffect(() => {
      if (!gridContainerRef.current || isInitializingRef.current) return;

      isInitializingRef.current = true;

      // Destroy existing grid
      if (gridRef.current) {
        gridRef.current.destroy();
        gridRef.current = null;
      }

      // Clear existing toolbar
      const existingToolbar = document.getElementById(`SBHE_CPA_${gridId}`);
      if (existingToolbar) {
        existingToolbar.remove();
      }

      // Validate required config
      if (!config.columns || config.columns.length === 0) {
        console.error("Missing required config properties");
        return;
      }

      // 깊은 복사로 config 보호 및 초기화 (함수는 보존)
      const deepCopyConfig = {
        ...config,
        columns: config.columns.map((column) => ({ ...column })), // 컬럼 배열 복사하되 함수는 보존
        data: config.data ? [...config.data] : undefined,
      };

      // Update config ref
      configRef.current = { ...defaultConfig, ...deepCopyConfig };

      // Initialize components in order
      initRowHeader();

      // Create grid
      const gridOptions: any = {
        el: gridContainerRef.current,
        data: configRef.current.data || [],
        columns: configRef.current.columns || [],
        rowHeaders: configRef.current.rowHeaders || ["rowNum"],
        columnOptions: configRef.current.columnOptions || {},
        scrollX: configRef.current.scrollX !== false,
        scrollY: configRef.current.scrollY !== false,
        bodyHeight: configRef.current.bodyHeight || 400,
        rowHeight: configRef.current.rowHeight || 40,
        minRowHeight: configRef.current.minRowHeight || 40,
        header: configRef.current.header || {},
        summary: configRef.current.summary,
        useClientSort: configRef.current.useClientSort !== false,
        editingEvent: "none", // 자동 편집 모드 비활성화
        // TUI Grid 내장 페이징 비활성화
        pagination: false,
      };

      // 트리 그리드 설정 추가
      if (configRef.current.tree) {
        const treeConfig = configRef.current.tree;
        gridOptions.treeColumnOptions = {
          name: configRef.current.columns[treeConfig.col || 0]?.name,
          useIcon: true,
        };

        // 트리 관련 추가 옵션 - 체크박스 중복 방지
        if (treeConfig.checkbox) {
          // 기존 rowHeaders에서 checkbox 타입 제거
          gridOptions.rowHeaders = gridOptions.rowHeaders.filter(
            (header: any) =>
              !(typeof header === "object" && header.type === "checkbox") &&
              header !== "checkbox"
          );
          // 체크박스를 맨 앞에 추가
          gridOptions.rowHeaders.unshift("checkbox");
        }
      }

      // DOM이 완전히 렌더링된 후 TUI Grid 생성
      setTimeout(() => {
        (async () => {
          if (gridContainerRef.current && !gridRef.current) {
            const GridModule = (await import("tui-grid")).default;
            const grid = new GridModule(gridOptions);
            gridRef.current = grid;

            // 그리드 인스턴스를 DOM 요소에 저장 (외부에서 접근 가능하도록)
            (gridContainerRef.current as any).__grid__ = grid;

            // 편집 중인 셀 상태 추적을 위한 ref 연결
            (grid as any).editingCellRef = editingCellRef;

            // TUI Grid 초기화 완료 후 이벤트 바인딩을 지연시켜 dispatch 오류 방지
            setTimeout(() => {
              if (gridRef.current) {
                initConfig();
                initToolbar();
                // 툴바 우측 영역 초기화 순서 조정 - 순서대로 배치
                initExcelAll();
                initKeywordSearch();
                initPaging();
                initButton();
                bindSearch();
                setGridHeight();
                complexColumnsDrag();
                initTreeGrid(); // 트리 그리드 초기화

                // Call onInit callback
                if (onInit && gridRef.current) {
                  onInit(gridRef.current);
                }

                // 초기화 완료
                isInitializingRef.current = false;
              }
            }, 0);
          } else {
            isInitializingRef.current = false;
          }
        })();
      }, 0);

      return () => {
        isInitializingRef.current = false;
        if (gridRef.current) {
          gridRef.current.destroy();
          gridRef.current = null;
        }

        // 이벤트 리스너 정리
        if (documentClickHandlerRef.current) {
          document.removeEventListener(
            "click",
            documentClickHandlerRef.current
          );
          documentClickHandlerRef.current = null;
        }
      };
    }, [gridId]); // config 제거하여 무한 루프 방지

    // Config 변경 시 그리드 데이터 업데이트
    useEffect(() => {
      if (gridRef.current && config.data) {
        gridRef.current.resetData(config.data);
        // gridDataRef에 초기 데이터 저장 (rowKey를 키로 사용)
        gridDataRef.current = {};
        config.data.forEach((item: any, index: number) => {
          // const rowKey = item.rowKey || item.id || index;
          const rowKey =
            item.rowKey !== undefined && item.rowKey !== null
              ? item.rowKey
              : item.id !== undefined && item.id !== null
                ? item.id
                : index;
          gridDataRef.current[rowKey] = item;
        });

        // 트리 그리드인 경우 체크박스 상태 설정
        if (configRef.current.tree?.checkbox) {
          setTimeout(() => {
            setTreeCheckboxStates();
          }, 100);
        }
      }
    }, [config.data]);

    // Initialize row header
    const initRowHeader = () => {
      const gridConfig = configRef.current;

      // Custom checkbox header - TUI Grid 기본 체크박스 사용
      if (gridConfig.rowHeaders) {
        gridConfig.rowHeaders.forEach((rowHeader) => {
          if (rowHeader.type === "checkbox") {
            // TUI Grid 기본 체크박스 사용 - 추가 설정 불필요
            // 필요시 헤더 텍스트만 설정
            if (!rowHeader.header) {
              rowHeader.header = "";
            }
          }
        });
      }

      // Custom column processing
      if (!gridConfig.requiredColumns) {
        gridConfig.requiredColumns = [];
      }

      // requiredColumns 배열 초기화 (중복 방지)
      gridConfig.requiredColumns = [];

      gridConfig.columns.forEach((column) => {
        if (!column.align || column.align === null) {
          column.align = gridConfig.columnAlign || "left";
        }
        if (!column.valign || column.valign === null) {
          column.valign = gridConfig.columnValign || "middle";
        }

        if (column.required && gridConfig.requiredColumns) {
          // 원본 헤더에서 * 제거 후 다시 추가 (중복 방지)
          const originalHeader = column.header.replace(/^\*/, "");
          const requiredColumn = {
            header: originalHeader,
            name: column.name,
          };
          column.header = `*${originalHeader}`;
          gridConfig.requiredColumns.push(requiredColumn);
        }

        if (column.ellipsis && !column.renderer) {
          column.renderer = {
            attributes: {
              title: (props: any) => {
                return `${props.formattedValue}`;
              },
            },
          };
        }
      });

      // Reverse required columns for proper validation order
      if (gridConfig.requiredColumns) {
        gridConfig.requiredColumns.reverse();
      }
    };

    // Initialize config
    const initConfig = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;

      // 수동 편집 모드 제어를 위한 이벤트 핸들러 추가

      // 클릭 이벤트 처리 - 편집 가능한 셀에서 클릭 시 아무 동작도 하지 않음
      grid.on("mousedown", (ev: any) => {
        try {
          const { rowKey, columnName } = ev;
          if (rowKey !== undefined && rowKey !== null && columnName) {
            const column = configRef.current.columns.find(
              (col: any) => col.name === columnName
            );

            // 편집 가능한 셀에서는 클릭 이벤트 무시
            if (column && column.editable === true) {
              return false;
            }
          }
        } catch (error) {
          console.warn("mousedown 이벤트 처리 중 오류:", error);
        }
      });

      // click 이벤트 처리 - 편집 가능한 셀에서 클릭 시 아무 동작도 하지 않음
      grid.on("click", (ev: any) => {
        try {
          const { rowKey, columnName } = ev;
          if (rowKey !== undefined && rowKey !== null && columnName) {
            const column = configRef.current.columns.find(
              (col: any) => col.name === columnName
            );

            // 편집 가능한 셀에서는 클릭 이벤트 무시
            if (column && column.editable === true) {
              return false;
            }
          }
        } catch (error) {
          console.warn("click 이벤트 처리 중 오류:", error);
        }
      });

      // 더블클릭 이벤트만 편집 모드 활성화
      grid.on("dblclick", (ev: any) => {
        try {
          const { rowKey, columnName } = ev;
          if (rowKey !== undefined && rowKey !== null && columnName) {
            const column = configRef.current.columns.find(
              (col: any) => col.name === columnName
            );

            // 편집 가능한 셀에서만 편집 모드 활성화
            if (
              column &&
              (column.editable === true || column.editable === "new")
            ) {
              try {
                // 현재 편집 중인 셀이 있다면 먼저 종료
                if (
                  editingCellRef.current &&
                  typeof (grid as any).finishEditing === "function"
                ) {
                  (grid as any).finishEditing();
                }

                // 새로운 셀 편집 모드 시작
                setTimeout(() => {
                  try {
                    if (typeof (grid as any).startEditing === "function") {
                      (grid as any).startEditing(rowKey, columnName);
                      // 편집 중인 셀 정보 저장
                      editingCellRef.current = { rowKey, columnName };
                    }
                  } catch (error) {
                    console.warn("편집 모드 시작 중 오류:", error);
                  }
                }, 0);
              } catch (error) {
                console.warn("편집 모드 처리 중 오류:", error);
              }
            }
          }
        } catch (error) {
          console.warn("dblclick 이벤트 처리 중 오류:", error);
        }
      });

      // 그리드 영역 외부 클릭 시 편집 모드 종료
      documentClickHandlerRef.current = (e: MouseEvent) => {
        if (
          gridRef.current &&
          !gridContainerRef.current?.contains(e.target as Node)
        ) {
          try {
            if (typeof (gridRef.current as any).finishEditing === "function") {
              (gridRef.current as any).finishEditing();
              // 편집 중인 셀 상태 초기화
              editingCellRef.current = null;
            }
          } catch (error) {
            console.warn("편집 모드 종료 중 오류:", error);
            // 오류가 발생해도 편집 상태는 초기화
            editingCellRef.current = null;
          }
        }
      };
      document.addEventListener("click", documentClickHandlerRef.current);

      // After change handler - 편집된 셀 시각적 피드백
      grid.on("afterChange", (ev: any) => {
        const { changes } = ev;
        if (!changes || !Array.isArray(changes)) return;

        changes.forEach((change: any) => {
          const { rowKey, columnName } = change;
          if (rowKey === undefined || rowKey === null || !columnName) return;

          // 체크박스가 있고 rowUpdate가 true인 그리드인 경우에만 자동 체크 처리
          const hasCheckbox = configRef.current.rowHeaders?.some(
            (header: any) =>
              header === "checkbox" ||
              (typeof header === "object" && header.type === "checkbox")
          );
          const hasRowUpdate = configRef.current.rowBtnType?.rowUpdate === true;

          if (hasCheckbox && hasRowUpdate && change.value != change.prevValue) {
            try {
              // 현재 행이 체크되어 있는지 확인
              const checkedRows = grid.getCheckedRows();
              const isChecked = checkedRows.some(
                (checkedRow: any) => checkedRow.rowKey === rowKey
              );

              // 체크되어 있지 않은 경우에만 자동 체크
              if (!isChecked) {
                grid.check(rowKey);
              }
            } catch (error) {
              console.warn("체크박스 자동 체크 중 오류:", error);
            }
          }

          // 셀 하이라이트 효과 적용
          try {
            // TUI Grid의 getCellElement 메서드 사용
            const element = (grid as any).getCellElement?.(rowKey, columnName);
            if (element) {
              const cellContent =
                element.querySelector(".tui-grid-cell-content") ||
                element.querySelector("div") ||
                element;

              if (cellContent) {
                // 기존 스타일 백업
                const originalBackground = cellContent.style.backgroundColor;

                // 하이라이트 적용
                cellContent.style.backgroundColor = "#fff3cd";
                cellContent.style.transition = "background-color 0.3s ease";

                // 1초 후 원래 색상으로 복원
                setTimeout(() => {
                  if (cellContent) {
                    cellContent.style.backgroundColor = originalBackground;
                    // 트랜지션 제거
                    setTimeout(() => {
                      if (cellContent) {
                        cellContent.style.transition = "";
                      }
                    }, 300);
                  }
                }, 1000);
              }
            }
          } catch (error) {
            // getCellElement 메서드가 없거나 오류가 발생한 경우 무시
            console.warn("셀 하이라이트 적용 중 오류:", error);
          }
        });
      });

      refreshConfig();
    };

    // Refresh config
    const refreshConfig = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;

      // editable 컬럼 처리만 수행 - 툴바 재생성 방지
      configRef.current.columns.forEach((column) => {
        if (column.editable === "new") {
          // 새 행에서만 편집 가능한 컬럼은 기존 행에서는 비활성화
          grid.getData().forEach((data) => {
            // 신규 추가된 행이 아닌 기존 행에서만 비활성화
            // rowKey가 음수이거나 status가 'i'인 경우를 신규 행으로 판단
            const isNewRow =
              data.status === "i" ||
              (typeof data.rowKey === "number" && data.rowKey < 0) ||
              Boolean(data.tempRowKey);
            if (!isNewRow) {
              if (typeof (grid as any).disableCell === "function") {
                (grid as any).disableCell(data.rowKey, column.name);
              }
            }
          });
        }
      });
    };

    // Initialize toolbar
    const initToolbar = () => {
      if (!gridContainerRef.current) return;

      // toolbar, rowBtnType, keywordSearch, pagingable, rowExcelAll 중 하나라도 있으면 toolbar 생성
      const hasToolbarItems = configRef.current.toolbar;
      const hasRowBtnType = configRef.current.rowBtnType;
      const hasKeywordSearch = configRef.current.keywordSearch;
      const hasPaging = configRef.current.pagingable;
      const hasExcelAll = configRef.current.rowBtnType?.rowExcelAll;

      if (
        !hasToolbarItems &&
        !hasRowBtnType &&
        !hasKeywordSearch &&
        !hasPaging &&
        !hasExcelAll
      )
        return;

      const toolbarContainer = document.createElement("div");
      toolbarContainer.id = `SBHE_CPA_${gridId}`;
      toolbarContainer.className = "sbgrid_CPA sbgrid_CPA_st sbgrid_common";
      toolbarContainer.style.display = "block";

      const toolbarDiv = document.createElement("div");
      toolbarDiv.className = "sbgrid-toolbar";

      const rightDiv = document.createElement("div");
      rightDiv.className = "sbgrid_CPI sbgrid_CPI_st";
      rightDiv.style.float = "right";

      toolbarContainer.appendChild(toolbarDiv);
      toolbarContainer.appendChild(rightDiv);

      gridContainerRef.current.insertBefore(
        toolbarContainer,
        gridContainerRef.current.firstChild
      );

      // Process toolbar items
      if (configRef.current.toolbar && configRef.current.toolbar.items) {
        configRef.current.toolbar.items.forEach((item) => {
          const button = document.createElement("button");
          button.textContent = item.text || "";
          button.className = item.className || "btn";

          let handler = item.handler;
          if (!handler) {
            switch (item.type) {
              case "search":
                handler = searchGridData;
                break;
              case "add":
                handler = addRow;
                break;
              case "delete":
                handler = deleteSelectedRows;
                break;
              case "save":
                handler = saveGridData;
                break;
              case "excel":
                handler = downloadExcel;
                break;
              default:
                handler = () => {};
            }
          }

          button.addEventListener("click", handler);
          toolbarDiv.appendChild(button);
        });
      }

      // Add total count display
      const totalCountSpan = document.createElement("span");
      totalCountSpan.id = `${gridId}-totalcount`;
      totalCountSpan.textContent = "(Rows: 0)";
      rightDiv.appendChild(totalCountSpan);
    };

    // Initialize Excel download
    const initExcelAll = () => {
      if (
        !configRef.current.rowBtnType?.rowExcelAll ||
        !gridContainerRef.current
      ) {
        return;
      }

      const targetGridId = configRef.current.id;
      const gridRightObj =
        gridContainerRef.current.querySelector(".sbgrid_CPI");
      if (!gridRightObj) return;

      // 기존 엑셀 컨테이너가 있으면 재생성하지 않음
      const existingExcelContainer = document.getElementById(
        `${gridId}-excel-container`
      );
      if (existingExcelContainer) return;

      const excelFileName = configRef.current.rowBtnType.excelFileName;

      // 엑셀 버튼을 원본과 동일한 스타일로 생성
      const excelContainer = document.createElement("span");
      excelContainer.id = `${gridId}-excel-container`;

      const excelButton = document.createElement("a");
      excelButton.className = "btn_black uncheck";
      excelButton.id = `btn_${targetGridId}_row_excel_all`;
      excelButton.innerHTML = "Excel All";

      excelContainer.appendChild(excelButton);
      // 엑셀 버튼을 첫 번째 위치에 배치
      gridRightObj.appendChild(excelContainer);

      excelButton.addEventListener("click", () => {
        // 조회된 데이터가 있을 경우만 동작
        const cnt = (gridRef.current as any)?.getRowCount?.() || 0;
        if (cnt <= 0) {
          alert("No data to export.");
          return;
        }

        downloadExcel();
      });
    };

    // 키워드 검색 초기화
    const initKeywordSearch = useCallback(() => {
      if (!configRef.current.keywordSearch || !gridContainerRef.current) {
        return;
      }

      const targetGridId = configRef.current.id;
      const gridRightObj =
        gridContainerRef.current.querySelector(".sbgrid_CPI");

      if (!gridRightObj) {
        return;
      }

      // 기존 검색바가 있으면 재생성하지 않음
      const existingKeywordContainer = document.getElementById(
        `${gridId}-keyword-container`
      );
      if (existingKeywordContainer) return;

      // keyword tag - 원본과 동일한 스타일로 수정
      const keywordContainer = document.createElement("span");
      keywordContainer.id = `${gridId}-keyword-container`;

      const keywordInput = document.createElement("input");
      keywordInput.type = "text";
      keywordInput.id = `${targetGridId}-keywordSearch`;
      keywordInput.className = "grid-keywordElement";
      keywordInput.placeholder = "검색어를 입력하세요.";

      keywordContainer.appendChild(keywordInput);
      // 검색바를 두 번째 위치에 배치
      gridRightObj.appendChild(keywordContainer);

      if (!keywordInput) return;

      keywordInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const keyword = keywordInput.value.trim();

          if (configRef.current.prevKeyword !== keyword) {
            configRef.current.prevKeyword = keyword;
            // TUI Grid의 blur 메소드 대신 focus 해제
            try {
              if (
                gridRef.current &&
                typeof (gridRef.current as any).blur === "function"
              ) {
                (gridRef.current as any).blur();
              }
            } catch (e) {
              // blur 메소드가 없을 경우 무시
            }
          }

          let minRowKey = 0;
          let minColumnName: string | null = null;
          let maxRowKey = 0;
          let maxColumnIdx = -1;

          if (
            keyword &&
            gridRef.current &&
            (gridRef.current as any).getRowCount?.() > 0
          ) {
            let minCheck = true;
            const gridData = gridRef.current.getData();

            gridData.forEach((data: any) => {
              configRef.current.columns.forEach((column: any) => {
                const value = String(data[column.name] || "");
                if (value.indexOf(keyword) !== -1) {
                  if (minCheck) {
                    minRowKey = data.rowKey;
                    minColumnName = column.name;
                    minCheck = false;
                  }

                  maxRowKey = data.rowKey;
                  maxColumnIdx = configRef.current.columns.findIndex(
                    (col: any) => col.name === column.name
                  );
                }
              });
            });

            let isFind = false;
            gridData.forEach((data: any) => {
              if (isFind) return;

              configRef.current.columns.forEach((column: any) => {
                if (isFind) return;

                const value = String(data[column.name] || "");
                if (value.indexOf(keyword) !== -1) {
                  const focusedCell = (
                    gridRef.current as any
                  )?.getFocusedCell?.();
                  let rowKey = focusedCell?.rowKey || 0;
                  let columnIdx = focusedCell?.columnName
                    ? configRef.current.columns.findIndex(
                        (col: any) => col.name === focusedCell.columnName
                      )
                    : -1;

                  const currRowKey = data.rowKey;
                  const currColumnName = column.name;
                  const currColumnIdx = configRef.current.columns.findIndex(
                    (col: any) => col.name === column.name
                  );

                  if (configRef.current.isMax) {
                    if (
                      gridRef.current &&
                      typeof (gridRef.current as any).focus === "function"
                    ) {
                      (gridRef.current as any).focus(
                        minRowKey,
                        minColumnName,
                        true
                      );
                    }
                    isFind = true;
                    configRef.current.isMax = false;
                  }

                  if (
                    (rowKey === currRowKey && columnIdx >= currColumnIdx) ||
                    rowKey > currRowKey
                  ) {
                    return;
                  }

                  if (
                    maxRowKey === currRowKey &&
                    maxColumnIdx === currColumnIdx
                  ) {
                    configRef.current.isMax = true;
                  }

                  if (
                    gridRef.current &&
                    typeof (gridRef.current as any).focus === "function"
                  ) {
                    (gridRef.current as any).focus(
                      currRowKey,
                      currColumnName,
                      true
                    );
                  }
                  isFind = true;
                }
              });
            });
          }

          setTimeout(() => {
            keywordInput.focus();
          }, 10);
        }
      });
    }, []);

    useEffect(() => {
      if (gridRef.current) {
        initKeywordSearch();
      }
    }, [gridRef.current, initKeywordSearch]);

    // Initialize paging
    const initPaging = () => {
      if (!configRef.current.pagingable || !gridContainerRef.current) return;

      const rightDiv = gridContainerRef.current.querySelector(".sbgrid_CPI");
      if (!rightDiv) return;

      // 기존 페이징 요소들이 있으면 재생성하지 않음
      const existingPageIdxContainer = document.getElementById(
        `${gridId}-pageIdx-container`
      );
      const existingRowsPerPageContainer = document.getElementById(
        `${gridId}-rowsPerPage-container`
      );
      if (existingPageIdxContainer && existingRowsPerPageContainer) return;

      // Page index select (먼저 생성) - 셀렉트박스만 i 태그로 작성 필요
      const pageIdxContainer = document.createElement("i");
      pageIdxContainer.id = `${gridId}-pageIdx-container`;
      const pageIdxSelect = document.createElement("select");
      pageIdxSelect.id = `${gridId}-select-page`;
      pageIdxSelect.className = `${gridId}-pageElement grid-pageElement`;

      const defaultOption = document.createElement("option");
      defaultOption.value = "0";
      defaultOption.textContent = "0";
      defaultOption.selected = true;
      pageIdxSelect.appendChild(defaultOption);

      pageIdxContainer.appendChild(pageIdxSelect);
      // 페이지 번호를 세 번째 위치에 배치
      rightDiv.appendChild(pageIdxContainer);

      // Rows per page select (나중에 생성) - 셀렉트박스만 i 태그로 작성 필요
      const rowsPerPageContainer = document.createElement("i");
      rowsPerPageContainer.id = `${gridId}-rowsPerPage-container`;
      const rowsPerPageSelect = document.createElement("select");
      rowsPerPageSelect.id = `${gridId}-select-rowsPerPage`;
      rowsPerPageSelect.className = `${gridId}-pageElement grid-pageElement`;

      if (configRef.current.rows) {
        configRef.current.rows.forEach((val) => {
          const option = document.createElement("option");
          option.value = val.toString();
          option.textContent = val.toString();
          if (configRef.current.rowsPerPage === val) {
            option.selected = true;
          }
          rowsPerPageSelect.appendChild(option);
        });
      }

      rowsPerPageContainer.appendChild(rowsPerPageSelect);
      // 페이지당 행 수를 네 번째 위치에 배치
      rightDiv.appendChild(rowsPerPageContainer);

      // Bind page events
      const pageElements = document.querySelectorAll(`.${gridId}-pageElement`);
      pageElements.forEach((element) => {
        element.addEventListener("change", () => {
          searchGridData();
        });
      });
    };

    // Initialize page index
    const initPageIdx = (totalCount: number, prevRowsPerPage: number) => {
      if (!configRef.current.pagingable) return;

      const rowsPerPageSelect = document.querySelector(
        `#${gridId}-select-rowsPerPage`
      ) as HTMLSelectElement;
      const pageIdxSelect = document.querySelector(
        `#${gridId}-select-page`
      ) as HTMLSelectElement;

      if (!rowsPerPageSelect || !pageIdxSelect) return;

      const rowsPerPage = parseInt(rowsPerPageSelect.value);
      let pageIdx = parseInt(pageIdxSelect.value);
      const pageCount =
        Math.floor(totalCount / rowsPerPage) +
        (totalCount % rowsPerPage === 0 ? 0 : 1);

      pageIdxSelect.innerHTML = "";

      if (pageCount === 0) {
        const option = document.createElement("option");
        option.value = "0";
        option.textContent = "0";
        option.selected = true;
        pageIdxSelect.appendChild(option);
      } else {
        for (let i = 1; i <= pageCount; i++) {
          const option = document.createElement("option");
          option.value = i.toString();
          option.textContent = i.toString();
          pageIdxSelect.appendChild(option);
        }

        if (rowsPerPage !== prevRowsPerPage) {
          pageIdx = 1;
        }

        for (let i = 0; i < pageIdxSelect.options.length; i++) {
          if (
            pageIdxSelect.options[i].value ===
            (pageIdx === 0 ? "1" : pageIdx.toString())
          ) {
            pageIdxSelect.options[i].selected = true;
          }
        }
      }

      configRef.current.rowsPerPage = rowsPerPage;
    };

    // Initialize buttons
    const initButton = () => {
      if (!configRef.current.rowBtnType || !gridContainerRef.current) return;

      const {
        rowAdd,
        rowDel,
        rowUpdate,
        rowRegPop,
        treeSelectAll,
        treeCancel,
      } = configRef.current.rowBtnType;

      if (
        !(
          rowAdd ||
          rowDel ||
          rowUpdate ||
          (rowRegPop && rowRegPop.action) ||
          treeSelectAll ||
          treeCancel
        )
      ) {
        return;
      }

      const toolbarDiv =
        gridContainerRef.current.querySelector(".sbgrid-toolbar");
      if (!toolbarDiv) return;

      let toolbarHtml = "";

      // 일반 버튼들
      if (rowRegPop && rowRegPop.action) {
        toolbarHtml += `<a class="btn_black" id="btn_${gridId}_row_reg"><span>등록</span></a>`;
      } else if (rowAdd) {
        toolbarHtml += `<a class="btn_black" id="btn_${gridId}_row_add"><span>추가</span></a>`;
      }

      if (rowDel) {
        toolbarHtml += ` <a class="btn_black" id="btn_${gridId}_row_remove"><span>삭제</span></a>`;
      }

      if (rowUpdate) {
        toolbarHtml += ` <a class="btn_black" id="btn_${gridId}_row_save"><span>저장</span></a>`;
      }

      // 트리 전용 버튼들
      if (treeCancel) {
        toolbarHtml += ` <a class="btn_black" id="btn_${gridId}_tree_cancel"><span>취소</span></a>`;
      }

      if (treeSelectAll) {
        toolbarHtml += ` <a class="btn_black" id="btn_${gridId}_tree_select_all"><span>전체선택</span></a>`;
      }

      toolbarDiv.innerHTML = toolbarHtml;

      // Bind events
      if (rowRegPop && rowRegPop.action) {
        const regButton = document.querySelector(`#btn_${gridId}_row_reg`);
        regButton?.addEventListener("click", () => {
          if (onRegPopCallback) {
            onRegPopCallback();
          }
        });
      } else if (rowAdd) {
        const addButton = document.querySelector(`#btn_${gridId}_row_add`);
        addButton?.addEventListener("click", addRow);
      }

      if (rowDel) {
        const deleteButton = document.querySelector(
          `#btn_${gridId}_row_remove`
        );
        deleteButton?.addEventListener("click", deleteSelectedRows);
      }

      if (rowUpdate) {
        const saveButton = document.querySelector(`#btn_${gridId}_row_save`);
        saveButton?.addEventListener("click", saveGridData);
      }

      // 트리 전용 버튼 이벤트 바인딩
      if (treeCancel) {
        const treeCancelButton = document.querySelector(
          `#btn_${gridId}_tree_cancel`
        );
        treeCancelButton?.addEventListener("click", () => {
          if (onTreeCancelCallback) {
            onTreeCancelCallback();
          }
        });
      }

      if (treeSelectAll) {
        const treeSelectAllButton = document.querySelector(
          `#btn_${gridId}_tree_select_all`
        );
        treeSelectAllButton?.addEventListener("click", () => {
          if (onTreeSelectAllCallback) {
            onTreeSelectAllCallback();
          }
        });
      }
    };

    // Bind search
    const bindSearch = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;

      // Add doSearch method to grid
      (grid as any).doSearch = (extraParam?: string, isPrevSave?: boolean) => {
        searchGridData(extraParam, isPrevSave);
      };
    };

    // Set grid height
    const setGridHeight = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const gridHeight = configRef.current.height;

      if (gridHeight && gridHeight > 0) {
        // Use available method to set height
        if (typeof (grid as any).setBodyHeight === "function") {
          (grid as any).setBodyHeight(gridHeight);
        }
      } else {
        // Auto height calculation
        const container = gridContainerRef.current;
        if (container) {
          const bodyArea = container.querySelector(
            ".tui-grid-body-area"
          ) as HTMLElement;
          if (bodyArea) {
            const orgBodyHeight = bodyArea.offsetHeight;
            const windowHeight = window.innerHeight;
            const gridRect = container.getBoundingClientRect();
            const bottomPadding = 80;
            const newHeight =
              orgBodyHeight + (windowHeight - gridRect.bottom) - bottomPadding;
            if (typeof (grid as any).setBodyHeight === "function") {
              (grid as any).setBodyHeight(newHeight);
            }
          }
        }
      }
    };

    // Complex columns drag
    const complexColumnsDrag = () => {
      if (!gridRef.current || !configRef.current.header?.complexColumns) return;

      const grid = gridRef.current;
      const complexColumns = configRef.current.header.complexColumns;

      // Check for invalid columns
      const hasInvalidColumns = complexColumns.some((col1: any) =>
        complexColumns.some(
          (col2: any) =>
            col1.name !== col2.name &&
            (col1.childNames.some((child: any) =>
              col2.childNames.includes(child)
            ) ||
              col2.childNames.includes(col1.name))
        )
      );

      if (!hasInvalidColumns) {
        grid.on("mousedown", (ev: any) => {
          if (
            (grid as any).getRowCount?.() > 0 &&
            (!ev.rowKey || ev.rowKey === 0)
          ) {
            const header = { complexColumns: [] };
            if (typeof (grid as any).setHeader === "function") {
              (grid as any).setHeader(header);
            }
          }

          if (isMouseDownRef.current) return;
          isMouseDownRef.current = true;
        });

        const handleMouseUp = () => {
          try {
            if (
              isMouseDownRef.current &&
              gridRef.current &&
              configRef.current.header?.complexColumns
            ) {
              isMouseDownRef.current = false;
              const header = {
                complexColumns: configRef.current.header.complexColumns,
              };
              if (typeof (gridRef.current as any).setHeader === "function") {
                (gridRef.current as any).setHeader(header);
              }
            }
          } catch (error) {
            // 오류 발생 시 무시 (컴포넌트가 언마운트된 경우)
            console.warn("handleMouseUp error:", error);
          }
        };

        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    // 트리 데이터 변환 함수
    const convertToTreeData = (data: any[]): any[] => {
      if (!configRef.current.tree) return data;

      const { levelref = "lvl" } = configRef.current.tree;

      // 트리 구조 데이터 변환
      const treeData: any[] = [];
      const nodeMap = new Map(); // 노드 매핑을 위한 맵

      data.forEach((item, index) => {
        const level = parseInt(item[levelref]?.toString()) || 1;
        const treeItem = {
          ...item,
          rowKey: index + 1,
          _attributes: {
            tree: {
              parentRowKey: null,
              childRowKeys: [],
              expanded: true,
              hidden: false,
            },
          },
        };

        // 노드 매핑 저장 (rtTgtSeq를 키로 사용)
        nodeMap.set(item.rtTgtSeq, {
          ...treeItem,
          level: level,
          children: [],
        });

        treeData.push(treeItem);
      });

      // 부모-자식 관계 설정
      treeData.forEach((item, index) => {
        const currentNode = nodeMap.get(item.rtTgtSeq);
        if (currentNode && currentNode.level > 1) {
          // 부모 노드 찾기 (ancestorid 사용)
          const parentNode = nodeMap.get(item.ancestorid);
          if (parentNode) {
            item._attributes.tree.parentRowKey = parentNode.rowKey;
            parentNode.children.push(item.rowKey);

            // 부모의 childRowKeys 업데이트
            const parentItem = treeData.find(
              (t) => t.rowKey === parentNode.rowKey
            );
            if (parentItem) {
              parentItem._attributes.tree.childRowKeys.push(item.rowKey);
            }
          }
        }
      });

      return treeData;
    };

    // 트리 체크박스 상태 설정
    const setTreeCheckboxStates = () => {
      if (!gridRef.current || !configRef.current.tree?.checkbox) return;

      const grid = gridRef.current;
      const gridData = grid.getData();

      // TUI Grid는 0부터 시작하는 인덱스를 사용하므로 getData()로 가져온 데이터를 순회
      gridData.forEach((rowData: any, index: number) => {
        try {
          const useYn = rowData.useYn;
          const checked = useYn === "Y";
          const rowKey = rowData.rowKey !== undefined ? rowData.rowKey : index;

          if (checked) {
            grid.check(rowKey);
          } else {
            grid.uncheck(rowKey);
          }
        } catch (error) {
          // 개별 행 처리 중 오류가 발생하면 무시하고 계속 진행
          console.warn(`Row ${index} checkbox state setting failed:`, error);
        }
      });
    };

    // 트리 자식 노드들 가져오기
    const getTreeChildRows = (rowKey: number): number[] => {
      if (!gridRef.current) return [];

      const grid = gridRef.current;
      const rowData = (grid as any).getRow?.(rowKey);

      if (rowData && rowData._attributes?.tree?.childRowKeys) {
        return rowData._attributes.tree.childRowKeys;
      }

      return [];
    };

    // 트리 부모 노드 가져오기
    const getTreeParentRow = (rowKey: number): number | null => {
      if (!gridRef.current) return null;

      const grid = gridRef.current;
      const rowData = (grid as any).getRow?.(rowKey);

      if (rowData && rowData._attributes?.tree?.parentRowKey) {
        return rowData._attributes.tree.parentRowKey;
      }

      return null;
    };

    // 트리 전체 선택/해제
    const setTreeCheckboxAll = (checked: boolean) => {
      if (!gridRef.current || !configRef.current.tree?.checkbox) return;

      const grid = gridRef.current;
      const gridData = grid.getData();

      gridData.forEach((rowData: any, index: number) => {
        try {
          const rowKey = rowData.rowKey !== undefined ? rowData.rowKey : index;

          if (checked) {
            grid.check(rowKey);
          } else {
            grid.uncheck(rowKey);
          }

          // useYn 값도 함께 업데이트
          const newUseYn = checked ? "Y" : "N";
          grid.setValue(rowKey, "useYn", newUseYn);

          // 원본값과 비교하여 상태 업데이트
          const orgUseYn = rowData.orgUseYn;
          if (newUseYn !== orgUseYn) {
            if (typeof (grid as any).setRowStatus === "function") {
              (grid as any).setRowStatus(rowKey, "update");
            }
          } else {
            if (typeof (grid as any).removeRowStatus === "function") {
              (grid as any).removeRowStatus(rowKey, "update");
            }
          }
        } catch (error) {
          console.warn(`Row ${index} tree checkbox setting failed:`, error);
        }
      });
    };

    // 계층형 체크박스 처리
    const handleTreeCheckbox = (rowKey: number, checked: boolean) => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const rowData = grid.getRow(rowKey);

      if (!rowData) return;

      // 현재 노드 상태 업데이트
      const newUseYn = checked ? "Y" : "N";
      grid.setValue(rowKey, "useYn", newUseYn);

      // 원본값과 비교하여 상태 업데이트
      const orgUseYn = rowData.orgUseYn;
      if (newUseYn !== orgUseYn) {
        if (typeof (grid as any).setRowStatus === "function") {
          (grid as any).setRowStatus(rowKey, "update");
        }
      } else {
        if (typeof (grid as any).removeRowStatus === "function") {
          (grid as any).removeRowStatus(rowKey, "update");
        }
      }

      // 자식 노드들 자동 체크/해제
      const childRows = getTreeChildRows(rowKey);
      childRows.forEach((childRowKey) => {
        try {
          if (checked) {
            grid.check(childRowKey);
          } else {
            grid.uncheck(childRowKey);
          }

          // 자식 노드의 useYn도 업데이트
          (grid as any).setValue?.(childRowKey, "useYn", newUseYn);

          // 자식 노드의 상태도 업데이트
          const childOrgUseYn = (grid as any).getValue?.(
            childRowKey,
            "orgUseYn"
          );
          if (newUseYn !== childOrgUseYn) {
            if (typeof (grid as any).setRowStatus === "function") {
              (grid as any).setRowStatus(childRowKey, "update");
            }
          } else {
            if (typeof (grid as any).removeRowStatus === "function") {
              (grid as any).removeRowStatus(childRowKey, "update");
            }
          }

          // 재귀적으로 자식의 자식들도 처리
          handleTreeCheckbox(childRowKey, checked);
        } catch (error) {
          console.warn(
            `Child row ${childRowKey} checkbox handling failed:`,
            error
          );
        }
      });
    };

    // 트리 그리드 초기화
    const initTreeGrid = () => {
      if (!gridRef.current || !configRef.current.tree) return;

      const grid = gridRef.current;
      const treeConfig = configRef.current.tree;

      // 트리 이벤트 바인딩
      if (treeConfig.checkbox) {
        // 체크박스 이벤트 - 계층형 처리
        grid.on("check", (ev: any) => {
          const { rowKey } = ev;
          if (rowKey !== undefined && rowKey !== null) {
            handleTreeCheckbox(rowKey, true);
          }
        });

        grid.on("uncheck", (ev: any) => {
          const { rowKey } = ev;
          if (rowKey !== undefined && rowKey !== null) {
            handleTreeCheckbox(rowKey, false);
          }
        });
      }

      // 트리 확장/축소 이벤트
      grid.on("expand", (ev: any) => {
        // 트리 확장 시 상태 새로고침
        setTimeout(() => {
          refreshTreeStatus();
        }, 100);
      });

      grid.on("collapse", (ev: any) => {
        // 트리 축소 시 상태 새로고침
        setTimeout(() => {
          refreshTreeStatus();
        }, 100);
      });

      // 트리 체크박스 상태 설정
      setTreeCheckboxStates();

      // 그리드에 트리 전용 메서드 추가 (원본 SBGrid 호환)
      (grid as any).setTreeCheckboxAll = setTreeCheckboxAll;
      (grid as any).getTreeChildRows = getTreeChildRows;
      (grid as any).getTreeParentRow = getTreeParentRow;
      (grid as any).getTreeRealRow = getTreeRealRow;
      (grid as any).getTreeCheckboxChecked = getTreeCheckboxChecked;
      (grid as any).refreshStatus = refreshTreeStatus;
      (grid as any).resetTreeGrid = resetTreeGrid; // 초기화 메서드 추가
      (grid as any).saveGridData = saveGridData; // 저장 메서드 추가
      (grid as any).openTreeNodeAll = (
        open: boolean,
        callback?: () => void
      ) => {
        // TUI Grid의 expandAll/collapseAll 사용
        if (open) {
          if (typeof (grid as any).expandAll === "function") {
            (grid as any).expandAll();
          }
        } else {
          if (typeof (grid as any).collapseAll === "function") {
            (grid as any).collapseAll();
          }
        }

        if (callback) {
          setTimeout(callback, 200);
        }
      };

      // 원본 SBGrid의 getUpdateData 메서드 호환
      (grid as any).getUpdateData = (
        includeStatus: boolean,
        statusType: string
      ) => {
        const gridData = grid.getData();
        const updateData: any[] = [];

        gridData.forEach((rowData: any, index: number) => {
          try {
            if (!rowData) return;

            const newUseYn = rowData.useYn;
            const orgUseYn = rowData.orgUseYn;

            // 변경된 데이터만 수집
            if (newUseYn !== orgUseYn) {
              if (statusType === "all" || statusType === "u") {
                updateData.push({
                  ...rowData,
                  useYn: newUseYn,
                  status: "u",
                });
              }
            }
          } catch (error) {
            console.warn(`Row ${index} update data collection failed:`, error);
          }
        });

        return updateData;
      };
    };

    // 트리 상태 새로고침 (원본 SBGrid의 refreshStatus와 동일)
    const refreshTreeStatus = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const gridData = grid.getData();

      // TUI Grid는 0부터 시작하는 인덱스를 사용하므로 getData()로 가져온 데이터를 순회
      gridData.forEach((rowData: any, index: number) => {
        try {
          const newUseYn = rowData.useYn;
          const orgUseYn = rowData.orgUseYn;
          const rowKey = rowData.rowKey !== undefined ? rowData.rowKey : index;

          if (newUseYn !== orgUseYn) {
            if (typeof (grid as any).setRowStatus === "function") {
              (grid as any).setRowStatus(rowKey, "update");
            }
          } else {
            if (typeof (grid as any).removeRowStatus === "function") {
              (grid as any).removeRowStatus(rowKey, "update");
            }
          }
        } catch (error) {
          console.warn(`Row ${index} status refresh failed:`, error);
        }
      });
    };

    // 트리 그리드 초기화 (모든 변경사항을 원본 상태로 복원)
    const resetTreeGrid = () => {
      if (!gridRef.current) return false;

      const grid = gridRef.current;
      const gridData = grid.getData();

      if (gridData.length === 0) {
        return false;
      }

      try {
        // 모든 행을 원본 상태로 복원
        gridData.forEach((rowData: any, index: number) => {
          try {
            const orgUseYn = rowData.orgUseYn;
            const rowKey =
              rowData.rowKey !== undefined ? rowData.rowKey : index;

            if (orgUseYn !== undefined) {
              // useYn을 원본값으로 복원
              grid.setValue(rowKey, "useYn", orgUseYn);

              // 체크박스 상태도 원본값에 맞게 복원
              if (orgUseYn === "Y") {
                grid.check(rowKey);
              } else {
                grid.uncheck(rowKey);
              }

              // 행 상태 제거 (수정 상태 해제)
              if (typeof (grid as any).removeRowStatus === "function") {
                (grid as any).removeRowStatus(rowKey, "update");
              }
            }
          } catch (error) {
            console.warn(`Row ${index} reset failed:`, error);
          }
        });

        // 상태 새로고침
        refreshTreeStatus();

        return true;
      } catch (error) {
        console.error("Tree grid reset failed:", error);
        return false;
      }
    };

    // 트리 실제 행과 화면 행의 차이 계산 (원본 SBGrid 호환)
    const getTreeRealRow = (viewRow: number): number => {
      // TUI Grid에서는 실제 행과 화면 행이 동일하므로 그대로 반환
      return viewRow;
    };

    // 트리 체크박스 상태 확인 (원본 SBGrid 호환)
    const getTreeCheckboxChecked = (
      rowKey: number,
      viewpoint?: string
    ): boolean => {
      if (!gridRef.current) return false;

      const grid = gridRef.current;
      const checkedRows = grid.getCheckedRows();
      return checkedRows.some((row: any) => row.rowKey === rowKey);
    };

    // Add row
    const addRow = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const data: any = {
        status: "i", // 신규행임을 표시하는 플래그 추가
      };

      // Set system user info if available
      // This would need to be adapted based on your authentication system
      // if (window._etUsrBase) {
      //   data.sysRegrId = window._etUsrBase.usrId;
      //   data.sysModrId = window._etUsrBase.usrId;
      // }

      const option = {
        at: 0,
        focus: true,
      };

      grid.appendRow(data, option);
      const newData = grid.getData();
      if (newData.length > 0) {
        const rowKey = (newData[0] as any)?.rowKey as
          | number
          | string
          | undefined
          | null;
        if (rowKey !== undefined && rowKey !== null) {
          grid.check(rowKey as any);
        }

        // 신규 행임을 명확히 표시
        if (rowKey !== undefined && rowKey !== null) {
          const negRowKey = typeof rowKey === "number" ? -rowKey : -1;
          (grid as any).setValue?.(rowKey as any, "tempRowKey", negRowKey);
          (grid as any).setValue?.(rowKey as any, "status", "i");
        }

        // Handle column editability - 새로운 행은 편집 가능하도록 설정
        configRef.current.columns.forEach((column) => {
          if (column.editable === true) {
            // 모든 편집 가능한 컬럼을 활성화
            if (typeof (grid as any).enableCell === "function") {
              (grid as any).enableCell(rowKey, column.name);
            }
          } else if (column.editable === "new") {
            // 새 행에서만 편집 가능한 컬럼을 활성화
            if (typeof (grid as any).enableCell === "function") {
              (grid as any).enableCell(rowKey, column.name);
            }
          }

          // Copy values on add
          if (column.copyOnAdd) {
            const copyElement = document.querySelector(
              `#${column.copyOnAdd}`
            ) as HTMLInputElement;
            if (copyElement) {
              const copyVal = copyElement.value;
              (grid as any).setValue?.(rowKey, column.name, copyVal);
            }
          } else if (column.defaultVal) {
            (grid as any).setValue?.(rowKey, column.name, column.defaultVal);
          }
        });

        // 기존 행들의 editable: 'new' 컬럼 비활성화
        setTimeout(() => {
          refreshConfig();
        }, 100);

        // Call add after callback
        if (configRef.current.onAddAfterCallback && onAddAfterCallback) {
          onAddAfterCallback();
        }
      }
    };

    // Delete selected rows
    const deleteSelectedRows = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const selectedRows = grid.getCheckedRows();

      if (!selectedRows || selectedRows.length === 0) {
        alert("Please select rows to delete.");
        return;
      }

      if (configRef.current.deleteBeforeCallback && onDeleteBeforeCallback) {
        if (!onDeleteBeforeCallback()) {
          return;
        }
      }

      if (confirm("Are you sure you want to delete the selected rows?")) {
        let deleteFlag = false;

        [...selectedRows].reverse().forEach((selectedRow: any) => {
          if (gridDataRef.current[selectedRow.rowKey]) {
            // Existing data - mark for deletion
            deleteFlag = true;
          } else {
            // New data - remove from grid
            grid.removeRow(selectedRow.rowKey);
          }
        });

        if (deleteFlag) {
          putGridFormData(true);
        } else {
          alert("Deleted successfully.");
        }
      }
    };

    // Save grid data
    const saveGridData = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const selectedRows = grid.getCheckedRows();

      if (!selectedRows || selectedRows.length === 0) {
        alert("Please select rows to save.");
        return;
      }

      if (configRef.current.saveBeforeCallback && onSaveBeforeCallback) {
        if (!onSaveBeforeCallback()) {
          return;
        }
      }

      putGridFormData(false);
    };

    // Get grid change data (트리 구조 고려)
    const getGridChangeData = (deleteFlag: boolean) => {
      if (!gridRef.current) return false;

      const grid = gridRef.current;
      const createdRows: any[] = [];
      const updatedRows: any[] = [];
      const deletedRows: any[] = [];

      if (deleteFlag) {
        const checkRows = grid.getCheckedRows();
        checkRows.forEach((deletedRow: any) => {
          const target = {
            status: "d",
            data: {
              ...deletedRow,
              check: "true",
            },
          };
          deletedRows.push(target);
        });
      } else {
        // 체크된 행만 가져오기
        const checkedRows = grid.getCheckedRows();

        // 트리 그리드인 경우 체크된 행 중 변경된 데이터만 수집
        if (configRef.current.tree) {
          checkedRows.forEach((checkedRow: any) => {
            try {
              const rowKey = checkedRow.rowKey;
              const rowData = (grid as any).getRow?.(rowKey);
              if (!rowData) return;

              const newUseYn = (grid as any).getValue?.(rowKey, "useYn");
              const orgUseYn = (grid as any).getValue?.(rowKey, "orgUseYn");

              // 원본값과 다른 경우만 업데이트 대상으로 처리
              if (newUseYn !== orgUseYn) {
                const target = {
                  status: "u",
                  data: {
                    ...rowData,
                    useYn: newUseYn,
                    check: "true",
                  },
                };
                updatedRows.push(target);
              }
            } catch (error) {
              console.warn(
                `Checked row ${checkedRow.rowKey} data collection failed:`,
                error
              );
            }
          });
        } else {
          // 일반 그리드 처리 - 체크된 행만 처리
          checkedRows.forEach((checkedRow: any) => {
            const rowData = checkedRow;
            const rowKey = rowData.rowKey;

            // 신규 추가된 행 확인 (status가 'i'이거나 tempRowKey가 있는 경우)
            if (rowData.status === "i" || rowData.tempRowKey) {
              const target = {
                status: "i",
                data: {
                  ...rowData,
                  check: "true",
                },
              };
              createdRows.push(target);
            } else {
              // 기존 행의 경우 gridDataRef와 비교하여 변경사항 확인
              const originalData = gridDataRef.current[rowKey];
              if (originalData) {
                // 변경사항이 있는지 확인
                let hasChanges = false;
                configRef.current.columns.forEach((column: any) => {
                  if (rowData[column.name] !== originalData[column.name]) {
                    hasChanges = true;
                  }
                });

                if (hasChanges) {
                  const target = {
                    status: "u",
                    data: {
                      ...rowData,
                      check: "true",
                    },
                  };
                  updatedRows.push(target);
                }
              }
            }
          });
        }
      }

      const data: any = {};
      data[gridId] = [...createdRows, ...updatedRows, ...deletedRows];

      if (!data[gridId] || data[gridId].length === 0) {
        alert("No changes to save.");
        return false;
      }

      // Check required fields
      let chkRequiredStr = null;
      let chkRequired = false;

      [...createdRows, ...updatedRows].forEach((gridData) => {
        configRef.current.requiredColumns?.forEach((requiredColumn) => {
          const requiredColumnValue = gridData.data[requiredColumn.name];
          if (
            requiredColumnValue == null ||
            requiredColumnValue === "" ||
            requiredColumnValue === "null"
          ) {
            chkRequired = true;
            chkRequiredStr = requiredColumn.header;
            return false;
          }
        });

        if (chkRequired) {
          return false;
        }
      });

      if (chkRequired) {
        alert(`필수 항목이 누락되었습니다: ${chkRequiredStr}`);
        return false;
      }

      return data;
    };

    // Put grid form data (트리 구조 고려)
    const putGridFormData = async (deleteFlag: boolean) => {
      // 트리 그리드인 경우 저장 전 트리를 모두 펼침
      if (configRef.current.tree && gridRef.current) {
        const grid = gridRef.current as any;
        if (typeof grid.openTreeNodeAll === "function") {
          await new Promise<void>((resolve) => {
            grid.openTreeNodeAll(true, () => {
              resolve();
            });
          });
        }
      }

      const data = getGridChangeData(deleteFlag);
      if (typeof data === "boolean" && !data) {
        return false;
      }

      const formElement = document.querySelector(
        `#${configRef.current.form}`
      ) as HTMLFormElement;
      if (!formElement) {
        alert("Form not found.");
        return false;
      }

      const formData = new FormData(formElement);
      const finalData = { ...data, formPayload: Object.fromEntries(formData) };

      setIsLoading(true);

      try {
        const saveUrl =
          configRef.current.saveAction || configRef.current.action;
        if (!saveUrl) {
          alert("Save URL not configured.");
          return false;
        }

        const response = await axios.put(saveUrl, JSON.stringify(finalData), {
          timeout: _INT_TIME_OUT,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const result = response.data;

        if (result.message) {
          alert(result.message);
        } else {
          if (deleteFlag) {
            alert("Deleted successfully.");
          } else {
            alert("Saved successfully.");
          }
        }

        if (!result.succeeded) {
          return;
        }

        // 삭제 시, row 제거 처리
        if (deleteFlag) {
          // 삭제 대상 rowKeys 구하기 (deleteSelectedRows 'deletedRows' 리스트 활용)
          const deletedRows = Object.values(finalData[configRef.current.id])
            .filter((item: any) => item.status === "d")
            .map((item: any) => item.data.rowKey);

          // 그리드에서 직접 삭제 실행
          deletedRows.forEach((rowKey: any) => {
            if (gridRef.current) {
              gridRef.current.removeRow(rowKey);
            }
          });
        }

        // Search after save
        if (configRef.current.saveAfterSearch) {
          searchGridData();
        }

        // Save callback
        if (configRef.current.saveAfterCallback && onSaveCallback) {
          onSaveCallback(result);
        }
      } catch (error) {
        console.error("Save error:", error);
        alert("An error occurred while saving.");
      } finally {
        setIsLoading(false);
      }
    };

    // Search grid data
    const searchGridData = async (
      extraParam?: string,
      isPrevSave?: boolean
    ) => {
      if (!gridRef.current || !configRef.current.action) return;

      const formElement = document.querySelector(
        `#${configRef.current.form}`
      ) as HTMLFormElement;
      if (!formElement) {
        alert("Form not found.");
        return;
      }

      const formData = new FormData(formElement);
      let formQuery = "";
      for (const key of formData.keys()) {
        formQuery += `&${key}=${formData.get(key)}`;
      }

      const prevRowsPerPage = configRef.current.rowsPerPage || 10;
      let param = "";
      param += formQuery.substring(1);

      if (extraParam) {
        param += (param.length > 0 ? "&" : "") + extraParam;
      }

      // Add paging parameters
      if (configRef.current.pagingable) {
        const rowsPerPageSelect = document.querySelector(
          `#${gridId}-select-rowsPerPage`
        ) as HTMLSelectElement;
        const pageIdxSelect = document.querySelector(
          `#${gridId}-select-page`
        ) as HTMLSelectElement;

        if (rowsPerPageSelect) {
          const rowsPerPage = parseInt(rowsPerPageSelect.value);
          param += (param.length > 0 ? "&" : "") + `rowsPerPage=${rowsPerPage}`;
        }

        if (pageIdxSelect) {
          let pageIdx = parseInt(pageIdxSelect.value);
          pageIdx = pageIdx <= 0 ? 1 : pageIdx;
          param += (param.length > 0 ? "&" : "") + `pageIdx=${pageIdx}`;
        }
      }

      setIsLoading(true);

      try {
        const response = await axios.post(configRef.current.action, param, {
          timeout: _INT_TIME_OUT,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const result = response.data;

        if (!result.succeeded) {
          alert(result.message);
          return;
        }

        // 트리 그리드인 경우 데이터 변환
        let processedData = result.data;
        if (configRef.current.tree) {
          processedData = convertToTreeData(result.data);
        }

        // gridDataRef에 검색 결과 데이터 저장 (rowKey를 키로 사용)
        gridDataRef.current = {};
        processedData.forEach((item: any, index: number) => {
          // const rowKey = item.rowKey || item.id || index;
          const rowKey =
            item.rowKey !== undefined && item.rowKey !== null
              ? item.rowKey
              : item.id !== undefined && item.id !== null
                ? item.id
                : index;
          gridDataRef.current[rowKey] = item;
        });

        gridRef.current.resetData(processedData);
        gridRef.current.refreshLayout();

        // 트리 그리드인 경우 체크박스 상태 설정
        if (configRef.current.tree?.checkbox) {
          // 트리 체크박스 상태만 설정 (이벤트는 이미 바인딩됨)
          setTreeCheckboxStates();
        }

        initPageIdx(result.total || 0, prevRowsPerPage);
        // refreshConfig() 호출 제거 - 툴바 재생성 방지
        refreshConfig(); // editable: 'new' 설정 적용을 위해 활성화

        // Update total count
        const totalCountElement = document.querySelector(
          `#${gridId}-totalcount`
        );
        if (totalCountElement) {
          totalCountElement.innerHTML = ` (Rows: <strong>${result.total || 0}</strong>)`;
        }

        // Search callback
        if (!isPrevSave || configRef.current.saveAfterSearchCallback) {
          if (configRef.current.actionAfterCallback && onSearchCallback) {
            onSearchCallback(result);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        alert("An error occurred while searching.");
      } finally {
        setIsLoading(false);
      }
    };

    // Alias for original doSearch method name
    const doSearch = searchGridData;

    // Handle grid height change
    const handleGridHeightChange = (newHeight: number) => {
      setCurrentGridHeight(newHeight);
      if (
        gridRef.current &&
        typeof (gridRef.current as any).setBodyHeight === "function"
      ) {
        (gridRef.current as any).setBodyHeight(newHeight);
      }
    };

    // Download Excel
    const downloadExcel = async () => {
      if (!gridRef.current || !configRef.current.excelAction) return;

      const rowCount = (gridRef.current as any).getRowCount?.() || 0;
      if (rowCount <= 0) {
        alert("No data to export.");
        return;
      }

      const formElement = document.querySelector(
        `#${configRef.current.form}`
      ) as HTMLFormElement;
      if (!formElement) {
        alert("Form not found.");
        return;
      }

      const formData = new FormData(formElement);
      let formQuery = "";
      for (const key of formData.keys()) {
        formQuery += `&${key}=${formData.get(key)}`;
      }

      let param = formQuery.substring(1);
      const excelFileName =
        configRef.current.rowBtnType?.excelFileName || "export.xlsx";
      param += (param.length > 0 ? "&" : "") + `excelFileName=${excelFileName}`;

      const url = `${configRef.current.excelAction}?${param}`;

      setIsLoading(true);

      try {
        const response = await axios.get(url, { responseType: "blob" });

        const contentLength = response.headers["content-length"];
        if (contentLength) {
          let fileName = excelFileName;
          const headerFileValue = response.headers["content-disposition"];
          if (headerFileValue) {
            const match = headerFileValue.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (match && match[1]) {
              fileName = match[1].replace(/['"]/g, "");
              fileName = decodeURIComponent(fileName);
            }
          }

          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          alert("An error occurred while downloading the file.");
        }
      } catch (error) {
        console.error("Excel download error:", error);
        alert("An error occurred while downloading the Excel file.");
      } finally {
        setIsLoading(false);
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getGrid: () => gridRef.current,
      addRow,
      deleteSelectedRows,
      saveGridData,
      searchGridData: () => searchGridData(),
      doSearch: () => doSearch(),
      setHeight: handleGridHeightChange,
    }));

    return (
      <div className="mzGridWrap">
        <div className="grid-builder-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner">Loading...</div>
            </div>
          )}
          <div ref={gridContainerRef} id={gridId} className="grid-container" />

          {/* 리사이즈 버튼 */}
          {configRef.current.resizable &&
            configRef.current.resizeOptions?.showButton && (
              <div className="grid-resize-button">
                <MzBtnResize
                  direction="vertical"
                  title="그리드 높이 조절"
                  initialHeight={currentGridHeight}
                  minHeight={configRef.current.resizeOptions.minHeight}
                  maxHeight={configRef.current.resizeOptions.maxHeight}
                  onHeightChange={handleGridHeightChange}
                  showText={false}
                  buttonText="⇅"
                />
              </div>
            )}
        </div>
      </div>
    );
  }
);

GridBuilder.displayName = "GridBuilder";

export default GridBuilder;
