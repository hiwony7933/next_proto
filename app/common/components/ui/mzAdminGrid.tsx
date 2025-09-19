'use client';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import 'tui-grid/dist/tui-grid.css';
import MzButton from './mzButton';
import MzSelectBox from '../form/mzSelectBox';
import MzInputText from '../form/mzInputText';
import MzAlert from './mzAlert';

export type AdminGridColumn = {
  /** 컬럼의 고유 이름 (데이터 키) */
  name: string;
  /** 컬럼 헤더(표시될 이름) */
  header: string;
  /** 컬럼 너비(px) */
  width?: number;
  /** 정렬 방식: 'left' | 'center' | 'right' */
  align?: 'left' | 'center' | 'right';
  /** 셀 에디터 옵션 */
  editor?: any;
  /** 유효성 검사 옵션 */
  validation?: any;
  /** 셀 포맷터 */
  formatter?: (data: any) => string;
  /** 셀 관계 */
  relations?: {
    targetNames: string[];
    listItems: (params: { value: string }) => Array<{ text: string; value: string }>;
  }[];
  /** 셀 히든 */
  hidden?: boolean;
  /** 셀 수정 여부 */
  editable?: boolean;
  /** 셀 필수 여부 */
  required?: boolean;
  /** 셀 기본값 */
  defaultVal?: string;
};

export type GridLeftBtnType = 'new' | 'add' | 'delete' | 'modify' | 'save';

export type AdminGridProps = {
  /** 그리드 ID */
  id?: string;
  /** 그리드 헤더 */
  header?: {
    height?: number;
    complexColumns?: AdminGridColumn[];
  };
  /** 컬럼 정의 배열 */
  columns: AdminGridColumn[];
  /** 행 데이터 배열 */
  data: any[];
  /** 행 데이터 setter */
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  /** 페이지당 행 수 (기본값: 10) */
  perPage?: number;
  /** 그리드 본문 높이(px, 기본값: 300) */
  bodyHeight?: number;
  /** 그리드 높이 */
  height?: number;
  /** rowHeaders 옵션 (예: 체크박스, rowNum 등) */
  rowHeaders?: { type: 'rowNum' | 'checkbox' }[];
  /** 체크박스 선택 시 호출되는 콜백 */
  onCheck?: (checkedRows: any[]) => void;
  /** 행 클릭 시 호출되는 콜백 */
  onRowClick?: (row: any) => void;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 왼쪽 버튼 종류 배열 */
  gridLeftBtn?: GridLeftBtnType[];
  /** 페이지 사이즈 셀렉트 노출 여부 (기본값: true) */
  pageSizeYN?: boolean;
  /** 검색 영역 노출 여부 (기본값: true) */
  gridSearchYN?: boolean;
  /** 컬럼 show/hide 설정 노출 여부 (기본값: true) */
  gridSettingYN?: boolean;
  /** 검색 실행 시 호출되는 콜백 (검색어를 인자로 전달) */
  onSearch?: (keyword: string) => void;
  /** new 버튼 클릭 시 호출되는 콜백 (모달 등) */
  onNew?: () => void;
  /** 새 행 생성 함수 (반드시 고유 id 포함) - add 버튼용 */
  onCreateRow?: () => any;
  /** 행 추가 위치(top: 첫번째, bottom: 마지막) */
  addRowPosition?: 'top' | 'bottom';
  /** 여러 행 삭제 시 호출되는 콜백 */
  onDeleteRows?: (rowKeys: number[]) => void;
  /** save 버튼 클릭 시 호출되는 콜백 (실제 저장 로직) */
  onSave?: () => void;
  /** 셀 편집 시작 전 호출되는 콜백 (false 반환 시 편집 차단) */
  onBeforeEditCell?: (ev: any) => boolean;
  /** 버튼 타입 */
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
  };
  /** 페이징 설정 */
  pagingable?: boolean;
  /** 페이지 크기 옵션 */
  rowsPerPage?: number;
  /** 페이지 크기 옵션 */
  rows?: number[];
  /** 검색 폼 ID */
  form?: string;
  /** 삭제 전 콜백 */
  deleteBeforeCallback?: boolean;
  /** 저장 전 콜백 */
  saveBeforeCallback?: boolean;
  /** 저장 후 콜백 */
  saveAfterCallback?: boolean;
  /** 저장 후 검색 콜백 */
  saveAfterSearch?: boolean;
  /** 저장 후 콜백 */
  actionAfterCallback?: boolean;
  /** 추가 후 콜백 */
  onAddAfterCallback?: boolean;
  /** 액션 */
  action?: string;
  /** 저장 액션 */
  saveAction?: string;
  /** 엑셀 액션 */
  excelAction?: string;
  /** 리사이즈 옵션 */
  resizeOptions?: {
    showButton?: boolean;
    minHeight?: number;
    maxHeight?: number;
    step?: number;
  };
  /** 필수 컬럼 */
  requiredColumns?: {
    header: string;
    name: string;
  }[];
  /** rowKey */
  rowKey?: string;
  /** 새 행 추가 시 createList로 분류되도록 하는 설정 */
  enableNewRowAsCreate?: boolean;
};

