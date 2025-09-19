import React, { useState, useEffect, useRef } from "react";
import { ADMIN_ROUTE_PATH, ADMIN_BASE_PATH } from '../../admin/routers/routePath';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import GridBuilder from '@/admin/components/sample/exGridBuilder';
import '../assets/sample.scss';
import '../../admin/assets/adminStyle.scss';

// GridBuilder 사용 예제 데이터
const sampleData = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자', department: '개발팀', status: 'active' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '사용자', department: '기획팀', status: 'active' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: '사용자', department: '디자인팀', status: 'inactive' },
  { id: 4, name: '박민수', email: 'park@example.com', role: '관리자', department: '개발팀', status: 'active' },
  { id: 5, name: '정수영', email: 'jung@example.com', role: '사용자', department: '마케팅팀', status: 'active' },
];

// GridBuilder 컬럼 설정
const gridColumns = [
  {
    name: 'id',
    header: 'ID',
    width: 80,
    align: 'center',
    editable: false
  },
  {
    name: 'name',
    header: '이름*',
    width: 120,
    align: 'left',
    editable: true,
    required: true,
    editor: {
      type: 'text'
    }
  },
  {
    name: 'email',
    header: '이메일*',
    width: 200,
    align: 'left',
    editable: true,
    required: true,
    editor: {
      type: 'text'
    }
  },
  {
    name: 'role',
    header: '권한',
    width: 100,
    align: 'center',
    editable: true,
    editor: {
      type: 'select',
      options: {
        listItems: [
          { text: '사용자', value: '사용자' },
          { text: '관리자', value: '관리자' },
          { text: '슈퍼관리자', value: '슈퍼관리자' }
        ]
      }
    }
  },
  {
    name: 'department',
    header: '부서',
    width: 120,
    align: 'center',
    editable: true,
    editor: {
      type: 'select',
      options: {
        listItems: [
          { text: '개발팀', value: '개발팀' },
          { text: '기획팀', value: '기획팀' },
          { text: '디자인팀', value: '디자인팀' },
          { text: '마케팅팀', value: '마케팅팀' }
        ]
      }
    }
  },
  {
    name: 'status',
    header: '상태',
    width: 100,
    align: 'center',
    editable: true,
    editor: {
      type: 'select',
      options: {
        listItems: [
          { text: '활성', value: 'active' },
          { text: '비활성', value: 'inactive' }
        ]
      }
    }
  }
];

const sampleCode = `import React, { useRef, useState } from 'react';
import GridBuilder from '@/admin/components/sample/exGridBuilder';

const MyComponent = () => {
  const gridRef = useRef(null);
  const [gridData, setGridData] = useState([]);

  // 그리드 설정
  const gridConfig = {
    id: 'sampleGrid',
    columns: [
      { name: 'id', header: 'ID', width: 80, align: 'center', editable: false },
      { name: 'name', header: '이름*', width: 120, editable: true, required: true },
      { name: 'email', header: '이메일*', width: 200, editable: true, required: true },
      { name: 'role', header: '권한', width: 100, editable: true }
    ],
    data: gridData,
    rowHeaders: [{ type: 'checkbox' }, { type: 'rowNum' }],
    bodyHeight: 400,
    scrollX: true,
    scrollY: true,
    editingEvent: 'click',
    rowBtnType: {
      rowAdd: true,
      rowDel: true,
      rowUpdate: true,
      rowExcelAll: true,
      excelFileName: 'sample_data.xlsx'
    },
    keywordSearch: true,
    pagingable: true,
    rows: [10, 20, 50, 100],
    rowsPerPage: 10,
         action: '/api/sample/search',
     saveAction: '/api/sample/save',
     excelAction: '/api/sample/excel',
     form: 'searchForm',
     resizeOptions: {
       showButton: true,
       minHeight: 300,
       maxHeight: 600
     }
  };

  // 이벤트 핸들러
  const handleGridInit = (grid) => {
    console.log('Grid initialized:', grid);
  };

  const handleSearchCallback = (response) => {
    console.log('Search completed:', response);
    setGridData(response.data || []);
  };

  const handleSaveCallback = (response) => {
    console.log('Save completed:', response);
    if (response.succeeded) {
      // 저장 후 재조회
      gridRef.current?.doSearch();
    }
  };

  return (
    <div>
      <form id="searchForm">
        <input type="text" name="keyword" placeholder="검색어" />
      </form>
      
             <GridBuilder
         ref={gridRef}
         gridId="sampleGrid"
         config={gridConfig}
         resizable={true}
         onInit={handleGridInit}
         onSearchCallback={handleSearchCallback}
         onSaveCallback={handleSaveCallback}
       />
    </div>
  );
};

export default MyComponent;`;

