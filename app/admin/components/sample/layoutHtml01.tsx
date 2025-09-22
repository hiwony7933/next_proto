import React, { useState, lazy, useEffect, Suspense } from 'react';

import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import { LayoutGrid } from './layoutGride';//그리드  영역(레이아웃 버전)  컴포넌트
import { LayoutSearch } from './layoutSearch';//검색 영역(레이아웃 버전)  컴포넌트

export default function AdminLayoutHtml01() {
  return (
    <>
      {/* [01] 검색영역 */}
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
}