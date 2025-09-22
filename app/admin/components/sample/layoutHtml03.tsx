import React, { useState } from 'react';

import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import MzBtnResize from '../common/mzBtnResize';//리사이즈 버튼 컴포넌트
import { LayoutSearch } from './layoutSearch';
import { LayoutGrid } from './layoutGride';


export default function AdminLayoutHtml03() {
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
        <div className="mzBox mzLeft" style={{ width: `${leftWidth}px` }}>
          <AdminTitle title="타이틀 컴포넌트 사용" />
          {/* 그리드 영역 샘플 */}
          <LayoutGrid />
          {/* 그리드 영역 샘플 */}
          <MzBtnResize
            title={"드레그리사이즈"}
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