import React, { useState } from 'react';
import { ADMIN_ROUTE_PATH, ADMIN_BASE_PATH } from '../../admin/routers/routePath';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeLayoutHtml01, codeLayoutSearch, codeLayoutGrid } from './layoutCode';//레이아웃 컴포넌트 코드

import '../assets/sample.scss';


const stateManagementCode = `// 상태 관리
  const [isFormShowHide, setIsFormShowHide] = useState(false);//검색영역 토글 상태 변수
  const [select, setSelect] = useState('전체');//검색 구분(셀렉트)
  const [date, setDate] = useState<[any, any]>([null, null]);//검색 기간

  // 날짜 유효성 검사 핸들러
  const handleDateValidationError = (error: string) => {
    // 필요시 에러 처리 (알림, 로그 등)
    console.warn('날짜 유효성 검사 에러:', error);
    // MzAlert.alert(error); // 필요하다면 알림으로 표시
  };

// 검색조건 초기화 핸들러
const handleReset = () => {
  MzAlert.alert('초기화 처리');
  // 실제 구현에서는 폼 필드들을 초기값으로 리셋
  return;
};
// 검색 처리 핸들러
const handleSearch = () => {
  MzAlert.alert('검색 처리');
  // 실제 구현에서는 검색 API 호출
  return;
};`;

// 코드 복사 함수
export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

export default function SampleLayoutHtml01() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  // 코드 복사 상태 관리
  const [copiedStates, setCopiedStates] = useState({
    basic: false,
    search: false,
    grid: false,
    state: false,
    css: false
  });
  const handleCopyWithKey = (code: string, key: keyof typeof copiedStates) => {
    handleCopy(code, (copied) => {
      setCopiedStates(prev => ({ ...prev, [key]: copied }));
    });
  };

  return (
    <div className="sample">
      <h2>🔍 Search + List 레이아웃 컴포넌트 가이드</h2>
      {/* 어드민 레이아웃 보기 버튼 */}
      <div className="sampleViewButton">
        <button
          type="button"
          onClick={() => {
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.LAYOUT_HTML01}`;
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
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.LAYOUT_HTML01}?popup=true`;
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
      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>검색 영역 토글</strong>: AdminTitle의 showHide 기능으로 검색 폼 접기/펼치기</li>
          <li><strong>테이블 구조</strong>: 검색 필드를 table로 깔끔하게 정렬</li>
          <li><strong>액션 버튼</strong>: 초기화/검색 버튼 배치</li>
          <li><strong>그리드 영역</strong>: 검색 결과를 표시하는 고정 높이 영역</li>
          <li><strong>반응형 대응</strong>: colgroup으로 컬럼 너비 제어</li>
        </ul>
      </div>



      <div className="sampleInfo">
        <h3>📝 섹션별 코드 예제</h3>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { id: 'overview', label: '기본 사용법' },
              { id: 'state', label: '상태 관리' },
              { id: 'search', label: '[검색] 영역' },
              { id: 'grid', label: '[그리드] 영역' },
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: '8px 16px',
                  border: activeSection === section.id ? '2px solid #007bff' : '1px solid #ddd',
                  backgroundColor: activeSection === section.id ? '#e7f3ff' : '#fff',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div>
            {activeSection === 'overview' && (
              <div className="codeBlock">
                <h6 className="codeTitle">🚀 기본 사용법</h6>
                <button
                  onClick={() => handleCopyWithKey(codeLayoutHtml01, 'basic')}
                  className="copyButton"
                >
                  {copiedStates.basic ? "복사됨!" : "코드 복사"}
                </button>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {codeLayoutHtml01}
                </SyntaxHighlighter>
              </div>
            )}


            {activeSection === 'state' && (
              <div className="codeBlock">
                <h6 className="codeTitle">⚙️ 상태 관리 및 이벤트 처리</h6>
                <button
                  onClick={() => handleCopyWithKey(stateManagementCode, 'state')}
                  className="copyButton"
                >
                  {copiedStates.state ? "복사됨!" : "코드 복사"}
                </button>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {stateManagementCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'search' && (
              <div className="codeBlock">
                <h6 className="codeTitle">🔍 검색 영역 구조</h6>
                <button
                  onClick={() => handleCopyWithKey(codeLayoutSearch, 'search')}
                  className="copyButton"
                >
                  {copiedStates.search ? "복사됨!" : "코드 복사"}
                </button>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {codeLayoutSearch}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'grid' && (
              <div className="codeBlock">
                <h6 className="codeTitle">📊 그리드 영역 구조</h6>
                <button
                  onClick={() => handleCopyWithKey(codeLayoutGrid, 'grid')}
                  className="copyButton"
                >
                  {copiedStates.grid ? "복사됨!" : "코드 복사"}
                </button>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {codeLayoutGrid}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sampleInfo">
        <h3>💡 사용 팁</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>검색 폼 커스터마이징</strong>: table 구조 내에서 다양한 Form 컴포넌트(MzInputText, MzSelectBox 등)를 활용하여 검색 조건을 구성할 수 있습니다.</li>
          <li><strong>그리드 연동</strong>: gridForm 영역에 TUI Grid나 커스텀 테이블 컴포넌트를 연동하여 실제 데이터를 표시할 수 있습니다.</li>
          <li><strong>반응형 대응</strong>: colgroup의 width 값을 조정하여 다양한 화면 크기에 대응할 수 있습니다.</li>
          <li><strong>검색 토글</strong>: showHide 속성을 통해 검색 영역의 접기/펼치기 기능을 제공합니다.</li>
          <li><strong>필수 필드 표시</strong>: required 클래스를 통해 필수 입력 필드를 시각적으로 구분할 수 있습니다.</li>
          <li><strong>액션 버튼 배치</strong>: searchActionButton 영역에 초기화/검색 등 주요 액션 버튼을 배치합니다.</li>
        </ul>
      </div>

    </div>
  );
} 