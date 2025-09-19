import React, { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const basicUsageCode = `// /src/admin/layout/defaultLayout.tsx - AdminDefaultLayout 컴포넌트 내부 구조
<div className="adminDefaultLayout">
  {/* 상단 헤더 */}
  <AdminHeader 
    onMenuChange={handleMenuChange}
    currentMenuType={currentMenuType}
  />
  
  <div className="adminWrap">
    {/* 좌측 사이드바 */}
    <AdminLeftMenu 
      menuType={currentMenuType}
      onAddTab={addTab}
    />
    
    <div className="adminContent">
      {/* 탭 영역 */}
      {tabs.length > 0 && (
        <ul className="pageTab">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button className={activeTabId === tab.id ? 'active' : ''}>
                {tab.title}
                <span className="closeTab" onClick={() => closeTab(tab.id)}>×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* 실제 페이지 컨텐츠가 렌더링되는 영역 */}
      <div className="pageContent">
        {children || <Outlet />}
      </div>
    </div>
  </div>
</div>

// 사용법: React Router와 함께
<Route path="/admin" element={<AdminDefaultLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="display/corner" element={<CornerMgt />} />
</Route>`;

const routerSetupCode = `// /src/admin/App.tsx - Admin 컴포넌트와 라우터 연결 파일
import { Routes, Route } from 'react-router-dom';
import AdminDefaultLayout from '@/admin/layout/defaultLayout';//레이아웃 컴포넌트
import Dashboard from '@/admin/pages/Dashboard';
import CornerMgt from '@/admin/pages/display/CornerMgt';

<Routes>
  <Route path="/admin" element={<AdminDefaultLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="display/corner" element={<CornerMgt />} />
    <Route path="mgmt/user" element={<UserMgt />} />
  </Route>
</Routes>`;

const tabManagementCode = `interface TabInfo {
  id: string;
  title: string;
  path: string;
}

// 탭 추가
const addTab = (tabInfo: TabInfo) => {
  const existingTab = tabs.find(tab => tab.path === tabInfo.path);
  
  if (existingTab) {
    // 이미 존재하면 해당 탭을 활성화
    setActiveTabId(existingTab.id);
    navigate(existingTab.path);
  } else {
    // 새 탭 생성
    const newTab = {
      ...tabInfo,
      id: \`tab-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    navigate(newTab.path);
  }
};

// 탭 닫기
const closeTab = (tabId: string) => {
  const updatedTabs = tabs.filter(tab => tab.id !== tabId);
  setTabs(updatedTabs);
  
  if (activeTabId === tabId && updatedTabs.length > 0) {
    const newActiveTab = updatedTabs[updatedTabs.length - 1];
    setActiveTabId(newActiveTab.id);
    navigate(newActiveTab.path);
  }
};`;

const sessionStorageCode = `const STORAGE_KEY = {
  TABS: 'admin-tabs',
  ACTIVE_TAB_ID: 'admin-active-tab-id',
  MENU_TYPE: 'admin-menu-type'
};

// 세션 저장
const saveTabsToStorage = (tabs, activeId, menuType) => {
  sessionStorage.setItem(STORAGE_KEY.TABS, JSON.stringify(tabs));
  sessionStorage.setItem(STORAGE_KEY.ACTIVE_TAB_ID, activeId);
  sessionStorage.setItem(STORAGE_KEY.MENU_TYPE, menuType);
};

// 세션 로드
const loadTabsFromStorage = () => {
  const storedTabs = sessionStorage.getItem(STORAGE_KEY.TABS);
  const storedActiveTabId = sessionStorage.getItem(STORAGE_KEY.ACTIVE_TAB_ID);
  const storedMenuType = sessionStorage.getItem(STORAGE_KEY.MENU_TYPE);
  
  return {
    tabs: storedTabs ? JSON.parse(storedTabs) : [],
    activeTabId: storedActiveTabId || '',
    menuType: storedMenuType || 'main'
  };
};`;

const contextMenuCode = `// 컨텍스트 메뉴 처리
const handleContextMenu = (e: React.MouseEvent, menuItem: { title: string; path: string }) => {
  e.preventDefault();
  setContextMenu({
    visible: true,
    x: e.clientX,
    y: e.clientY,
    menuItem
  });
};

// 새창으로 열기
const handlePopup = () => {
  if (contextMenu.menuItem) {
    const popupUrl = \`\${contextMenu.menuItem.path}?popup=true\`;
    window.open(popupUrl, '_blank', 'width=1200,height=800');
    closeContextMenu();
  }
};

// 즐겨찾기 추가/해제
const handleFavorite = () => {
  if (contextMenu.menuItem) {
    const newFavorites = favorites.includes(contextMenu.menuItem.path)
      ? favorites.filter(fav => fav !== contextMenu.menuItem!.path)
      : [...favorites, contextMenu.menuItem.path];
    
    setFavorites(newFavorites);
    localStorage.setItem('adminMenuFavorites', JSON.stringify(newFavorites));
    closeContextMenu();
  }
};`;

const popupModeCode = `// /src/admin/layout/defaultLayout.tsx - AdminDefaultLayout 컴포넌트 내, 팝업모두 구현
const isPopupMode = searchParams.get('popup') === 'true';

// 팝업 모드일 때는 header와 left menu 없이 content만 표시
if (isPopupMode) {
  return (
    <div className="adminDefaultLayout">
      <div className="popupContent">
        {children || <Outlet />}
      </div>
    </div>
  );
}`;

const menuRouterCode = `// 1단계: /src/admin/routers/routePath.ts - Admin 라우터 경로 상수 정의
export const ADMIN_ROUTE_PATH = {
  HOME: '',
  SAMPLE_LIST: 'list',
  AI_PAGE: 'aiPage',
  // 전시관리 관련 경로
  DISPLAY_TEMPLETE_MGT: 'display/templeteMgt',
  DISPLAY_CORNER_MGT: 'display/cornerMgt',
  DISPLAY_CATEGORY_MGT: 'display/categoryMgt',
  DISPLAY_PREVIEW_INDEX: 'display/previewIndex',
  // 관리기능 관련 경로
  MGMT_USER_MGT: 'mgmt/userMgt',
  MGMT_CODE_MGT: 'mgmt/codeMgt',
  MGMT_ADMIN_LOG_MGT: 'mgmt/adminLogMgt',
  MGMT_USER_ACCESS_LOG_MGT: 'mgmt/userAccessLogMgt',
  MGMT_MENU_MGT: 'mgmt/menuMgt',
  MGMT_GROUP_MENU_MGT: 'mgmt/groupMenuMgt',
};

// 2단계: /src/admin/App.tsx - Admin 라우터와 컴포넌트 연결
import { Routes, Route } from 'react-router-dom';
import { ADMIN_ROUTE_PATH } from './routers/routePath';
import AdminDefaultLayout from './layout/defaultLayout';
import CornerMgt from './pages/display/cornerMgt';
import UserMgt from './pages/mgmt/userMgt';

<Routes>
  <Route path="/admin" element={<AdminDefaultLayout />}>
    <Route index element={<Dashboard />} />
    <Route path={ADMIN_ROUTE_PATH.DISPLAY_CORNER_MGT} element={<CornerMgt />} />
    <Route path={ADMIN_ROUTE_PATH.MGMT_USER_MGT} element={<UserMgt />} />
    {/* ... 기타 admin 라우트들 */}
  </Route>
</Routes>
`;

export default function SampleAdminDefaultLayout() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [demoTabs, setDemoTabs] = useState([
    { id: 'tab1', title: '대시보드', path: '/admin', active: true },
    { id: 'tab2', title: '코너관리', path: '/admin/display/corner', active: false },
    { id: 'tab3', title: '사용자관리', path: '/admin/mgmt/user', active: false }
  ]);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const addToLog = (message: string) => {
    setActionLog(prev => [message, ...prev.slice(0, 9)]);
  };

  const handleTabClick = (tabId: string) => {
    setDemoTabs(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
    addToLog(`📋 탭 전환: ${demoTabs.find(tab => tab.id === tabId)?.title}`);
  };

  const handleTabClose = (tabId: string) => {
    setDemoTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (newTabs.length > 0 && prev.find(tab => tab.id === tabId)?.active) {
        newTabs[newTabs.length - 1].active = true;
      }
      return newTabs;
    });
    addToLog(`❌ 탭 닫기: ${demoTabs.find(tab => tab.id === tabId)?.title}`);
  };

  const handleLeftMenuToggle = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
    addToLog(`🎯 좌측메뉴 ${isLeftMenuOpen ? '닫기' : '열기'}`);
  };

  const clearLog = () => {
    setActionLog([]);
  };

  return (
    <div className="sample">
      <h2>🏗️ Admin Default Layout 컴포넌트 가이드</h2>

      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>다중 탭 지원</strong>: 여러 페이지를 탭으로 관리하며 세션 저장 지원</li>
          <li><strong>메뉴 타입 관리</strong>: 대시보드, 전시관리, 관리기능 3가지 메뉴 타입</li>
          <li><strong>좌측 메뉴</strong>: 접기/펼치기, 즐겨찾기, 좌측메뉴 컨텍스트 메뉴 기능</li>
          <li><strong>팝업 모드</strong>: URL 파라미터로 헤더/사이드바 없는 팝업 모드 지원</li>
          <li><strong>세션 관리</strong>: 새로고침 후에도 탭 상태 유지</li>
        </ul>
      </div>

      <div className="sampleInfo">
        <h3>🏛️ 구조 설명</h3>
        <table>
          <thead>
            <tr>
              <th>영역</th>
              <th>컴포넌트</th>
              <th>주요 기능</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Header</strong></td>
              <td><code>AdminHeader</code></td>
              <td>로고, 메뉴 타입 선택, 로그아웃</td>
            </tr>
            <tr>
              <td><strong>Left Menu</strong></td>
              <td><code>AdminLeftMenu</code></td>
              <td>메뉴 네비게이션, 즐겨찾기, 컨텍스트 메뉴</td>
            </tr>
            <tr>
              <td><strong>Tab</strong></td>
              <td><code>pageTab</code></td>
              <td>탭 추가/전환/닫기, 세션 저장</td>
            </tr>
            <tr>
              <td><strong>Content</strong></td>
              <td><code>pageContent</code></td>
              <td>실제 페이지 컨텐츠 렌더링</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>🎮 라이브 데모</h3>

        {/* 탭 데모 */}
        <div style={{ marginBottom: 24 }}>
          <h4>📋 탭 관리 데모</h4>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: 4,
            backgroundColor: '#f8f9fa',
            padding: 16
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: 12 }}>
              {demoTabs.map(tab => (
                <div
                  key={tab.id}
                  style={{
                    padding: '8px 16px',
                    borderBottom: tab.active ? '2px solid #007bff' : '2px solid transparent',
                    backgroundColor: tab.active ? '#fff' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span>{tab.title}</span>
                  {demoTabs.length > 1 && (
                    <span
                      style={{
                        fontSize: 16,
                        color: '#999',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTabClose(tab.id);
                      }}
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 4 }}>
              <p>활성 탭: <strong>{demoTabs.find(tab => tab.active)?.title}</strong></p>
              <p>경로: <code>{demoTabs.find(tab => tab.active)?.path}</code></p>
            </div>
          </div>
        </div>

        {/* 좌측 메뉴 데모 */}
        <div style={{ marginBottom: 24 }}>
          <h4>📁 좌측 메뉴 데모</h4>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
              width: isLeftMenuOpen ? 250 : 50,
              border: '1px solid #ddd',
              borderRadius: 4,
              backgroundColor: '#f8f9fa',
              padding: 8,
              transition: 'width 0.3s'
            }}>
              <button
                onClick={handleLeftMenuToggle}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  marginBottom: 8
                }}
              >
                {isLeftMenuOpen ? '◀ 닫기' : '▶'}
              </button>

              {isLeftMenuOpen && (
                <div style={{ padding: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>대시보드</strong>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>전시관리</strong>
                    <div style={{ marginLeft: 16, fontSize: 14 }}>
                      <div style={{ padding: '4px 0', cursor: 'pointer' }}>📊 코너관리</div>
                      <div style={{ padding: '4px 0', cursor: 'pointer' }}>📋 템플릿관리</div>
                    </div>
                  </div>
                  <div>
                    <strong>관리기능</strong>
                    <div style={{ marginLeft: 16, fontSize: 14 }}>
                      <div style={{ padding: '4px 0', cursor: 'pointer' }}>👥 사용자관리</div>
                      <div style={{ padding: '4px 0', cursor: 'pointer' }}>⚙️ 코드관리</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 액션 로그 */}
        <div style={{ marginBottom: 24 }}>
          <h4>📋 액션 로그</h4>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: 4,
            backgroundColor: '#f8f9fa',
            padding: 16,
            height: 200,
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>최근 액션</strong>
              <button
                onClick={clearLog}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                로그 지우기
              </button>
            </div>
            {actionLog.length === 0 ? (
              <p style={{ color: '#999', fontStyle: 'italic' }}>아직 액션이 없습니다. 위의 탭이나 메뉴를 조작해보세요.</p>
            ) : (
              <div>
                {actionLog.map((log, index) => (
                  <div key={index} style={{
                    padding: '4px 8px',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    marginBottom: 4,
                    fontSize: 14
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sampleInfo">
        <h3>📝 섹션별 코드 예제</h3>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { id: 'overview', label: '기본 사용법 (레이아웃 컴포넌트)' },
              { id: 'router', label: '라우터 설정' },
              { id: 'menuRouter', label: '메뉴-라우터 연결' },
              { id: 'tabs', label: '탭 관리' },
              { id: 'session', label: '세션 저장' },
              { id: 'context', label: '컨텍스트 메뉴' },
              { id: 'popup', label: '팝업 모드' }
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
                <h6 className="codeTitle">🚀 기본 사용법 (레이아웃 컴포넌트)</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {basicUsageCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'router' && (
              <div className="codeBlock">
                <h6 className="codeTitle">🛣️ 라우터 설정</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {routerSetupCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'menuRouter' && (
              <div className="codeBlock">
                <h6 className="codeTitle">🔗 메뉴-라우터 연결</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {menuRouterCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'tabs' && (
              <div className="codeBlock">
                <h6 className="codeTitle">📋 탭 관리</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {tabManagementCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'session' && (
              <div className="codeBlock">
                <h6 className="codeTitle">💾 세션 저장</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {sessionStorageCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'context' && (
              <div className="codeBlock">
                <h6 className="codeTitle">📱 컨텍스트 메뉴(좌측메뉴 오른쪽마우스 클릭 기능)</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {contextMenuCode}
                </SyntaxHighlighter>
              </div>
            )}

            {activeSection === 'popup' && (
              <div className="codeBlock">
                <h6 className="codeTitle">🪟 팝업 모드</h6>
                <SyntaxHighlighter language="javascript" style={atomOneDark}>
                  {popupModeCode}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sampleInfo">
        <h3>💡 사용 팁</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>메뉴-라우터 연결</strong>: routePath.ts에서 경로 상수를 정의하고, App.tsx에서 라우터 설정, 메뉴에서 해당 상수를 참조하여 연결합니다.</li>
          <li><strong>탭 관리</strong>: 메뉴 클릭 시 자동으로 탭이 추가되며, 중복 탭은 생성되지 않습니다.</li>
          <li><strong>세션 유지</strong>: 새로고침 후에도 열린 탭과 활성 탭이 유지됩니다.</li>
          <li><strong>컨텍스트 메뉴</strong>: 메뉴 항목 우클릭으로 새창 열기, 즐겨찾기 추가 가능합니다.</li>
          <li><strong>팝업 모드</strong>: ?popup=true 파라미터로 헤더/사이드바 없는 팝업 모드 지원합니다.</li>
          <li><strong>메뉴 타입</strong>: 헤더의 메뉴 타입 버튼으로 좌측 메뉴를 동적으로 변경할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
} 