import React, { useState } from 'react';
import { ADMIN_ROUTE_PATH, ADMIN_BASE_PATH } from '../../admin/routers/routePath';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeLayoutHtml02, codeLayoutSearch, codeResizeComponents, codeLayoutGrid } from './layoutCode';//레이아웃 컴포넌트 코드
import MzAlert from '@/components/ui/mzAlert';

import '../assets/sample.scss';



const layoutStructureCode = `// 2컬럼 레이아웃 구조
<div className="mzGridLayout02">
  <div className="mzBox mzLeft" style={{ width: \`\${leftWidth}px\` }}>
    {/* 좌측 고정 너비 영역 */}
    <AdminTitle title="좌측 메뉴" />
    
    {/* 그리드 영역 샘플 */}
    <LayoutGrid />
    {/* 그리드 영역 샘플 */}
    {/* 리사이즈 버튼 */}
    <MzBtnResize
      initialWidth={leftWidth}
      onWidthChange={setLeftWidth}
      showText={false}
    />
  </div>
  
  <div className="mzBox mzRight">
    {/* 우측 가변 너비 영역 (flex: 1) */}
    <AdminTitle title="메인 컨텐츠" />
    {/* 그리드 영역 샘플 */}
    <LayoutGrid />
    {/* 그리드 영역 샘플 */}
  </div>
</div>`;

const stateManagementCode = `// 상태 관리 및 이벤트 처리
// 리사이즈 핸들러
const handleWidthChange = (newWidth: number) => {
  setLeftWidth(newWidth);
  // 필요시 localStorage에 저장하여 사용자 설정 유지
  // localStorage.setItem('leftPanelWidth', newWidth.toString());
};`;

const cssStyleCode = `// mzGridLayout02 스타일 (.scss)
.mzGridLayout02 {
  display: flex;
  align-items: stretch;  // 높이를 동일하게 맞춤
  gap: 20px;            // 좌우 간격
  
  .mzLeft {
    width: 200px;       // 초기 너비 (JavaScript로 동적 변경)
    position: relative; // 리사이즈 버튼 절대 위치를 위함
    min-width: 100px;   // 최소 너비
  }
  
  .mzRight {
    flex: 1;           // 남은 공간 모두 차지
  }
}

// 리사이즈 버튼 스타일
.btnColResize {
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  width: 20px;
  height: 60px;
  border: 1px solid $colorSubDefault;
  cursor: ew-resize;
  // ... 추가 스타일
}`;

