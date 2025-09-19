export const codeLayoutHtml01 = `// /src/admin/components/sample/layoutHtml01.tsx - Search + List 레이아웃 컴포넌트
import React, { useState, lazy, useEffect, Suspense } from 'react';

import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import { LayoutGrid } from './layoutGride';//그리드  영역(레이아웃 버전)  컴포넌트
import { LayoutSearch } from './layoutSearch';//검색 영역(레이아웃 버전)  컴포넌트

export default function AdminLayoutHtml01() {
  return (
    <>
      {/* [01] 검색영역 - 검색 레이아웃 참고 */}
      <LayoutSearch />
      {/* [02] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        <AdminTitle title="타이틀 컴포넌트 사용" />
        {/* 그리드 영역 샘플 */}
        <LayoutGrid />
        {/* 그리드 영역 샘플 */}
      </div>
    </>
  );
}`;

export const codeLayoutHtml02 = `// /src/admin/components/sample/layoutHtml02.tsx - 2컬럼 리사이즈 레이아웃
import React, { useState } from 'react';

import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import MzBtnResize from '../common/mzBtnResize';//리사이즈 버튼 컴포넌트
import { LayoutSearch } from './layoutSearch';
import { LayoutGrid } from './layoutGride';


export default function AdminLayoutHtml02() {
  // 좌측 영역 width 상태
  const [leftWidth, setLeftWidth] = useState(200);
  // 리사이즈 버튼의 width 변경 핸들러
  const handleWidthChange = (newWidth: number) => {
    setLeftWidth(newWidth);
  };

  return (
    <>
      {/* [01] 검색영역 */}
      <LayoutSearch />
      {/* [02] 레이아웃-02 : 그리드영역 */}
      <div className="mzGridLayout02">
        <div className="mzBox mzLeft" style={{ width: \`\${leftWidth}px\` }}>
          <AdminTitle title="타이틀 컴포넌트 사용" />
          {/* 그리드 영역 샘플 */}
          <LayoutGrid />
          {/* 그리드 영역 샘플 */}
          <MzBtnResize
            title={"드레그리사이즈"}
            direction="horizontal"
            initialWidth={leftWidth}
            minWidth={100}
            maxWidth={600}
            onWidthChange={handleWidthChange}
            showText={false}
          />
        </div>
        <div className="mzBox mzRight">
          <AdminTitle title="타이틀 컴포넌트 사용" />
          {/* 그리드 영역 샘플 */}
          <LayoutGrid />
          {/* 그리드 영역 샘플 */}
        </div>

      </div>
    </>
  );
}
`;

export const codeResizeComponents = `// /src/admin/components/common/mzBtnResize.tsx - 리사이즈 버튼 컴포넌트 사용법
import MzBtnResize from '../common/mzBtnResize';

// 1. 가로(Width) 리사이즈 - 기본값
<MzBtnResize
  direction="horizontal"          // 방향 설정 (기본값: 'horizontal')
  initialWidth={leftWidth}        // 초기 너비값
  minWidth={100}                  // 최소 너비 (기본값: 100)
  maxWidth={600}                  // 최대 너비 (기본값: 600)
  onWidthChange={handleWidthChange} // 너비 변경 시 콜백
  className="btnColResize"        // CSS 클래스 (선택사항)
  showText={false}               // 텍스트 표시 여부 (기본값: true)
/>

// 2. 세로(Height) 리사이즈
<MzBtnResize
  direction="vertical"            // 세로 방향 리사이즈
  initialHeight={gridHeight}      // 초기 높이값
  minHeight={200}                 // 최소 높이 (기본값: 200)
  maxHeight={800}                 // 최대 높이 (기본값: 800)
  onHeightChange={handleHeightChange} // 높이 변경 시 콜백
  showText={false}               // 텍스트 숨김
  buttonText="⇅"                 // 커스텀 버튼 텍스트
/>

// 3. 텍스트 표시 버전 (가로)
<MzBtnResize
  title="사이드바 크기"
  direction="horizontal"
  initialWidth={300}
  onWidthChange={(width) => setSidebarWidth(width)}
  showText={true}
  buttonText="사이드바 조정"
/>

// 4. 텍스트 표시 버전 (세로)  
<MzBtnResize
  title="그리드 높이"
  direction="vertical"
  initialHeight={400}
  onHeightChange={(height) => setGridHeight(height)}
  showText={true}
  buttonText="그리드 높이 조절"
/>
`;