const BUTTON_LABELS: Record<GridLeftBtnType, string> = {
  new: '등록',
  add: '추가',
  delete: '삭제',
  modify: '수정',
  save: '저장',
};

// tui-grid은 브라우저 전용이므로 동적 로딩
let GridCtor: any = null;

const MzAdminGrid: React.FC<AdminGridProps> = ({
  columns,
  data,
  setData,
  perPage = 10,
  bodyHeight = 300,
  rowHeaders = [{ type: 'checkbox' }, { type: 'rowNum' }],
  onCheck,
  onRowClick,
  className = '',
  style = {},
  gridLeftBtn = ['add', 'delete', 'save'],
  pageSizeYN = true,
  gridSearchYN = true,
  gridSettingYN = true,
  onSearch,
  onNew,
  onCreateRow,
  addRowPosition = 'top',
  onDeleteRows,
  onSave,
  onBeforeEditCell,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<any | null>(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [pageSize, setPageSize] = useState(perPage);
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(columns.map((col) => col.name));
  const timeoutRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [gridLibReady, setGridLibReady] = useState(false);

  // 동적으로 tui-grid 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('tui-grid');
        if (!mounted) return;
        GridCtor = mod.default;
        setGridLibReady(true);
      } catch (e) {
        console.error('Failed to load tui-grid dynamically:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 컬럼 align 기본값을 center로 적용
  const processedColumns = columns.map((col) => ({ ...col, align: col.align || 'center' }));

  useLayoutEffect(() => {
    if (!gridLibReady || !GridCtor || !gridRef.current) {
      return;
    }
    if (gridRef.current) {
      // 기존 그리드 인스턴스가 있으면 파괴(destroy)
      if (gridInstance.current) {
        gridInstance.current.destroy();
        gridInstance.current = null;
      }

      // 데이터 유효성 검사 강화
      const validData = Array.isArray(data)
        ? data.filter((row) => {
            // 기본 유효성 검사
            if (!row || typeof row !== 'object') {
              console.warn('⚠️ 유효하지 않은 데이터 (객체 아님):', row);
              return false;
            }

            // rowKey(id) 유효성 검사 - TUI Grid에서 필수
            if (row.id === undefined || row.id === null) {
              console.warn('⚠️ 유효하지 않은 데이터 (id 없음):', row);
              return false;
            }

            // id가 문자열이나 숫자인지 확인
            if (typeof row.id !== 'string' && typeof row.id !== 'number') {
              console.warn('⚠️ 유효하지 않은 데이터 (id 타입 오류):', typeof row.id, row);
              return false;
            }

            return true;
          })
        : [];

      // 빈 데이터일 경우 기본 빈 배열로 설정
      if (validData.length === 0 && data.length > 0) {
        console.warn('⚠️ 모든 데이터가 유효하지 않아 빈 배열로 초기화됩니다.');
      }

      console.log('📊 입력받은 원본 데이터:', data);
      console.log('📊 유효성 검사 후 데이터:', validData.length, '개 (전체:', data.length, '개)');

      // 각 데이터 항목의 id 값 확인
      validData.forEach((row, index) => {
        console.log(
          `  - 데이터 ${index + 1}: id=${row.id} (${typeof row.id}), 이름=${row.templateName || row.name || '이름없음'}`,
        );
      });

      // 이벤트 바인딩 함수
      const setupGridEvents = () => {
        if (!gridInstance.current) return;

        console.log('🔗 이벤트 바인딩 시작');

        // 체크박스 이벤트 핸들러 - 간소화된 안전한 처리
        let checkboxEventTimer: number | null = null;
        let lastEventTime = 0;

        // TUI Grid 이벤트 등록 - 간소화된 안전한 방식
        try {
          // 체크박스 DOM 상태 확인 함수
          const checkDOMCheckboxes = () => {
            const checkboxes = gridRef.current?.querySelectorAll('input[type="checkbox"]') || [];
            console.log(`🔍 DOM 체크박스 상태 확인 (총 ${checkboxes.length}개):`);

            checkboxes.forEach((checkbox, index) => {
              const input = checkbox as HTMLInputElement;
              const rowKey = input.closest('tr')?.getAttribute('data-row-key');
              const isChecked = input.checked;
              const id = input.id;

              console.log(
                `  - 체크박스 ${index + 1}: ID="${id}", rowKey="${rowKey}", checked=${isChecked}`,
              );
            });
          };

          // 단일 이벤트 핸들러로 통합 (이벤트 충돌 방지)
          const singleCheckboxHandler = (eventType: string, rowKey?: any) => {
            // 그리드 인스턴스 유효성 검사
            if (!gridInstance.current) return;

            const currentTime = Date.now();
            const timestamp = new Date().toLocaleTimeString();

            console.log(
              `🔄 [${timestamp}] 체크박스 이벤트: ${eventType} (rowKey: ${rowKey || 'all'})`,
            );

            // 이벤트 발생 시점의 DOM 상태 확인
            console.log(`📍 [${timestamp}] 이벤트 발생 시점 DOM 상태:`);
            checkDOMCheckboxes();

            // 빠른 연속 이벤트 차단
            if (currentTime - lastEventTime < 200) {
              console.log(
                `⚠️ [${timestamp}] 빠른 연속 이벤트 차단 (${currentTime - lastEventTime}ms)`,
              );
              return;
            }

            lastEventTime = currentTime;

            // 타이머 클리어
            if (checkboxEventTimer) {
              clearTimeout(checkboxEventTimer);
            }

            // 상태 업데이트
            checkboxEventTimer = setTimeout(() => {
              if (gridInstance.current) {
                try {
                  const checkedRows = gridInstance.current.getCheckedRows();
                  console.log(`📊 [${timestamp}] 최종 체크된 행 수: ${checkedRows.length}개`);
                  console.log(
                    `📊 [${timestamp}] 체크된 행 ID들:`,
                    checkedRows.map((r: any) => r.id),
                  );

                  // 타이머 후 DOM 상태 다시 확인
                  console.log(`📍 [${timestamp}] 타이머 후 DOM 상태:`);
                  checkDOMCheckboxes();

                  setCheckedCount(checkedRows.length);

                  if (onCheck) {
                    onCheck(checkedRows);
                  }
                } catch (error) {
                  console.error(`❌ [${timestamp}] 체크박스 상태 업데이트 오류:`, error);
                }
              }
              checkboxEventTimer = null;
            }, 200); // 200ms 지연으로 안정성 확보
          };

          // 개별 이벤트 등록 (상세 분석)
          gridInstance.current.on('check', (ev) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`🟢 [${timestamp}] TUI Grid 체크 이벤트 발생:`, {
              rowKey: ev.rowKey,
              columnName: ev.columnName,
              type: 'check',
            });

            // 콜 스택 추적
            console.trace('체크 이벤트 호출 스택');

            singleCheckboxHandler('체크', ev.rowKey);
          });

          gridInstance.current.on('uncheck', (ev) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`🔴 [${timestamp}] TUI Grid 언체크 이벤트 발생:`, {
              rowKey: ev.rowKey,
              columnName: ev.columnName,
              type: 'uncheck',
            });

            // 콜 스택 추적
            console.trace('언체크 이벤트 호출 스택');

            singleCheckboxHandler('해제', ev.rowKey);
          });

          gridInstance.current.on('checkAll', (ev) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`🟢 [${timestamp}] TUI Grid 전체체크 이벤트 발생:`, {
              columnName: ev.columnName,
              type: 'checkAll',
            });

            singleCheckboxHandler('전체선택');
          });

          gridInstance.current.on('uncheckAll', (ev) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`🔴 [${timestamp}] TUI Grid 전체해제 이벤트 발생:`, {
              columnName: ev.columnName,
              type: 'uncheckAll',
            });

            // 콜 스택 추적
            console.trace('전체해제 이벤트 호출 스택');

            // 전체해제는 특별 처리 (새 행 있을 때 차단)
            try {
              const allRows = gridInstance.current?.getData() || [];
              const hasNewRows = allRows.some((row) => row.id > 1000000000000);

              if (hasNewRows) {
                console.log(`🚫 새 행 있음 - 전체해제 이벤트 차단`);
                return;
              }
            } catch (error) {
              console.error('❌ 전체해제 검증 오류:', error);
              return;
            }

            singleCheckboxHandler('전체해제');
          });

          console.log('✅ 체크박스 이벤트 바인딩 완료');
        } catch (error) {
          console.error('❌ 체크박스 이벤트 바인딩 실패:', error);
        }

        // 셀 편집 시작 전 이벤트 바인딩
        if (onBeforeEditCell) {
          try {
            gridInstance.current.on('beforeEditCell', (ev) => {
              const result = onBeforeEditCell(ev);
              if (result === false) {
                ev.stop(); // 편집 차단
              }
            });
            console.log('✅ 편집 제어 이벤트 바인딩 완료');
          } catch (error) {
            console.error('❌ 편집 제어 이벤트 바인딩 실패:', error);
          }
        }

        // 레이아웃 갱신 및 rowNum을 ID로 변경
        timeoutRef.current = setTimeout(() => {
          if (
            gridInstance.current &&
            gridRef.current &&
            gridRef.current.clientHeight !== undefined
          ) {
            try {
              gridInstance.current.refreshLayout();
              console.log('✅ 그리드 레이아웃 갱신 완료');

              // rowNum 헤더를 ID로 변경하고 실제 ID 값으로 변경 (한 번만)
              updateRowNumbers();

              // MutationObserver 설정 (DOM 변경 감지)
              if (observerRef.current) {
                observerRef.current.disconnect();
              }

              observerRef.current = new MutationObserver((mutations) => {
                let shouldUpdate = false;

                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 새로운 행이 추가되었는지 확인
                    const hasNewRow = Array.from(mutation.addedNodes).some((node) => {
                      return (
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node as Element).matches('tr[data-row-key]')
                      );
                    });

                    if (hasNewRow) {
                      shouldUpdate = true;
                    }
                  }
                });

                if (shouldUpdate) {
                  console.log('🔄 DOM 변경 감지 - updateRowNumbers 및 체크박스 리스너 추가');
                  updateRowNumbers();

                  // 새로운 체크박스에 대한 리스너 추가
                  setTimeout(() => {
                    const checkboxes =
                      gridRef.current?.querySelectorAll('input[type="checkbox"]') || [];
                    checkboxes.forEach((checkbox) => {
                      const input = checkbox as HTMLInputElement;
                      const rowKey = input.closest('tr')?.getAttribute('data-row-key');
                      const id = input.id;

                      // 이미 리스너가 있는지 확인
                      if (!input.dataset.listenerAdded) {
                        input.dataset.listenerAdded = 'true';
                        input.addEventListener('click', (e) => {
                          console.log(
                            `🎯 [새 행] DOM 클릭 감지: 체크박스 ID="${id}", rowKey="${rowKey}", checked=${input.checked}`,
                          );
                        });
                      }
                    });
                  }, 100);
                }
              });

              // 그리드 본문 영역을 관찰
              const bodyArea = gridRef.current?.querySelector('.tui-grid-body-area');
              if (bodyArea) {
                observerRef.current.observe(bodyArea, {
                  childList: true,
                  subtree: true,
                });
                console.log('✅ DOM 변경 감지 설정 완료');
              }
            } catch (error) {
              console.error('❌ 그리드 레이아웃 설정 실패:', error);
            }
          }
        }, 200); // 이벤트 바인딩 후 추가 시간
      };

      // tui-grid 인스턴스 생성
      try {
        gridInstance.current = new GridCtor({
          el: gridRef.current,
          data: validData,
          columns: processedColumns,
          bodyHeight,
          rowHeaders,
          rowKey: 'id',
          scrollX: true,
          scrollY: true,
          minBodyHeight: 200,
          header: { height: 30 },
          editingEvent: 'click',
          pageOptions: {
            useClient: true,
            perPage: pageSize,
          },
        });
        console.log('✅ Grid 생성 성공');

        // 그리드 완전 초기화 확인
        if (!gridInstance.current) {
          throw new Error('Grid 인스턴스가 생성되지 않았습니다.');
        }

        // 행 클릭 이벤트 등록
        if (onRowClick) {
          gridInstance.current.on('click', (ev: any) => {
            const { rowKey } = ev;
            if (rowKey !== undefined && rowKey !== null) {
              const rowData = gridInstance.current?.getRow(rowKey);
              if (rowData) {
                onRowClick(rowData);
              }
            }
          });
        }

        // 체크박스 클릭 이벤트 직접 감지 (DOM 레벨)
        const addCheckboxClickListeners = () => {
          setTimeout(() => {
            console.log('🔍 그리드 초기화 상태 확인');

            // 1. 그리드 데이터 확인
            const gridData = gridInstance.current?.getData() || [];
            console.log('📊 그리드 데이터:', gridData);
            console.log('📊 그리드 rowKey 설정: "id" (코드에서 설정)');

            // 2. DOM 행 확인
            const tableRows = gridRef.current?.querySelectorAll('tbody tr') || [];
            console.log(`📋 DOM 행 수: ${tableRows.length}`);

            tableRows.forEach((row, index) => {
              const rowKey = row.getAttribute('data-row-key');
              const rowData = gridData.find((d) => String(d.id) === rowKey);
              console.log(
                `  - 행 ${index + 1}: data-row-key="${rowKey}", 데이터 존재=${!!rowData}`,
              );

              if (rowData) {
                console.log(`    데이터 ID: ${rowData.id}, 타입: ${typeof rowData.id}`);
              }
            });

            // 3. 체크박스 확인
            const checkboxes = gridRef.current?.querySelectorAll('input[type="checkbox"]') || [];
            console.log(`🔍 체크박스 클릭 리스너 추가 (${checkboxes.length}개)`);

            checkboxes.forEach((checkbox, index) => {
              const input = checkbox as HTMLInputElement;
              const parentRow = input.closest('tr');
              const rowKey = parentRow?.getAttribute('data-row-key');
              const id = input.id;

              console.log(`  - 체크박스 ${index + 1}: ID="${id}", rowKey="${rowKey}"`);

              // 부모 행 정보 확인
              if (parentRow) {
                console.log(
                  `    부모 행 정보: tagName=${parentRow.tagName}, className="${parentRow.className}"`,
                );
                console.log(
                  `    모든 속성:`,
                  Array.from(parentRow.attributes).map((attr) => `${attr.name}="${attr.value}"`),
                );
              }

              // 체크박스 ID 중복 검사
              if (id) {
                const duplicates = gridRef.current?.querySelectorAll(`#${id}`) || [];
                if (duplicates.length > 1) {
                  console.error(`❌ 중복된 체크박스 ID 발견: "${id}" (${duplicates.length}개)`);
                }
              } else {
                console.warn(`⚠️ 체크박스 ID가 없습니다: 체크박스 ${index + 1}`);
              }

              // rowKey 문제 확인
              if (!rowKey || rowKey === 'null') {
                console.error(`❌ 잘못된 rowKey: "${rowKey}" (체크박스 ${index + 1})`);
              }

              // 새 이벤트 리스너 추가
              input.addEventListener('click', (e) => {
                console.log(
                  `🎯 DOM 클릭 감지: 체크박스 ID="${id}", rowKey="${rowKey}", checked=${input.checked}`,
                );

                // 체크박스 상태 변경 후 즉시 DOM 확인
                setTimeout(() => {
                  const currentCheckbox = gridRef.current?.querySelector(
                    `#${id}`,
                  ) as HTMLInputElement;
                  if (currentCheckbox) {
                    console.log(
                      `🔍 클릭 후 체크박스 상태: ID="${id}", checked=${currentCheckbox.checked}`,
                    );
                  }
                }, 10);
              });
            });
          }, 200);
        };

        // 내부 상태 완전 초기화 대기 후 이벤트 바인딩
        setTimeout(() => {
          console.log('✅ Grid 내부 상태 완전 초기화 완료');
          setupGridEvents();
          addCheckboxClickListeners();
        }, 150); // 충분한 시간을 두고 초기화
      } catch (error) {
        console.error('❌ TUI Grid 생성 실패:', error);
        console.error('Grid 생성 실패 상세:', {
          el: gridRef.current,
          data: validData,
          columns: processedColumns,
          bodyHeight,
          rowHeaders,
          pageSize,
        });

        // 그리드 생성 실패 시 안전하게 정리
        if (gridInstance.current) {
          try {
            gridInstance.current.destroy();
          } catch (destroyError) {
            console.error('❌ Grid destroy 실패:', destroyError);
          }
          gridInstance.current = null;
        }
        return;
      }
    }
    // 언마운트 시 그리드 인스턴스 정리 및 타임아웃 클리어
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      gridInstance.current?.destroy();
      gridInstance.current = null;
    };
  }, [columns, pageSize, bodyHeight, rowHeaders, onCheck, gridLibReady]);

  // 데이터 변경 시 그리드 업데이트 (인스턴스 재생성 없이)
  useEffect(() => {
    if (gridInstance.current && Array.isArray(data)) {
      try {
        // 데이터 유효성 검사 (초기화와 동일한 로직 적용)
        const validData = data.filter((row) => {
          // 기본 유효성 검사
          if (!row || typeof row !== 'object') return false;

          // rowKey(id) 유효성 검사 - TUI Grid에서 필수
          if (row.id === undefined || row.id === null) {
            console.warn('⚠️ 데이터 업데이트 - 유효하지 않은 데이터 (id 없음):', row);
            return false;
          }

          // id가 문자열이나 숫자인지 확인
          if (typeof row.id !== 'string' && typeof row.id !== 'number') {
            console.warn('⚠️ 데이터 업데이트 - 유효하지 않은 데이터 (id 타입 오류):', row);
            return false;
          }

          return true;
        });

        console.log(
          '📥 외부 데이터 변경 - Grid 업데이트 (유효:',
          validData.length,
          '/ 전체:',
          data.length,
          ')',
        );

        // 안전하게 데이터 업데이트
        gridInstance.current.resetData(validData);

        // 레이아웃 새로고침 및 rowNum 업데이트
        setTimeout(() => {
          if (gridRef.current && gridInstance.current) {
            try {
              gridInstance.current.refreshLayout();
              // 데이터 변경 후 rowNum을 ID로 다시 업데이트 (한 번만)
              updateRowNumbers();
            } catch (refreshError) {
              console.error('❌ 데이터 변경 후 레이아웃 갱신 실패:', refreshError);
            }
          }
        }, 150);
      } catch (e) {
        console.error('❌ 그리드 데이터 업데이트 오류:', e);
      }
    }
  }, [data]);

  useEffect(() => {
    if (gridInstance.current) {
      processedColumns.forEach((col) => {
        if (visibleColumns.includes(col.name)) {
          gridInstance.current!.showColumn(col.name);
        } else {
          gridInstance.current!.hideColumn(col.name);
        }
      });
    }
  }, [visibleColumns]);

  // rowHeaders에 checkbox가 있을 때만 개수 표시
  const hasCheckbox = rowHeaders?.some((r) => r.type === 'checkbox');

  // rowNum을 실제 ID 값으로 변경하는 함수 (호출 빈도 제한)
  const updateRowNumbersRef = useRef<number | null>(null);
  const updateRowNumbers = () => {
    if (!gridInstance.current) return;

    // 이미 실행 중이면 중단
    if (updateRowNumbersRef.current) {
      clearTimeout(updateRowNumbersRef.current);
    }

    updateRowNumbersRef.current = setTimeout(() => {
      if (!gridInstance.current) return;

      try {
        console.log('🔄 updateRowNumbers 시작');

        // 헤더 변경 (한 번만)
        const headerSelector =
          '.tui-grid-header-area [data-column-name="_number"] .tui-grid-cell-content';
        const rowNumHeader = document.querySelector(headerSelector);

        if (rowNumHeader && rowNumHeader.textContent !== 'ID') {
          rowNumHeader.textContent = 'ID';
          console.log('✅ 헤더를 ID로 변경');
        }

        // 각 행의 rowNum 값을 실제 ID로 변경 (체크박스 영향 최소화)
        const allData = gridInstance.current.getData();
        const gridContainer = gridRef.current;

        if (!gridContainer) return;

        allData.forEach((row: any, index: number) => {
          if (row.id !== undefined) {
            const rowElement = gridContainer.querySelector(`tr[data-row-key="${row.id}"]`);
            if (rowElement) {
              const rowNumCell = rowElement.querySelector(
                '[data-column-name="_number"] .tui-grid-cell-content',
              );
              if (rowNumCell && rowNumCell.textContent !== String(row.id)) {
                rowNumCell.textContent = String(row.id);
              }
            }
          }
        });

        console.log('✅ rowNum을 ID로 변경 완료');
      } catch (error) {
        console.error('❌ rowNum 변경 중 오류:', error);
      }

      updateRowNumbersRef.current = null;
    }, 100); // 100ms 지연으로 DOM 안정화 대기
  };

  const handleSearch = () => {
    if (onSearch) onSearch(search);
  };

  // new 버튼 클릭 핸들러 (모달 등)
  const handleNewClick = () => {
    if (onNew) {
      onNew();
    }
  };

  // add 버튼 클릭 핸들러 (TUI Grid 네이티브 방식)
  const handleAddClick = () => {
    console.log('🔥 행 추가 시작 (네이티브 방식)');

    if (!gridInstance.current) {
      console.error('❌ Grid 인스턴스 없음');
      MzAlert.alert('Grid가 초기화되지 않았습니다.');
      return;
    }

    if (onCreateRow) {
      const newRow = onCreateRow();
      console.log('📝 새 행 데이터:', newRow);

      if (!newRow || typeof newRow !== 'object') {
        console.error('❌ 잘못된 행 데이터');
        MzAlert.alert('새 행 생성에 실패했습니다.');
        return;
      }

      try {
        // TUI Grid의 네이티브 appendRow 메서드 사용
        if (addRowPosition === 'top') {
          gridInstance.current.appendRow(newRow, { at: 0 });
        } else {
          gridInstance.current.appendRow(newRow);
        }

        console.log('✅ appendRow 완료');

        // 새로 추가된 행 자동 체크 (rowKey 기반)
        setTimeout(() => {
          if (gridInstance.current) {
            const allRows = gridInstance.current.getData();
            const newRowKey = newRow.id;
            console.log('🔍 새 행 ID:', newRowKey);
            console.log(
              '🔍 전체 행 데이터:',
              allRows.map((r) => ({ id: r.id, name: r.templateName || r.name })),
            );

            const exists = allRows.some((row) => row.id === newRowKey);
            console.log('🔍 새 행 존재 여부:', exists);

            if (exists) {
              console.log('✅ 새 행 발견 - 자동 체크 시작');

              // 체크 전 DOM 상태 확인
              const checkboxBefore = gridRef.current?.querySelector(
                `tr[data-row-key="${newRowKey}"] input[type="checkbox"]`,
              ) as HTMLInputElement;
              if (checkboxBefore) {
                console.log(
                  `📍 체크 전 DOM 상태: ID="${checkboxBefore.id}", checked=${checkboxBefore.checked}`,
                );
              }

              // ✅ rowKey 기반으로 체크
              requestAnimationFrame(() => {
                if (gridInstance.current) {
                  try {
                    console.log(`🔧 gridInstance.check(${newRowKey}) 호출`);
                    gridInstance.current.check(newRowKey);
                    console.log(`✅ 새 행 자동 체크 완료 (rowKey: ${newRowKey})`);

                    // 체크 후 즉시 DOM 상태 확인
                    setTimeout(() => {
                      const checkboxAfter = gridRef.current?.querySelector(
                        `tr[data-row-key="${newRowKey}"] input[type="checkbox"]`,
                      ) as HTMLInputElement;
                      if (checkboxAfter) {
                        console.log(
                          `📍 체크 후 DOM 상태: ID="${checkboxAfter.id}", checked=${checkboxAfter.checked}`,
                        );
                      }

                      const checkedRows = gridInstance.current!.getCheckedRows();
                      console.log(`📊 체크 후 그리드 상태: ${checkedRows.length}개 체크됨`);

                      setCheckedCount(checkedRows.length);

                      if (onCheck) {
                        onCheck(checkedRows);
                      }
                    }, 100);
                  } catch (checkError) {
                    console.error('❌ 체크 실패:', checkError);
                  }
                }
              });
            } else {
              console.log('❌ 새 행을 찾을 수 없음 - 재시도');
              // 재시도 로직 추가
              setTimeout(() => {
                if (gridInstance.current) {
                  const retryRows = gridInstance.current.getData();
                  console.log(
                    '🔄 재시도 - 전체 행 데이터:',
                    retryRows.map((r) => ({ id: r.id, name: r.templateName || r.name })),
                  );

                  const retryExists = retryRows.some((row) => row.id === newRowKey);
                  console.log('🔄 재시도 - 새 행 존재 여부:', retryExists);

                  if (retryExists) {
                    console.log('✅ 재시도 성공 - 자동 체크 시작');

                    // 재시도 전 DOM 상태 확인
                    const checkboxBefore = gridRef.current?.querySelector(
                      `tr[data-row-key="${newRowKey}"] input[type="checkbox"]`,
                    ) as HTMLInputElement;
                    if (checkboxBefore) {
                      console.log(
                        `📍 재시도 전 DOM 상태: ID="${checkboxBefore.id}", checked=${checkboxBefore.checked}`,
                      );
                    }

                    try {
                      console.log(`🔧 [재시도] gridInstance.check(${newRowKey}) 호출`);
                      gridInstance.current.check(newRowKey);
                      console.log(`✅ 재시도 후 새 행 자동 체크 완료 (rowKey: ${newRowKey})`);

                      // 체크 후 상태 업데이트
                      setTimeout(() => {
                        const checkboxAfter = gridRef.current?.querySelector(
                          `tr[data-row-key="${newRowKey}"] input[type="checkbox"]`,
                        ) as HTMLInputElement;
                        if (checkboxAfter) {
                          console.log(
                            `📍 재시도 후 DOM 상태: ID="${checkboxAfter.id}", checked=${checkboxAfter.checked}`,
                          );
                        }

                        const checkedRows = gridInstance.current!.getCheckedRows();
                        console.log(`📊 재시도 후 그리드 상태: ${checkedRows.length}개 체크됨`);

                        setCheckedCount(checkedRows.length);

                        if (onCheck) {
                          onCheck(checkedRows);
                        }
                      }, 100);
                    } catch (checkError) {
                      console.error('❌ 재시도 체크 실패:', checkError);
                    }
                  } else {
                    console.log('❌ 재시도에서도 새 행을 찾을 수 없음');
                  }
                }
              }, 500);
            }
          }
        }, 250); // 안정적인 체크를 위해 지연 시간 증가

        // 부모 컴포넌트에 변경 알림 (선택적)
        if (setData && typeof setData === 'function') {
          const updatedData = gridInstance.current.getData();
          setData(updatedData);
          console.log('📤 부모에 데이터 변경 알림');
        }

        // 새 행 추가 후 rowNum을 ID로 업데이트 (한 번만)
        setTimeout(updateRowNumbers, 300);
      } catch (error) {
        console.error('❌ appendRow 실패:', error);
        console.log('🔄 fallback: resetData 방식으로 재시도');

        // appendRow 실패 시 fallback
        try {
          const currentData = gridInstance.current.getData();
          const newData =
            addRowPosition === 'top' ? [newRow, ...currentData] : [...currentData, newRow];

          gridInstance.current.resetData(newData);
          console.log('✅ fallback resetData 완료');

          // fallback 후 새로 추가된 행 자동 체크
          setTimeout(() => {
            if (gridInstance.current) {
              // fallback 전 DOM 상태 확인
              const checkboxBefore = gridRef.current?.querySelector(
                `tr[data-row-key="${newRow.id}"] input[type="checkbox"]`,
              ) as HTMLInputElement;
              if (checkboxBefore) {
                console.log(
                  `📍 fallback 전 DOM 상태: ID="${checkboxBefore.id}", checked=${checkboxBefore.checked}`,
                );
              }

              console.log(`🔧 [fallback] gridInstance.check(${newRow.id}) 호출`);
              gridInstance.current.check(newRow.id);
              console.log(`✅ fallback 후 새 행 자동 체크 완료 (rowKey: ${newRow.id})`);

              // 체크 후 상태 업데이트
              setTimeout(() => {
                const checkboxAfter = gridRef.current?.querySelector(
                  `tr[data-row-key="${newRow.id}"] input[type="checkbox"]`,
                ) as HTMLInputElement;
                if (checkboxAfter) {
                  console.log(
                    `📍 fallback 후 DOM 상태: ID="${checkboxAfter.id}", checked=${checkboxAfter.checked}`,
                  );
                }

                const checkedRows = gridInstance.current!.getCheckedRows();
                console.log(`📊 fallback 후 그리드 상태: ${checkedRows.length}개 체크됨`);

                setCheckedCount(checkedRows.length);

                if (onCheck) {
                  onCheck(checkedRows);
                }
              }, 100);
            }
          }, 300);

          // fallback 후에도 rowNum을 ID로 업데이트 (한 번만)
          setTimeout(updateRowNumbers, 300);
        } catch (fallbackError) {
          console.error('❌ fallback도 실패:', fallbackError);
          MzAlert.alert('행 추가 중 오류가 발생했습니다.');
        }
      }
    }
  };

  // delete 버튼 클릭 핸들러 (체크된 행 삭제)
  const handleDeleteClick = () => {
    if (!gridInstance.current) {
      console.error('❌ Grid 인스턴스 없음');
      return;
    }

    const checkedRows = gridInstance.current.getCheckedRows();
    console.log('🔍 체크된 행들:', checkedRows);

    if (checkedRows.length === 0) {
      MzAlert.alert('삭제할 항목을 선택해주세요.');
      return;
    }

    const checkedRowIds = checkedRows
      .map((r) => r.id)
      .filter((id): id is number => typeof id === 'number');
    console.log('🗑️ 삭제할 행 IDs:', checkedRowIds);

    MzAlert.confirm(`선택한 ${checkedRows.length}개 항목을 삭제하시겠습니까?`).then((result) => {
      if (result && gridInstance.current) {
        try {
          // 1. 그리드에서 직접 행 삭제
          checkedRowIds.forEach((id) => {
            try {
              gridInstance.current!.removeRow(id);
              console.log(`✅ 행 삭제 완료: ${id}`);
            } catch (error) {
              console.error(`❌ 행 삭제 실패: ${id}`, error);
            }
          });

          // 2. 부모 컴포넌트에도 알림
          if (onDeleteRows) {
            onDeleteRows(checkedRowIds);
          }

          // 3. 상태 업데이트 (부모 컴포넌트 데이터 동기화)
          if (setData && typeof setData === 'function') {
            const updatedData = gridInstance.current.getData();
            setData(updatedData);
            console.log('📤 부모에 삭제된 데이터 동기화 완료');
          }

          console.log('✅ 삭제 작업 완료');

          // 삭제 후 rowNum을 ID로 업데이트 (한 번만)
          setTimeout(updateRowNumbers, 300);
        } catch (error) {
          console.error('❌ 삭제 중 오류 발생:', error);
          MzAlert.alert('삭제 중 오류가 발생했습니다.');
        }
      }
    });
  };

  // save 버튼 클릭 핸들러 (변경사항 저장)
  const handleSaveClick = () => {
    MzAlert.confirm('저장하시겠습니까?').then((result) => {
      if (result && onSave) {
        onSave();
      }
    });
  };

  // modify 버튼 클릭 핸들러
  const handleModifyClick = () => {
    // 수정 버튼 클릭 시 동작 (현재는 빈 함수)
  };

  // 버튼별 핸들러 매핑
  const getButtonHandler = (btn: GridLeftBtnType) => {
    switch (btn) {
      case 'new':
        return handleNewClick;
      case 'add':
        return handleAddClick;
      case 'delete':
        return handleDeleteClick;
      case 'save':
        return handleSaveClick;
      case 'modify':
        return handleModifyClick;
      default:
        return () => {};
    }
  };

  return (
    <div className={`mzGridWrap ${className}`} style={style}>
      {/* [01] 그리드 헤더 영역 */}
      <div className="gridHeader">
        <div className="gridLeft">
          {gridLeftBtn.map((btn: GridLeftBtnType) => (
            <MzButton key={btn} size="1" fill="black" onClick={getButtonHandler(btn)}>
              {BUTTON_LABELS[btn]}
            </MzButton>
          ))}
        </div>
        <div className="gridRight">
          {pageSizeYN && (
            <div className="mzGridPage">
              <MzSelectBox
                options={['5', '10', '20', '50', '100']}
                selected={pageSize.toString()}
                onSelect={(v) => setPageSize(Number(v))}
                size="1"
              />
            </div>
          )}
          {gridSearchYN && (
            <div className="gridSearch">
              <MzInputText
                mzSize="1"
                placeholder="검색어 입력"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button type="button" className="btnSearch" onClick={handleSearch}>
                검색
              </button>
            </div>
          )}
          {gridSettingYN && (
            <div className="gridSetting">
              <MzSelectBox
                align="right"
                type="checkbox"
                className="gridSettingCheckbox"
                options={processedColumns.map((col) => col.header)}
                selected={processedColumns
                  .filter((col) => visibleColumns.includes(col.name))
                  .map((col) => col.header)}
                onSelect={(value) => {
                  const selectedHeaders = Array.isArray(value) ? value : [value];
                  const selectedNames = processedColumns
                    .filter((col) => selectedHeaders.includes(col.header))
                    .map((col) => col.name);
                  // 실제 그리드 컬럼 show/hide
                  if (gridInstance.current) {
                    processedColumns.forEach((col) => {
                      if (selectedNames.includes(col.name)) {
                        gridInstance.current!.showColumn(col.name);
                      } else {
                        gridInstance.current!.hideColumn(col.name);
                      }
                    });
                  }
                  setVisibleColumns(selectedNames);
                }}
                size="1"
              />
            </div>
          )}
        </div>
      </div>
      {/* [02] 그리드 리스트 영역 */}
      <div className="gridList" ref={gridRef} style={{ minHeight: 300 }} />
      {/* [03] 선택된 셀 개수 */}
      {hasCheckbox && <div className="gridCheckedCount">선택된 셀의 개수: {checkedCount}</div>}
    </div>
  );
};

export default MzAdminGrid;
