"use client";
import React, { useState } from "react";
import BoardAccordion from "@/app/common/components/template/boardAccordion";
import { faqData } from "@/sample/data/faq";
import MzTabs from "@/app/common/components/molecule/mzTabs";
import MzInputText from "@/app/common/components/atom/mzInputText";
import ServiceLinkCard from "@/app/common/components/organism/serviceLinkCard";

export default function FaqPage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };
  const [searchValue, setSearchValue] = useState("");
  const faqItems = faqData.map((item) => ({
    question: item.question,
    answer: item.answer.replace(/\\n/g, "<br/>"),
    category: item.category,
  }));

  const multiOpen = false;
  const tabData = [
    {
      label: "사이버보안",
      content: (
        <BoardAccordion
          items={faqItems}
          multiOpen={multiOpen}
          searchValue={searchValue}
        />
      ),
    },
    {
      label: "산업보안",
      content: (
        <BoardAccordion
          items={faqItems}
          multiOpen={multiOpen}
          searchValue={searchValue}
        />
      ),
    },
    {
      label: "ADT캡스",
      content: (
        <ServiceLinkCard
          title="우리 매장을 지키는 스마트 상업용 보안"
          subtitle="서비스가 궁금하다면?"
          description="지금 바로 ADT캡스로 이동해서 확인해보세요."
          buttonText="ADT캡스 FAQ 바로가기"
          logo="icon__adt-logo"
          buttonHref="./"
          imageSrc="/images/sk/faq_adt_thumnail.png"
          color="#003594"
        />
      ),
    },
    {
      label: "캡스홈",
      content: (
        <ServiceLinkCard
          title="우리 가족을 지키는 스마트 홈보안"
          subtitle="서비스가 궁금하다면?"
          description="지금 바로 캡스홈으로 이동해서 확인해보세요."
          buttonText="가정용 홈보안 FAQ 바로가기"
          logo="icon__home-logo"
          buttonHref="./"
          imageSrc="/images/sk/faq_home_thumnail.png"
          color="#025AFC"
        />
      ),
    },
  ];

  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">자주 하는 질문</h2>
      </div>
      <div className="notice-wrapper">
        <MzInputText
          style={{ width: 700 }}
          placeholder="제목이나 키워드로 검색해 보세요."
          search
          onSearch={onSearchHandler}
        />
      </div>
      <MzTabs tabs={tabData} tabSize={true} solid={true} />
    </div>
  );
}