export const codeLayoutSearch = `// /src/admin/components/sample/layoutSearch.tsx - 검색 영역 구조
import React, { useState } from 'react';
import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import MzButton from '@/components/ui/mzButton';//[공통]버튼 컴포넌트
import MzAlert from '@/components/ui/mzAlert';//[공통]알림 컴포넌트
import MzInputText from '@/components/form/mzInputText';//[공통]입력 컴포넌트
import MzSelectBox from '@/components/form/mzSelectBox';//[공통]셀렉트 컴포넌트
import { MzDateRangePicker } from '@/components/form/mzDateRangePicker';//[공통]날짜 범위 선택 컴포넌트

//검색영역 (레이아웃 버전) 컴포넌트
export const LayoutSearch = () => {
  const [isFormShowHide, setIsFormShowHide] = useState(false);//검색영역 토글 상태 변수
  const [select, setSelect] = useState('전체');//검색 구분(셀렉트)
  const [date, setDate] = useState<[any, any]>([null, null]);//검색 기간
  // 날짜 유효성 검사 핸들러
  const handleDateValidationError = (error: string) => {
    // 필요시 에러 처리 (알림, 로그 등)
    console.warn('날짜 유효성 검사 에러:', error);
    // MzAlert.alert(error); // 필요하다면 알림으로 표시
  };
  // Search form handlers from AdminSearchLayout
  const handleReset = () => {
    MzAlert.alert('초기화 처리');
    return;
  };
  // 샘플 onSearch 함수
  const handleSearch = (query: string) => {
    // 실제 검색 로직은 여기에 구현
    console.log('검색어:', query);
  };

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={\`layoutSearch\${isFormShowHide ? ' mzFormShowHide' : ''}\`}>
        {/* 제목 및 토글 버튼 */}
        <AdminTitle
          title={"페이지 제목"}
          showHide={true}                    // 검색 영역 토글 기능 활성화
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        
        {/* 검색 폼 */}
          <div className="searchForm">
            <table>
            {/* 컬럼 너비 설정 */}
              <colgroup>
                <col width="100px" />
                <col width="300px" />
                <col width="100px" />
                <col width="300px" />
              </colgroup>
              <tbody>
                <tr>
                  <th><span className="required">전시 기간</span></th>
                  <td colSpan={3}>
                    <MzDateRangePicker
                      value={date}
                      onChange={setDate}
                      showQuickButtons={true}
                      noticeText=""
                      onValidationError={handleDateValidationError}
                      autoValidate={true}
                    />
                  </td>
                </tr>
                <tr>
                  <th>구분</th>
                  <td>
                    <MzSelectBox size="2" type="dropdown" className="dropdown" options={["전체", "전시", "미전시"]} selected={select}
                      style={{ width: '160px' }}
                      onSelect={v => setSelect(typeof v === 'string' ? v : v[0])} />
                  </td>
                  <th>이름</th>
                  <td>
                    <MzInputText
                      mzSize="2"
                      placeholder={"검색어를 입력해주세요."}
                      maxLength={100}
                      minLength={1}
                      required={true}
                      style={{ width: '250px' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 액션 버튼 */}
          <div className="searchActionButton">
            <MzButton stroke="black" onClick={handleReset}>초기화</MzButton>
            <MzButton fill="black" onClick={handleSearch}>검색</MzButton>
          </div>
        </div>
    </>
  );
}`;