export default function SampleGridBuilder() {
  const gridRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [gridData, setGridData] = useState(sampleData);
  const [eventLogs, setEventLogs] = useState<string[]>([]);

  // 이벤트 로그 추가 함수
  const addEventLog = (eventType: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${eventType}${data ? `: ${JSON.stringify(data)}` : ''}`;
    setEventLogs(prev => [logMessage, ...prev.slice(0, 29)]); // 최대 30개 로그 유지
  };

  // 그리드 설정
  const gridConfig = {
    id: 'sampleGridBuilder',
    columns: gridColumns,
    data: gridData,
    rowHeaders: [{ type: 'checkbox' }, { type: 'rowNum' }],
    bodyHeight: 400,
    scrollX: true,
    scrollY: true,
    editingEvent: 'click',
    rowBtnType: {
      rowAdd: true,
      rowDel: true,
      rowUpdate: true,
      rowExcelAll: true,
      excelFileName: 'sample_data.xlsx'
    },
    keywordSearch: true,
    pagingable: true,
    rows: [10, 20, 50],
    rowsPerPage: 10,
    // Mock actions - 실제 프로젝트에서는 실제 API 엔드포인트로 변경
    action: '/api/sample/search',
    saveAction: '/api/sample/save',
    excelAction: '/api/sample/excel',
    form: 'sampleSearchForm',
    resizeOptions: {
      showButton: true,
      minHeight: 300,
      maxHeight: 600,
      step: 50
    }
  };

  // 이벤트 핸들러
  const handleGridInit = (grid: any) => {
    addEventLog('그리드 초기화', { totalRows: gridData.length });
  };

  const handleSearchCallback = (response: any) => {
    addEventLog('검색 완료', { resultCount: response.data?.length || 0 });
    if (response.data) {
      setGridData(response.data);
    }
  };

  const handleSaveCallback = (response: any) => {
    addEventLog('저장 완료', { succeeded: response.succeeded });
    if (response.succeeded) {
      // 저장 후 재조회
      gridRef.current?.doSearch();
    }
  };

  const handleRegPopCallback = () => {
    addEventLog('등록 팝업 호출');
    alert('등록 팝업을 여시겠습니까?\n(실제 구현에서는 모달 또는 새 창이 열립니다)');
  };

  const handleAddAfterCallback = () => {
    addEventLog('행 추가 후 콜백');
  };

  const handleDeleteBeforeCallback = () => {
    addEventLog('삭제 전 콜백');
    return confirm('정말 삭제하시겠습니까?');
  };

  const handleSaveBeforeCallback = () => {
    addEventLog('저장 전 콜백');
    return confirm('변경사항을 저장하시겠습니까?');
  };

  // 코드 복사 함수
  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // 이벤트 로그 클리어 함수
  const clearEventLogs = () => {
    setEventLogs([]);
  };

  return (
    <div className="sample">
      <h2>GridBuilder 컴포넌트 사용 가이드</h2>
      {/* 어드민 그리드 샘플 보기 버튼 */}
      <div className="sampleViewButton">
        <button
          type="button"
          onClick={() => {
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.EX_GRID_BUILDER_EXAMPLE}`;
            window.open(
              popupUrl,
              '_blank',
              'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no'
            );
          }}
          className="btnBlue"
          style={{
          }}
        >레이아웃 보기 (header/left 포함 새창)
        </button>
        <button
          type="button"
          onClick={() => {
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.EX_GRID_BUILDER_EXAMPLE}?popup=true`;
            window.open(
              popupUrl,
              '_blank',
              'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no'
            );
          }}
          className="btnGreen"
        >레이아웃 보기 (새창)
        </button>
      </div>
      {/* 컴포넌트 개요 */}
      <div className="sampleInfo">
        <h3>📖 컴포넌트 개요</h3>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px', border: '1px solid #bee5eb' }}>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            <strong>GridBuilder</strong>는 TUI Grid를 기반으로 한 고급 데이터 그리드 컴포넌트입니다.<br />
            자동 CRUD 기능, Excel 다운로드, 검색, 페이징, 툴바 등의 고급 기능을 제공합니다.
          </p>
        </div>
      </div>

      {/* 주요 특징 */}
      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>자동 CRUD:</strong> 설정만으로 추가/수정/삭제 기능 제공</li>
            <li><strong>Excel 다운로드:</strong> 내장된 Excel 내보내기 기능</li>
            <li><strong>검색 기능:</strong> 키워드 검색 및 필터링</li>
            <li><strong>페이징:</strong> 서버사이드 페이징 지원</li>
            <li><strong>유효성 검사:</strong> 필수 필드 및 데이터 타입 검증</li>
            <li><strong>커스텀 에디터:</strong> 다양한 입력 타입 지원</li>
            <li><strong>이벤트 콜백:</strong> 각 단계별 콜백 함수 제공</li>
            <li><strong>높이 리사이즈:</strong> 드래그로 그리드 높이 동적 조절</li>
          </ul>
        </div>
      </div>

      {/* Props 설명 */}
      <div className="sampleInfo">
        <h3>🔧 Props 상세 설명</h3>

        <h4>기본 Props</h4>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>Props</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>타입</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>필수여부</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>gridId</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>string</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', color: '#dc3545' }}>필수</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>그리드의 고유 ID</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>config</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>GridConfig</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', color: '#dc3545' }}>필수</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>그리드 설정 객체</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>ref</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>GridBuilderRef</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', color: '#28a745' }}>선택</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>그리드 제어를 위한 ref</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>resizable</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>boolean</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', color: '#28a745' }}>선택</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>그리드 높이 리사이즈 기능 활성화 여부</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>이벤트 콜백 Props</h4>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>콜백</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>타입</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'left' }}>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onInit</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>(grid: Grid) =&gt; void</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>그리드 초기화 완료 시</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onSearchCallback</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>(response: any) =&gt; void</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>검색 완료 시</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onSaveCallback</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>(response: any) =&gt; void</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>저장 완료 시</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onRegPopCallback</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>() =&gt; void</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>등록 팝업 호출 시</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onDeleteBeforeCallback</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>() =&gt; boolean</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>삭제 전 검증</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>onSaveBeforeCallback</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>() =&gt; boolean</td>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>저장 전 검증</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Config 설정 */}
      <div className="sampleInfo">
        <h3>⚙️ Config 설정 상세</h3>

        <h4>필수 설정</h4>
        <div className="codeBlock" style={{ marginBottom: '15px' }}>
          <SyntaxHighlighter language="typescript" style={atomOneDark} wrapLongLines>
            {`const gridConfig = {
  id: 'myGrid',                    // 그리드 고유 ID
  columns: [                       // 컬럼 정의
    {
      name: 'id',                  // 컬럼명
      header: 'ID',                // 헤더 표시명
      width: 80,                   // 컬럼 너비
      align: 'center',             // 정렬 (left, center, right)
      editable: false,             // 편집 가능 여부
      required: false              // 필수 입력 여부
    },
    {
      name: 'name',
      header: '이름*',             // * 표시로 필수 표시
      width: 120,
      editable: true,
      required: true,              // 필수 필드 설정
      editor: {
        type: 'text'               // 에디터 타입
      }
    }
  ],
  data: [],                        // 초기 데이터
  form: 'searchFormId'             // 검색폼 ID
};`}
          </SyntaxHighlighter>
        </div>

        <h4>기능 설정</h4>
        <div className="codeBlock" style={{ marginBottom: '15px' }}>
          <SyntaxHighlighter language="typescript" style={atomOneDark} wrapLongLines>
            {`// 행 헤더 설정
rowHeaders: [
  { type: 'checkbox' },            // 체크박스
  { type: 'rowNum' }               // 행 번호
],

// 버튼 설정
rowBtnType: {
  rowAdd: true,                    // 추가 버튼
  rowDel: true,                    // 삭제 버튼
  rowUpdate: true,                 // 저장 버튼
  rowExcelAll: true,               // Excel 다운로드
  excelFileName: 'data.xlsx',      // Excel 파일명
  rowRegPop: {                     // 등록 팝업
    action: '/register',
    winname: 'regPop',
    width: 800,
    height: 600
  }
},

// 검색 및 페이징
keywordSearch: true,               // 키워드 검색
pagingable: true,                  // 페이징 사용
rows: [10, 20, 50, 100],          // 페이지 크기 옵션
rowsPerPage: 10,                   // 기본 페이지 크기

 // API 엔드포인트
 action: '/api/search',             // 검색 URL
 saveAction: '/api/save',           // 저장 URL
 excelAction: '/api/excel',         // Excel 다운로드 URL
 
 // 리사이즈 설정
 resizable: true,                   // 높이 리사이즈 기능 사용
 resizeOptions: {
   showButton: true,                // 리사이즈 버튼 표시
   minHeight: 200,                  // 최소 높이
   maxHeight: 800,                  // 최대 높이
   step: 50                         // 리사이즈 단위
 }`}
          </SyntaxHighlighter>
        </div>

        <h4>에디터 타입별 설정</h4>
        <div className="codeBlock" style={{ marginBottom: '15px' }}>
          <SyntaxHighlighter language="typescript" style={atomOneDark} wrapLongLines>
            {`// 텍스트 입력
editor: {
  type: 'text',
  options: {
    maxLength: 50,                 // 최대 입력 길이
    dataType: 'number'             // 숫자만 입력
  }
},

// 선택박스
editor: {
  type: 'select',
  options: {
    listItems: [
      { text: '표시명1', value: 'value1' },
      { text: '표시명2', value: 'value2' }
    ]
  }
},

 // 날짜 입력
 editor: {
   type: 'datePicker',
   options: {
     format: 'yyyy-MM-dd'
   }
 }`}
          </SyntaxHighlighter>
        </div>

        <h4>리사이즈 설정</h4>
        <div className="codeBlock" style={{ marginBottom: '15px' }}>
          <SyntaxHighlighter language="typescript" style={atomOneDark} wrapLongLines>
            {`// 그리드 높이 리사이즈 설정
const gridConfig = {
  // ...기타 설정들
  
  // 방법 1: config에서 설정
  resizable: true,                   // 리사이즈 기능 활성화
  resizeOptions: {
    showButton: true,                // 리사이즈 버튼 표시 여부
    minHeight: 300,                  // 최소 높이 (px)
    maxHeight: 800,                  // 최대 높이 (px)
    step: 50                         // 리사이즈 단위 (px)
  }
};

// 방법 2: props로 제어 (config보다 우선)
<GridBuilder
  gridId="myGrid"
  config={gridConfig}
  resizable={true}                   // props로 리사이즈 제어
  onInit={handleInit}
/>`}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Ref 메서드 */}
      <div className="sampleInfo">
        <h3>🎯 Ref 메서드</h3>
        <div className="codeBlock" style={{ marginBottom: '15px' }}>
          <SyntaxHighlighter language="typescript" style={atomOneDark} wrapLongLines>
            {`const gridRef = useRef(null);

// 그리드 인스턴스 가져오기
const grid = gridRef.current?.getGrid();

// 행 추가
gridRef.current?.addRow();

// 선택된 행 삭제
gridRef.current?.deleteSelectedRows();

// 그리드 데이터 저장
gridRef.current?.saveGridData();

// 검색 실행
gridRef.current?.searchGridData();

 // 검색 실행 (별칭)
 gridRef.current?.doSearch();
 
 // 그리드 높이 설정
 gridRef.current?.setHeight(500);`}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* 실제 데모 */}
      <div className="sampleInfo">
        <h3>🎯 실제 동작 데모</h3>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ color: '#495057', marginBottom: '10px' }}>✨ 데모 기능</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>행 체크:</strong> 체크박스로 다중 선택 가능</li>
            <li><strong>인라인 편집:</strong> 셀 클릭으로 즉시 편집</li>
            <li><strong>필수 필드 검증:</strong> * 표시된 필드는 필수 입력</li>
            <li><strong>CRUD 버튼:</strong> 추가/삭제/저장 버튼 제공</li>
            <li><strong>키워드 검색:</strong> 우측 상단 검색창으로 실시간 검색</li>
            <li><strong>Excel 다운로드:</strong> 현재 데이터를 Excel로 내보내기</li>
            <li><strong>높이 리사이즈:</strong> 그리드 하단 핸들로 드래그하여 높이 조절</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <GridBuilder
              ref={gridRef}
              gridId="sampleGridBuilder"
              config={gridConfig}
              resizable={true}
              onInit={handleGridInit}
              onSearchCallback={handleSearchCallback}
              onSaveCallback={handleSaveCallback}
              onRegPopCallback={handleRegPopCallback}
              onAddAfterCallback={handleAddAfterCallback}
              onDeleteBeforeCallback={handleDeleteBeforeCallback}
              onSaveBeforeCallback={handleSaveBeforeCallback}
            />
          </div>

          {/* 이벤트 모니터 */}
          <div style={{
            width: '300px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '15px',
            height: '600px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>🔍 이벤트 모니터</h4>
              <button
                onClick={clearEventLogs}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>

            <div style={{
              height: '520px',
              overflowY: 'auto',
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'Consolas, Monaco, monospace'
            }}>
              {eventLogs.length === 0 ? (
                <div style={{ color: '#718096', textAlign: 'center', marginTop: '20px' }}>
                  이벤트 로그가 없습니다.<br />
                  그리드의 버튼들을 클릭해보세요.
                </div>
              ) : (
                eventLogs.map((log, index) => (
                  <div key={index} style={{
                    marginBottom: '5px',
                    padding: '3px 0',
                    borderBottom: '1px solid #4a5568',
                    color: '#e2e8f0',
                    lineHeight: '1.4'
                  }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 사용 예제 코드 */}
      <div className="sampleInfo">
        <h3>📄 완전한 구현 예제</h3>
        <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px', border: '1px solid #c3e6cb' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>
            <strong>💡 참고:</strong> 아래 코드는 실제 프로젝트에서 사용할 수 있는 완전한 예제입니다.
          </p>
        </div>

        <div className="codeBlock">
          <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
            {sampleCode}
          </SyntaxHighlighter>
          <button
            onClick={() => handleCopy(sampleCode)}
            type='button'
            className='copyButton'
          >
            {copied ? "복사됨!" : "코드 복사"}
          </button>
        </div>
      </div>

      {/* 트러블슈팅 */}
      <div className="sampleInfo">
        <h3>🔧 자주 묻는 질문 및 트러블슈팅</h3>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ color: '#495057', marginBottom: '10px' }}>❓ 자주 묻는 질문</h4>
          <div style={{ fontSize: '14px' }}>
            <strong>Q: API 엔드포인트가 없어도 사용할 수 있나요?</strong><br />
            A: 네, action/saveAction/excelAction을 제거하고 data prop만으로도 클라이언트 사이드 그리드로 사용 가능합니다.
            <br /><br />

            <strong>Q: 커스텀 에디터를 만들 수 있나요?</strong><br />
            A: 네, CustomTextEditor 클래스를 참고하여 자신만의 에디터를 만들 수 있습니다.
            <br /><br />

            <strong>Q: 페이징을 비활성화할 수 있나요?</strong><br />
            A: pagingable: false로 설정하면 모든 데이터가 한 페이지에 표시됩니다.
            <br /><br />

            <strong>Q: Excel 다운로드 파일명을 동적으로 변경할 수 있나요?</strong><br />
            A: excelFileName 설정을 변경하거나 서버에서 Content-Disposition 헤더로 제어할 수 있습니다.
            <br /><br />

            <strong>Q: 그리드 높이 리사이즈가 동작하지 않아요!</strong><br />
            A: resizable={true} props를 설정하고, config.resizeOptions.showButton이 true인지 확인하세요.
          </div>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeaa7' }}>
          <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ 주의사항</h4>
          <div style={{ fontSize: '14px' }}>
            <strong>폼 ID 필수:</strong> 검색 기능을 사용하려면 form 속성에 지정된 ID의 폼이 있어야 합니다.<br />
            <strong>API 응답 형식:</strong> 서버 API는 {`{ succeeded: boolean, data: [], total: number, message: string }`} 형식으로 응답해야 합니다.<br />
            <strong>컬럼 name 중복 금지:</strong> 모든 컬럼의 name은 고유해야 합니다.<br />
            <strong>필수 필드 검증:</strong> required: true 설정 시 저장 전 자동으로 검증됩니다.<br />
            <strong>리사이즈 제한:</strong> minHeight와 maxHeight 범위 내에서만 리사이즈가 가능합니다.
          </div>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '5px', border: '1px solid #bee5eb' }}>
          <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>💡 성능 최적화 팁</h4>
          <div style={{ fontSize: '14px' }}>
            <strong>대용량 데이터:</strong> 서버사이드 페이징을 사용하여 한 번에 로드하는 데이터 양을 제한하세요.<br />
            <strong>복잡한 렌더러:</strong> 커스텀 렌더러 사용 시 성능을 고려하여 최적화하세요.<br />
            <strong>이벤트 최적화:</strong> 콜백 함수에서 무거운 작업은 debouncing을 적용하세요.<br />
            <strong>메모리 관리:</strong> 컴포넌트 언마운트 시 그리드 인스턴스가 자동으로 정리됩니다.
          </div>
        </div>
      </div>
    </div>
  );
} 