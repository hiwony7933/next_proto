"use client";
import React from "react";
import MzInputText from "@/app/common/components/form/mzInputText";
import MzTabs from "@/app/common/components/ui/mzTabs";
import ImageNotice from "@/app/sk/components/common/imageNotice";
import { newsData } from "@/sample/data/news";
import S from "./page.module.scss";

export default function NewsPage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
  };

  const items = newsData;

  const tabs = [
    {
      label: "전체",
      value: "all",
      content: (
        <ImageNotice
          items={items}
          basePath="/sk/about/news"
          columns={3}
          gap={12}
          itemsPerPage={12}
          renderMetaArea={(item) => (
            <span className={S.imageNotice__date}>{item.date}</span>
          )}
        />
      ),
    },
    { label: "사이버보안", value: "news", content: <div>사이버보안</div> },
    {
      label: "사이버보안 솔루션",
      value: "notice",
      content: <div>사이버보안 솔루션</div>,
    },
    { label: "ADT캡스", value: "notice", content: <div>ADT캡스</div> },
    { label: "캡스홈", value: "notice", content: <div>캡스홈</div> },
  ];

  return (
    <div>
      <div className="notice-wrapper">
        <MzInputText
          mzSize="5"
          placeholder="제목이나 키워드로 검색해 보세요."
          onSearch={onSearchHandler}
          status="search"
        />
      </div>
      <MzTabs tabs={tabs} tabSize={true} solid={true} />
    </div>
  );
}