export const codeLayoutGrid = `// /src/admin/components/sample/layoutGride.tsx - 그리드 영역 구조
import React, { useEffect, useRef, useState } from 'react';
import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import MzButton from '@/components/ui/mzButton';//[공통]버튼 컴포넌트
import MzAlert from '@/components/ui/mzAlert';//[공통]알림 컴포넌트
// 1. 헤더명 객체 분리
// 2. 컬럼 정의에서 header: headers[컬럼명] 사용
// 3. 컬럼 정의
// 그리드 영역(레이아웃 버전) 컴포넌트
export const LayoutGrid = ({ title }: { title?: string }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<Grid | null>(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(baseColumns.map(col => col.name));
  const [perPage, setPerPage] = useState(10);
  const [gridData, setGridData] = useState(data);

  const gridLeftBtn: Array<'add' | 'delete' | 'modify'> = ['add', 'delete', 'modify'];
  const BUTTON_LABELS: Record<'add' | 'delete' | 'modify', string> = {
    add: '추가',
    delete: '삭제',
    modify: '수정',
  };

  useEffect(() => {
    if (gridRef.current && !gridInstance.current) {
      gridInstance.current = new Grid({
        el: gridRef.current,
        data: gridData,
        columns,
        bodyHeight: 300,
        rowHeaders: [{ type: 'checkbox' }, { type: 'rowNum' }],
        scrollX: true,
        scrollY: true,
        minBodyHeight: 200,
        header: { height: 30 },
        editingEvent: 'click',
        pageOptions: {
          useClient: true,
          perPage,
        },
      });

      gridInstance.current.on('check', () => {
        setCheckedCount(gridInstance.current!.getCheckedRows().length);
      });
      gridInstance.current.on('uncheck', () => {
        setCheckedCount(gridInstance.current!.getCheckedRows().length);
      });
      gridInstance.current.on('checkAll', () => {
        setCheckedCount(gridInstance.current!.getCheckedRows().length);
      });
      gridInstance.current.on('uncheckAll', () => {
        setCheckedCount(gridInstance.current!.getCheckedRows().length);
      });
    }
    return () => {
      gridInstance.current?.destroy();
      gridInstance.current = null;
    };
  }, [perPage, gridData]);

  // 검색
  const handleSearch = () => {
    const filtered = data.filter(row =>
      Object.values(row).some(val =>
        String(val).includes(search)
      )
    );
    setGridData(filtered);
    gridInstance.current?.resetData(filtered);
  };

  // 등록 버튼 클릭 시 row 추가
  const handleAddRow = () => {
    gridInstance.current?.appendRow({
      templateNo: '', templateName: '', templateDesc: '', templateType: '',
      regCorner: '', regExhibit: '', regUser: '', regDate: '', modUser: '', modDate: ''
    });
  };

  // 버튼 클릭 핸들러
  const handleLeftBtnClick = async (btn: 'add' | 'delete' | 'modify') => {
    if (!gridInstance.current) return;
    switch (btn) {
      case 'add':
        handleAddRow();
        break;
      case 'delete':
        const result = await MzAlert.confirm('삭제하시겠습니까?');
        if (result.isConfirmed) {
          const checkedRows = gridInstance.current.getCheckedRows();
          checkedRows.forEach(row => {
            gridInstance.current!.removeRow(row.rowKey);
          });
        }
        break;
      case 'modify':
        // 수정 버튼 클릭 시 동작 (빈 함수)
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* 그리드 랩 */}
      <div className="mzGridWrap">
        {/* [01] 그리드 헤더 영역 */}
        <div className="gridHeader">
          {/** button */}
          <div className="gridLeft">
            {gridLeftBtn.map(btn => (
              <MzButton key={btn} size="1" fill="black" onClick={() => handleLeftBtnClick(btn)}>{BUTTON_LABELS[btn]}</MzButton>
            ))}
          </div>
        </div>
        {/* [02] 그리드 리스트 영역 */}
        <div className="gridList" ref={gridRef} />
        {/* [03] 선택된 셀 개수 */}
        <div className="gridCheckedCount">선택된 셀의 개수: {checkedCount}</div>
      </div>
      {/* 그리드 랩 끝 */}
    </>
  );
};
`;