export default function SampleLayoutHtml03() {
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [leftWidth, setLeftWidth] = useState(200);
  const [activeSection, setActiveSection] = useState('overview');
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [copiedStates, setCopiedStates] = useState({
    basic: false,
    resize: false,
    layout: false,
    state: false,
    css: false,
    search: false,
    grid: false
  });

  const handleReset = () => {
    MzAlert.alert('초기화 처리');
    addActionLog('초기화 버튼 클릭');
  };

  const handleSearch = () => {
    MzAlert.alert('검색 처리');
    addActionLog('검색 버튼 클릭');
  };

  const handleWidthChange = (newWidth: number) => {
    setLeftWidth(newWidth);
    addActionLog(`좌측 영역 너비 변경: ${newWidth}px`);
  };

  const addActionLog = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`[${timestamp}] ${action}`, ...prev.slice(0, 9)]);
  };

  const handleCopyWithKey = (text: string, key: keyof typeof copiedStates) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };



  return (
    <div className="sample">
      <h2>🔍 Search + List(드레그 리사이즈) + List레이아웃 컴포넌트 가이드</h2>
      {/* 어드민 레이아웃 보기 버튼 */}
      <div className="sampleViewButton">
        <button
          type="button"
          onClick={() => {
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.LAYOUT_HTML02}`;
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
            const popupUrl = `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.LAYOUT_HTML02}?popup=true`;
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
          <li><strong>2컬럼 레이아웃</strong>: 좌측 고정 너비 + 우측 가변 너비</li>
          <li><strong>드래그 리사이즈</strong>: 마우스로 좌측 영역 크기 조정</li>
          <li><strong>높이 자동 맞춤</strong>: flex stretch로 양쪽 높이 동일</li>
          <li><strong>검색 토글</strong>: 검색영역 접기/펼치기 기능</li>
          <li><strong>반응형 지원</strong>: 최소/최대 너비 제한</li>
        </ul>
      </div>

      {/* 네비게이션 */}
      <div className="sampleInfo">
        <h3>📝 섹션별 코드 예제</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { id: 'overview', label: '기본 사용법', },
            { id: 'resize', label: '리사이즈 기능', },
            { id: 'state', label: '상태 관리', },
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

        {/* 섹션별 코드 */}
        <div className="codeExample">
          {activeSection === 'overview' && (
            <div className="codeBlock">
              <h6 className="codeTitle">🏗️ 기본 사용법</h6>
              <button
                onClick={() => handleCopyWithKey(codeLayoutHtml02, 'basic')}
                className="copyButton"
              >
                {copiedStates.basic ? '복사됨!' : '코드 복사'}
              </button>
              <SyntaxHighlighter language="javascript" style={atomOneDark}>
                {codeLayoutHtml02}
              </SyntaxHighlighter>
            </div>
          )}

          {activeSection === 'resize' && (
            <div className="codeBlock">
              <h6 className="codeTitle">🔧 MzBtnResize 컴포넌트 사용법</h6>
              <button
                onClick={() => handleCopyWithKey(codeResizeComponents, 'resize')}
                className="copyButton"
              >
                {copiedStates.resize ? '복사됨!' : '코드 복사'}
              </button>
              <SyntaxHighlighter language="javascript" style={atomOneDark}>
                {codeResizeComponents}
              </SyntaxHighlighter>

              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>💡 Props 설명:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li><code>direction</code>: 리사이즈 방향 ('horizontal' | 'vertical', 기본값: 'horizontal')</li>
                  <li><code>initialWidth</code>: 초기 너비값 (가로 리사이즈 시 필수)</li>
                  <li><code>initialHeight</code>: 초기 높이값 (세로 리사이즈 시 필수)</li>
                  <li><code>onWidthChange</code>: 너비 변경 시 콜백 함수 (가로 리사이즈 시 필수)</li>
                  <li><code>onHeightChange</code>: 높이 변경 시 콜백 함수 (세로 리사이즈 시 필수)</li>
                  <li><code>minWidth/maxWidth</code>: 최소/최대 너비 제한 (가로 리사이즈)</li>
                  <li><code>minHeight/maxHeight</code>: 최소/최대 높이 제한 (세로 리사이즈)</li>
                  <li><code>showText</code>: 버튼 텍스트 표시 여부 (기본값: true)</li>
                  <li><code>buttonText</code>: 커스텀 버튼 텍스트</li>
                  <li><code>className</code>: CSS 클래스명</li>
                </ul>
              </div>
            </div>
          )}


          {activeSection === 'state' && (
            <div className="codeBlock">
              <h6 className="codeTitle">⚙️ 상태 관리 및 이벤트 처리</h6>
              <button
                onClick={() => handleCopyWithKey(stateManagementCode, 'state')}
                className="copyButton"
              >
                {copiedStates.state ? '복사됨!' : '코드 복사'}
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

      {/* 사용 팁 */}
      <div className="sampleInfo">
        <h3>💡 사용 팁 및 주의사항</h3>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h5>✅ 권장사항:</h5>
          <ul style={{ marginLeft: '20px' }}>
            <li>좌측 영역은 <strong>200px ~ 300px</strong> 정도가 적당합니다</li>
            <li>사용자 설정을 <code>localStorage</code>에 저장하여 새로고침 시에도 유지</li>
            <li>모바일에서는 리사이즈 기능을 비활성화하는 것을 권장</li>
            <li>최소/최대 너비를 적절히 설정하여 UI 깨짐 방지</li>
          </ul>

          <h5 style={{ marginTop: '15px' }}>⚠️ 주의사항:</h5>
          <ul style={{ marginLeft: '20px' }}>
            <li>리사이즈 버튼은 <code>position: relative</code>인 부모 요소 내에서 사용</li>
            <li>드래그 중에는 다른 UI 요소와의 상호작용 제한됨</li>
            <li>너무 좁은 너비(&lt;100px)는 콘텐츠 표시에 문제가 될 수 있음</li>
          </ul>

          <h5 style={{ marginTop: '15px' }}>🔧 커스터마이징:</h5>
          <ul style={{ marginLeft: '20px' }}>
            <li>SCSS 변수를 활용하여 색상 테마 변경 가능</li>
            <li><code>gap</code> 속성으로 좌우 간격 조정</li>
            <li>리사이즈 버튼 크기 및 스타일 CSS로 변경 가능</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 