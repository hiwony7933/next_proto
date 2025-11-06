"use client";
import React, { useState } from "react";
import MzInputText from "@/app/common/components/atom/mzInputText";
import { listNoticeData } from "@/sample/data/listNotice";
import BoardList from "@/app/common/components/template/boardList";

export default function AnnouncementPage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">전자공고</h2>
      </div>
      <div className="notice-wrapper">
        <MzInputText
          style={{ width: 700 }}
          placeholder="제목이나 키워드로 검색해 보세요."
          search
          onSearch={onSearchHandler}
        />
      </div>
      <BoardList
        items={listNoticeData}
        basePath="/sk/about/announcement"
        searchValue={searchValue}
      />
    </div>
  );
}
