"use client";
import React from "react";
import MzInputText from "@/app/common/components/form/mzInputText";
import { listNoticeData } from "@/sample/data/listNotice";
import ListNotice from "@/app/sk/components/common/listNotice";

export default function NoticePage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
  };

  const items = listNoticeData;

  return (
    <div>
      <div className="notice-wrapper">
        <MzInputText
          mzSize="5"
          placeholder="제목이나 키워드로 검색해 보세요."
          status="search"
          onSearch={onSearchHandler}
        />
      </div>
      <ListNotice
        items={items}
        basePath="/sk/support/notice"
        columnWidths={["20%", "70%", "30%"]}
        totalVisible={true}
        selectBoxVisible={true}
      />
    </div>
  );
}
