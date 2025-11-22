"use client";
import React, { useState } from "react";
import MzInputText from "@/app/common/components/atom/mzInputText";
import BoardDownLoadImage from "@/app/common/components/template/boardDownLoadImage";
import useResponsiveColumns from "@/hooks/useResponsiveColumns";
import MzTabs from "@/app/common/components/molecule/mzTabs";
import ServiceLinkCard from "@/app/common/components/organism/serviceLinkCard";

export default function DataPage() {
  const columns = useResponsiveColumns({
    desktop: 3,
    tablet: 2,
    mobile: 1,
  });
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };
  const [searchValue, setSearchValue] = useState("");
  const tabData = [
    {
      label: "사이버보안",
      content: (
        <BoardDownLoadImage
          columns={columns}
          gap={32}
          searchValue={searchValue}
        />
      ),
    },
    {
      label: "산업보안",
      content: (
        <BoardDownLoadImage
          columns={columns}
          gap={32}
          searchValue={searchValue}
        />
      ),
    },
    {
      label: "ADT캡스",
      content: (
        <ServiceLinkCard
          subtitle={`스마트 보안의\n 모든 것을 한 눈에`}
          description={`스마트 출입보안부터 AI CCTV, 긴급 출동 서비스까지,\n 브로셔 한 권에 담긴 보안의 모든 해답을 지금 확인해 보세요.`}
          buttonText="ADT캡스 브로셔 바로가기"
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
          subtitle={`스마트 홈보안, 집을 지키는\n가장 똑똑한 방법`}
          description={`실시간 감시·출입 제어·이상 감지까지,\n스마트 기술이 당신의 집을 안전하게 지켜줍니다.`}
          buttonText="캡스홈 브로셔 바로가기"
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
        <h2 className="top__title">자료실</h2>
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
