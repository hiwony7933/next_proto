import React, { useEffect, useRef, useState } from 'react';
import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import '../../admin/assets/adminStyle.scss';
import '../assets/sample.scss';

import MzButton from '@/components/ui/mzButton';
import MzInputText from '@/components/form/mzInputText';
import MzSelectBox from '@/components/form/mzSelectBox';

// 1. 헤더명 객체 분리
const headers = {
  templateNo: '템플릿번호',
  templateName: '*템플릿명',
  templateDesc: '*템플릿 설명',
  templateType: '*템플릿 유형',
  regCorner: '등록된 코너수',
  regExhibit: '전시코너등록',
  regUser: '등록자',
  regDate: '등록일시',
  modUser: '수정자',
  modDate: '수정일시',
};

// 2. 컬럼 정의에서 header: headers[컬럼명] 사용
const baseColumns = [
  { name: 'templateNo', header: headers.templateNo, width: 120 },
  { name: 'templateName', header: headers.templateName, width: 180, editor: { type: 'text' }, align: 'left' as const, validation: { required: true } },
  { name: 'templateDesc', header: headers.templateDesc, width: 250, editor: { type: 'text' }, align: 'left' as const, validation: { required: true } },
  {
    name: 'templateType', header: headers.templateType, width: 120, editor: {
      type: 'select', options: {
        listItems: [
          { text: '카테고리', value: '카테고리' },
          { text: '기획전', value: '기획전' },
          { text: '카상카테고리', value: '카상카테고리' },
        ]
      }
    }, validation: { required: true }
  },
  { name: 'regCorner', header: headers.regCorner, width: 120 },
  { name: 'regExhibit', header: headers.regExhibit, width: 120 },
  { name: 'regUser', header: headers.regUser, width: 90 },
  { name: 'regDate', header: headers.regDate, width: 110 },
  { name: 'modUser', header: headers.modUser, width: 90 },
  { name: 'modDate', header: headers.modDate, width: 110 },
];
const columns = baseColumns.map(col => col.align ? col : { ...col, align: 'center' as const });

function getSampleData(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    templateNo: `TMP${(i + 1).toString().padStart(3, '0')}`,
    templateName: `템플릿명${i + 1}`,
    templateDesc: `템플릿 설명${i + 1}`,
    templateType: ['카테고리', '기획전', '카상카테고리'][i % 3],
    regCorner: Math.floor(Math.random() * 10),
    regExhibit: '등록',
    regUser: `user${i + 1}`,
    regDate: `2024-06-${(i % 30 + 1).toString().padStart(2, '0')}`,
    modUser: `user${i + 1}`,
    modDate: `2024-06-${(i % 30 + 1).toString().padStart(2, '0')}`,
  }));
}

const data: any[] = getSampleData(20);

const SampleList = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<Grid | null>(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(baseColumns.map(col => col.name));
  const [perPage, setPerPage] = useState(10);
  const [gridData, setGridData] = useState(data);

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

  // 컬럼 show/hide
  const handleColumnToggle = (name: string) => {
    if (!gridInstance.current) return;
    if (visibleColumns.includes(name)) {
      gridInstance.current.hideColumn(name);
      setVisibleColumns(visibleColumns.filter(col => col !== name));
    } else {
      gridInstance.current.showColumn(name);
      setVisibleColumns([...visibleColumns, name]);
    }
  };

  // 등록 버튼 클릭 시 row 추가
  const handleAddRow = () => {
    gridInstance.current?.appendRow({
      templateNo: '', templateName: '', templateDesc: '', templateType: '',
      regCorner: '', regExhibit: '', regUser: '', regDate: '', modUser: '', modDate: ''
    });
  };

  return (
    <div className="sample">
      {/* 그리드 랩 */}
      <div className="mzGridWrap">
        {/* [01] 그리드 헤더 영역 */}
        <div className="gridHeader">
          {/** button */}
          <div className="gridLeft">
            <MzButton size="1" fill="black" onClick={handleAddRow}>추가</MzButton>
            <MzButton size="1" fill="black">삭제</MzButton>
            <MzButton size="1" fill="black">수정</MzButton>
          </div>
          {/* 검색 */}
          <div className="gridRight">
            <div className="mzGridPage">
              <MzSelectBox
                options={["5", "10", "20", "50", "100"]}
                selected={perPage.toString()}
                onSelect={v => setPerPage(Number(v))}
                size="1"
              />
            </div>
            <div className="gridSearch">
              <MzInputText
                mzSize="1"
                placeholder="검색어 입력"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
              <button type="button" className="btnSearch" onClick={handleSearch}>검색</button>
            </div>
            <div className="gridSetting">
              <MzSelectBox
                type="checkbox"
                className="gridSettingCheckbox"
                options={baseColumns.map(col => col.header)}
                selected={baseColumns.filter(col => visibleColumns.includes(col.name)).map(col => col.header)}
                onSelect={(value) => {
                  const selectedHeaders = Array.isArray(value) ? value : [value];
                  const selectedNames = baseColumns.filter(col => selectedHeaders.includes(col.header)).map(col => col.name);

                  // 실제 그리드 컬럼 show/hide
                  if (gridInstance.current) {
                    baseColumns.forEach(col => {
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
          </div>
        </div>
        {/* [02] 그리드 리스트 영역 */}
        <div className="gridList" ref={gridRef} />
        {/* [03] 선택된 셀 개수 */}
        <div className="gridCheckedCount">선택된 셀의 개수: {checkedCount}</div>
      </div>
      {/* 그리드 랩 끝 */}
    </div>
  );
};

export default SampleList;