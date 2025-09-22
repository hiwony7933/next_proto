import React, { useRef, useState, useEffect } from 'react';
import GridBuilder, { CheckboxRenderer, DateUtil } from './exGridBuilder';

// 사용여부 리스트 아이템
const _tuiGridUseListItems = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' }
];

// 코드 리스트 아이템 타입 정의
interface CodeListItem {
  grpCd: string;
  grpCdNm: string;
  grpCdDesc: string;
  useYn: string;
  sortSeq: number;
  sysRegrId: string;
  sysRegDtime: string;
  sysModrId: string;
  sysModDtime: string;
}

const ExGridBuilderExample: React.FC = () => {
  const gridRef = useRef<any>(null);
  const [data, setData] = useState<CodeListItem[]>([]);

  // 그리드 설정 (원본과 동일하게)
  const gridConfig = {
    id: 'gridBuilder',
    rowHeaders: [
      {
        type: 'checkbox',
        renderer: {
          type: CheckboxRenderer
        }
      }
    ],
    header: {
      height: 60,
      complexColumns: [
        {
          header: '코드 정보',
          name: '코드 정보',
          childNames: ['grpCd', 'grpCdNm', 'grpCdDesc']
        }
      ]
    },
    columns: [
      {
        header: '공통코드ID',
        name: 'grpCd',
        width: 120,
        editor: {
          type: 'text',
          options: {
            maxLength: 10
          }
        },
        editable: true,
        required: true
      },
      {
        header: '공통코드명',
        name: 'grpCdNm',
        align: 'left',
        ellipsis: true,
        editor: {
          type: 'text',
          options: {
            maxLength: 50
          }
        },
        editable: true,
        required: true
      },
      {
        header: '공통코드설명',
        name: 'grpCdDesc',
        align: 'left',
        ellipsis: true,
        editor: {
          type: 'text',
          options: {
            maxLength: 150
          }
        },
        editable: true
      },
      {
        header: '사용여부',
        name: 'useYn',
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: _tuiGridUseListItems
          }
        },
        editable: true,
        required: true
      },
      {
        header: '정렬순서',
        name: 'sortSeq',
        editor: {
          type: 'text',
          options: {
            maxLength: 3,
            dataType: 'number'
          }
        },
        editable: true,
        sortable: true
      },
      {
        header: '등록자ID',
        name: 'sysRegrId',
        filter: 'select'
      },
      {
        header: '등록일시',
        name: 'sysRegDtime',
        formatter: ({ value }: { value: any }) => DateUtil.getDateObject(value).format('yyyy-MM-dd HH:mm:ss'),
        ellipsis: true
      },
      {
        header: '수정자ID',
        name: 'sysModrId',
        filter: 'select'
      },
      {
        header: '수정일시',
        name: 'sysModDtime',
        formatter: ({ value }: { value: any }) => DateUtil.getDateObject(value).format('yyyy-MM-dd HH:mm:ss'),
        ellipsis: true
      }
    ],
    height: 300, // 원본에서는 bodyHeight가 아닌 height 사용
    rowBtnType: {
      rowAdd: true,
      rowDel: true,
      rowUpdate: true,
      rowExcelAll: true,
      excelFileName: 'excelData'
    },
    pagingable: false,
    rowsPerPage: 100, // 원본과 동일한 기본값
    rows: [10, 20, 50, 100, 200, 300, 500, 1000], // 원본과 동일한 페이지당 행 수 옵션
    form: 'gridForm',
    saveAfterSearch: true, // 저장 후 자동 재조회
    action: '/system/baseInfoMgmt.getStGrpCdList.do',
    saveAction: '/system/baseInfoMgmt.putStGrpCdList.do',
    excelAction: '/system/baseInfoMgmt.getCodeListExcelDownload.do',
    resizeOptions: {
      showButton: true,
      minHeight: 300,
      maxHeight: 800,
      step: 10
    }
  };

  // 이벤트 리스너 구현 (원본 eventListener.js 기반)
  const handleInit = (grid: any) => {
    console.log('Grid initialized:', grid);
    gridRef.current = grid;

    // focusChange 이벤트 바인딩
    grid.on("focusChange", (ev: any) => {
      const { rowKey, columnName, prevRowKey, prevColumnName, instance } = ev;
      const grpCd = instance.getValue(rowKey, 'grpCd');

      if (columnName === 'grpCd' && grpCd) {
        // 원본과 동일하게 searchGrpCd 히든 필드 업데이트
        const searchGrpCdInput = document.querySelector('#searchGrpCd') as HTMLInputElement;
        if (searchGrpCdInput) {
          searchGrpCdInput.value = grpCd;
        }

        // 표준코드 그리드 검색 (원본에서 StStdCdGridEventListener.doSearch() 호출)
        // 실제 환경에서는 표준코드 그리드가 있다면 해당 그리드의 doSearch를 호출
        console.log('Calling StStdCdGridEventListener.doSearch() for grpCd:', grpCd);
        // 예시: window.StStdCdGridEventListener?.doSearch?.();
      }
    });
  };

  const handleSearch = (response: any) => {
    console.log('Search response:', response);

    // 원본 _searchCallback 로직
    if (gridRef.current && gridRef.current.getRowCount() > 0) {
      gridRef.current.setSelectionRange({
        start: [0, 0],
        end: [0, 0]
      });

      const grpCd = gridRef.current.getValue(0, 'grpCd');
      if (grpCd) {
        // 원본과 동일하게 searchGrpCd 히든 필드 업데이트
        const searchGrpCdInput = document.querySelector('#searchGrpCd') as HTMLInputElement;
        if (searchGrpCdInput) {
          searchGrpCdInput.value = grpCd;
        }

        // 표준코드 그리드 검색 (원본에서 StStdCdGridEventListener.doSearch() 호출)
        console.log('Calling StStdCdGridEventListener.doSearch() for grpCd:', grpCd);
        // 예시: window.StStdCdGridEventListener?.doSearch?.();
      }
    }
  };

  const handleSave = (response: any) => {
    console.log('Save response:', response);
  };

  // 검색 버튼 이벤트 (원본 eventListener 기반)
  useEffect(() => {
    const handleSearchClick = () => {
      if (gridRef.current) {
        gridRef.current.doSearch();
      }
    };

    const handleInitClick = () => {
      const form = document.querySelector('#gridForm') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    };

    const searchTrigger = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.keyCode && keyEvent.keyCode === 13) {
        handleSearchClick();
        e.preventDefault();
        return false;
      }
    };

    // 버튼 이벤트 바인딩
    const searchBtn = document.querySelector('#btn_search');
    const initBtn = document.querySelector('#btn_init');
    const grpCdInput = document.querySelector('#grpCd');
    const grpCdNmInput = document.querySelector('#grpCdNm');

    if (searchBtn) {
      searchBtn.addEventListener('click', handleSearchClick);
    }
    if (initBtn) {
      initBtn.addEventListener('click', handleInitClick);
    }
    if (grpCdInput) {
      grpCdInput.addEventListener('keypress', searchTrigger);
    }
    if (grpCdNmInput) {
      grpCdNmInput.addEventListener('keypress', searchTrigger);
    }

    // 클린업
    return () => {
      if (searchBtn) {
        searchBtn.removeEventListener('click', handleSearchClick);
      }
      if (initBtn) {
        initBtn.removeEventListener('click', handleInitClick);
      }
      if (grpCdInput) {
        grpCdInput.removeEventListener('keypress', searchTrigger);
      }
      if (grpCdNmInput) {
        grpCdNmInput.removeEventListener('keypress', searchTrigger);
      }
    };
  }, []);

  return (
    <div className="layoutSearch">
      <div className="layoutTitle">
        <h2 className="title">GridBuilder 데모</h2>
      </div>

      {/* 검색 폼 (원본 eventListener에서 참조하는 요소들) */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <form id="gridForm">
          <input type="hidden" name="action" value="" />
          <label>
            그룹코드ID:
            <input type="text" id="grpCd" name="grpCd" style={{ marginLeft: '10px', marginRight: '20px' }} />
          </label>
          <label>
            그룹코드명:
            <input type="text" id="grpCdNm" name="grpCdNm" style={{ marginLeft: '10px', marginRight: '20px' }} />
          </label>
          <button type="button" id="btn_search" style={{ marginRight: '10px' }}>검색</button>
          <button type="button" id="btn_init">초기화</button>
        </form>
        <input type="hidden" id="searchGrpCd" name="searchGrpCd" />
      </div>

      <GridBuilder
        gridId="stGrpCdGrid"
        config={gridConfig}
        resizable={true}
        onInit={handleInit}
        onSearchCallback={handleSearch}
        onSaveCallback={handleSave}
      />
    </div>
  );
};

export default ExGridBuilderExample; 