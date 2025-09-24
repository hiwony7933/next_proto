"use client";
import React from "react";
import MzInputText from "@/app/common/components/form/mzInputText";
import { aboutNoticeData } from "@/sample/data/aboutNotice";
import ListNotice from "@/app/sk/components/common/listNotice";

export default function NoticePage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
  };

  const items = aboutNoticeData;

  return (
    <div>
      <MzInputText
        mzSize="5"
        placeholder="제목이나 키워드로 검색해 보세요."
        style={{ width: 500, margin: "33px auto" }}
        onSearch={onSearchHandler}
      />
      <ListNotice
        items={items}
        basePath="/sk/about/notice"
        columnWidths={["70%", "30%"]}
      />
    </div>
  );
}
