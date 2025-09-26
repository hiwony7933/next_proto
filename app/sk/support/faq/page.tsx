"use client";
import React from "react";
import CornerFaq001 from "@/app/common/components/corner/cornerFaq001";
import { faqData } from "@/sample/data/faq";
import MzTabs from "@/app/common/components/ui/mzTabs";
import MzInputText from "@/app/common/components/form/mzInputText";
import S from "./page.module.scss";
import CornerBanner003 from "@/app/common/components/corner/cornerBanner003";

export default function FaqPage() {
  const faqItems = faqData.map((item) => ({
    question: item.question,
    answer: item.answer.replace(/\\n/g, "<br/>"),
    category: item.category,
  }));
  const wrapClassName = "faqType01";
  const multiOpen = false;
  const totalVisible = true;
  const totalPrefix = "'보안'검색결과";
  const totalUnit = "건";
  const tabData = [
    {
      label: "정보보안",
      content: (
        <CornerFaq001
          items={faqItems}
          wrapClassName={wrapClassName}
          multiOpen={multiOpen}
          totalVisible={totalVisible}
          totalPrefix={totalPrefix}
          totalUnit={totalUnit}
        />
      ),
    },
    { label: "시설보안", content: <div>시설보안 내용</div> },
    { label: "캡스홈", content: <div>캡스홈 내용</div> },
    { label: "무인경비", content: <div>무인경비 내용</div> },
  ];

  const onSearchHandler = (q: string) => {
    console.log("search:", q);
  };
  const data = {
    cornerTitle: "CTA 배너",
    designType: "type01",
    textList: [
      {
        title: "지금 무료 견적을 받아보세요!",
        desc: "견적 신청하기",
        linkUrl: "https://example.com/estimate",
        target: true,
      },
    ],
  };
  return (
    <div className={S.faqPage}>
      <MzInputText
        mzSize="5"
        placeholder="제목이나 키워드로 검색해 보세요."
        style={{ width: 500, margin: "33px auto" }}
        onSearch={onSearchHandler}
      />
      <MzTabs tabs={tabData} tabSize={true} solid={false} />
      <CornerBanner003 data={data} />
    </div>
  );
}
