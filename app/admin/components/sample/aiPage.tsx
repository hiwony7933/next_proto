import React, { useState, lazy, useEffect, Suspense } from 'react';
import MzAdminGrid from '../common/mzAdminGrid';
import AdminTitle from '../common/adminTitle';
import MzButton from '@/components/ui/mzButton';
import MzAlert from '@/components/ui/mzAlert';
import MzSelectBox from '@/components/form/mzSelectBox';
import { MzDateRangePicker } from '@/components/form/mzDateRangePicker';
import MzInputText from '@/components/form/mzInputText';
import { MzModal } from '@/components/ui/mzModal';
import styles from './aiPage.module.scss';

// 1. 헤더명 객체 분리
const headers = {
  templateNo: '코너번호',
  templateName: '*코너명',
  templateDesc: '*코너 설명',
  templateType: '*코너 유형',
  regCorner: '등록된 코너수',
  regExhibit: '전시코너등록',
  regUser: '등록자',
  regDate: '등록일시',
  modUser: '수정자',
  modDate: '수정일시',
};

const templateNames = [
  '[BANNER01] title + subTitle + image',
  '[BANNER02] title + subTitle + image',
  '[FAQ01] faq 기능',
  '[CATEGORY01] image + a - 태그 안에 title + subtitle',
  '[CATEGORY02] a - 태그 안에 title + subtitle + image',
  '[BLOG01] a - 이미지 + text',
  '[BLOCK01] title + list(TEXT)',
];

function getSampleData(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    templateNo: `TMP${(i + 1).toString().padStart(3, '0')}`,
    templateName: i < templateNames.length ? templateNames[i] : `템플릿명${i + 1}`,
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

const initialData = getSampleData(20);

// Custom renderer for TUI Grid (not React element!)
class TemplateNoButtonRenderer {
  el: HTMLButtonElement;
  constructor(props: any) {
    const el = document.createElement('button');
    el.textContent = props.value;
    el.style.color = 'blue';
    el.style.textDecoration = 'underline';
    el.style.background = 'none';
    el.style.border = 'none';
    el.style.cursor = 'pointer';
    el.onclick = () => {
      window.dispatchEvent(new CustomEvent('open-corner-modal', { detail: props.value }));
    };
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

export default function AiPage() {
  const [perPage, setPerPage] = useState(10);
  const [gridData, setGridData] = useState(initialData);
  const [nextId, setNextId] = useState(initialData.length + 1);
  const [showHide, setShowHide] = useState(false);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  // Search form states from AdminSearchLayout
  const [date, setDate] = useState<[any, any]>([null, null]);
  const [select, setSelect] = useState('전체');
  const [text, setText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplateNo, setSelectedTemplateNo] = useState<string | null>(null);

  const gridLeftBtn: Array<'add' | 'delete' | 'modify'> = ['add', 'delete', 'modify'];

  const baseColumns = [
    {
      name: 'templateNo',
      header: headers.templateNo,
      width: 120,
      renderer: { type: TemplateNoButtonRenderer },
    },
    { name: 'templateName', header: headers.templateName, width: 200, editor: { type: 'text' }, align: 'left' as const, validation: { required: true } },
    { name: 'templateDesc', header: headers.templateDesc, width: 150, editor: { type: 'text' }, align: 'left' as const, validation: { required: true } },
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

  const cornerComponentMap: Record<string, any> = {
    TMP001: React.lazy(() => import('@/guide/corner/sampleCornerBanner001')),
    TMP002: React.lazy(() => import('@/guide/corner/sampleCornerBanner002')),
    TMP003: React.lazy(() => import('@/guide/corner/sampleCornerFaq001')),
    // ... 나머지도 추가
  };

  // Search form handlers from AdminSearchLayout
  const handleReset = () => {
    setDate([null, null]);
    setSelect('전체');
    setText('');
  };

  const handleSearch = () => {
    if (!text) {
      MzAlert.alert('검색어를 입력해주세요!');
      return;
    }
    MzAlert.alert(
      `날짜: ${date[0]} ~ ${date[1]}\n전시대상: ${select}\n검색어: ${text}`
    );
    // 실제 검색 로직이 필요하다면 아래처럼 사용
    // setGridData(initialData.filter(row =>
    //   Object.values(row).some(val => String(val).includes(text))
    // ));
  };

  const handleDateValidationError = (error: string) => {
    // 필요시 에러 처리 (알림, 로그 등)
    console.warn('날짜 유효성 검사 에러:', error);
    // MzAlert.alert(error); // 필요하다면 알림으로 표시
  };

  const handleAddRow = () => {
    const newRow = {
      id: nextId,
      templateNo: '', templateName: '', templateDesc: '', templateType: '',
      regCorner: 0, regExhibit: '', regUser: '', regDate: '', modUser: '', modDate: ''
    };
    setGridData(prev => [...prev, newRow]);
    setNextId(id => id + 1);
  };

  useEffect(() => {
    const handler = (e: any) => {
      setSelectedTemplateNo(e.detail);
      setModalOpen(true);
    };
    window.addEventListener('open-corner-modal', handler);
    return () => window.removeEventListener('open-corner-modal', handler);
  }, []);

  return (
    <>
      <div className={`layoutSearch${isFormShowHide ? ' mzFormShowHide' : ''}`}>
        <AdminTitle
          title={"AI 기본 페이지"}
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        <div className="searchForm">
          <table>
            <colgroup>
              <col width="100px" />
              <col width="300px" />
              <col width="100px" />
              <col width="*" />
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
                <th>전시 대상</th>
                <td>
                  <MzSelectBox size="2" type="dropdown" className="dropdown" options={["전체", "전시", "미전시"]} selected={select}
                    onSelect={v => setSelect(typeof v === 'string' ? v : v[0])} />
                </td>
                <th>전시 코너명</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    placeholder={"검색어를 입력해주세요."}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    maxLength={100}
                    minLength={1}
                    required={true}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>초기화</MzButton>
          <MzButton fill="black" onClick={handleSearch}>검색</MzButton>
        </div>
      </div>
      <AdminTitle title="샘플 리스트" />
      <MzAdminGrid
        columns={baseColumns}
        data={gridData}
        setData={setGridData}
        perPage={perPage}
        gridLeftBtn={gridLeftBtn}
        pageSizeYN={true}
        gridSearchYN={true}
        gridSettingYN={true}
        onSearch={handleSearch}
        onCreateRow={handleAddRow}
        onDeleteRows={(ids) => {
          setGridData(prev => prev.filter(row => !ids.includes(row.id)));
        }}
      />
      {/* 모달 렌더링 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedTemplateNo || '코너 미리보기'} wrapClassName={styles.cornerModal}>
        <Suspense fallback={<div>로딩중...</div>}>
          {selectedTemplateNo && cornerComponentMap[selectedTemplateNo] ? (
            React.createElement(cornerComponentMap[selectedTemplateNo])
          ) : (
            <div>해당 코너 컴포넌트가 없습니다.</div>
          )}
        </Suspense>
      </MzModal>
    </>
  );
}