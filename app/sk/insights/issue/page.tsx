"use client";
import React, { useState } from "react";
import S from "./page.module.scss";
import Banner from "@/app/common/components/organism/banner";
import CtaBanner from "@/app/sk/components/ctaBanner";
import MzInputText from "@/app/common/components/atom/mzInputText";
import MzRadioGroup from "@/app/common/components/atom/mzRadioGroup";
import HeroBanner from "@/app/common/components/organism/heroBanner";
import useBreakpoint from "@/hooks/useBreakpoint";
import ImageListNotice from "@/app/common/components/template/imageListNotice";

export default function IssuePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const { isMobile } = useBreakpoint();
  const ctaBannerData = [
    {
      title: "매일 새로워진 보안 위협",
      bottomDesc: "지금 공식 유튜브 SK쉴더스 채널에서 만나보세요.",
      buttonText: "유튜브 채널 더보기",
      linkUrl: "https://example.com/estimate",
      imagePath: "",
      target: true,
    },
    {
      title: "SK쉴더스가 매월 전하는 보안 트렌드와 위협분석 리포트",
      bottomDesc: "지금 구독하고, 누구보다 먼저 보안의 흐름을 읽어보세요.",
      buttonText: "구독 신청",
      linkUrl: "https://example.com/estimate",
      imagePath: "",
      target: true,
    },
  ];
  const dataList = {
    topDesc: `“보안 걱정, 이제 그만하세요!”`,
    title: "사이버보안 솔루션, SK쉴더스의 보안 전문가가 도와드립니다.",
    bottomDesc: "",
    buttonText: "사이버보안 상담하기",
    linkUrl: "https://example.com/estimate",
    imagePath: "",
    direction: "row",
    target: true,
  };
  const categories = [
    { label: "전체", value: "all" },
    { label: "컨설팅", value: "컨설팅" },
    { label: "랜섬웨어", value: "랜섬웨어" },
    { label: "개인정보보호", value: "개인정보보호" },
    { label: "관제", value: "관제" },
    { label: "AI", value: "AI" },
    { label: "중소기업보안", value: "중소기업보안" },
  ];
  const heroBannerData = [
    {
      category: "보안이슈 & 인사이트",
      title: "돈보다 중요한 데이터,\n랜섬웨어부터 지키는 5가지 실전 꿀팁",
      description:
        "랜섬웨어 남의 일이 아닙니다. 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      type: "video",
      image: "/images/sk/thumbnail_1.png",
      date: "2025-01-01",
      id: 1,
      videoUrl: "https://youtu.be/EdnyDhlEPk0?si=V8kWMiSNen9GuY79",
    },
    {
      category: "보안이슈 & 인사이트",
      title: "혹시 우리도 털릴 수 있을까?\n랜섬웨어 대비 체크리스트 공개”",
      description:
        "랜섬웨어 남의 일이 아닙니다. 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      type: "blog",
      image: "/images/sk/thumbnail_2.png",
      date: "2025-04-01",
      id: 2,
      videoUrl: "",
    },
    {
      category: "보안이슈 & 인사이트",
      title: "혹시 우리도 털릴 수 있을까?\n랜섬웨어 대비 체크리스트 공개”",
      description:
        "랜섬웨어 남의 일이 아닙니다. 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      type: "webinar",
      image: "/images/sk/thumbnail_3.png",
      date: "2025-02-01",
      id: 3,
      videoUrl: "",
    },
    {
      category: "랜섬웨어",
      title: "혹시 우리도 털릴 수 있을까?\n랜섬웨어 대비 체크리스트 공개”",
      description:
        "랜섬웨어 남의 일이 아닙니다. 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      type: "video",
      image: "/images/sk/thumbnail_4.png",
      date: "2025-08-01",
      id: 4,
      videoUrl: "https://youtu.be/EdnyDhlEPk0?si=V8kWMiSNen9GuY79",
    },
  ];
  const handleCategoryClick = (v: string) => {
    console.log("category:", v);
  };
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };
  const data = [
    {
      id: 1,
      category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      filter: [
        "보안이슈",
        "랜섬웨어",
        "개인정보보호",
        "관제",
        "AI",
        "중소기업보안",
      ],
      label: "new",
      thumbnailData: {
        image: "/images/sk/thumbnail_1.png",
        type: "video",
        videoUrl: "https://youtu.be/EdnyDhlEPk0?si=V8kWMiSNen9GuY79",
      },
    },
    {
      id: 2,
      category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      filter: [
        "보안이슈",
        "랜섬웨어",
        "개인정보보호",
        "관제",
        "AI",
        "중소기업보안",
      ],
      label: "new",
      thumbnailData: {
        image: "/images/sk/thumbnail_2.png",
        type: "blog",
      },
    },
    {
      id: 3,
      category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      filter: [
        "보안이슈",
        "랜섬웨어",
        "개인정보보호",
        "관제",
        "AI",
        "중소기업보안",
      ],
      label: "",
      thumbnailData: {
        image: "/images/sk/thumbnail_3.png",
        type: "webinar",
      },
    },
  ];
  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">보안이슈 & 인사이트</h2>
        <p className="top__desc">
          전문가의 목소리와 글로 풀어내는 보안 현장의 생생한 이야기들을
          모았습니다.
        </p>
      </div>
      <HeroBanner data={heroBannerData} />
      <Banner data={dataList} />
      <div className="notice-wrapper">
        <MzInputText
          style={{ width: 700 }}
          placeholder="제목이나 키워드로 검색해 보세요."
          search
          onSearch={onSearchHandler}
        />
      </div>
      {categories.length > 0 && (
        <div className={S.faqCategory}>
          <MzRadioGroup
            value={selectedCategory}
            options={[
              ...categories.map((cat) => ({
                label: cat.label,
                value: cat.value,
              })),
            ]}
            onChange={(v) => {
              setSelectedCategory(v);
              handleCategoryClick(v);
            }}
            rounded
            ariaLabel="FAQ 카테고리 선택"
          />
        </div>
      )}
      <ImageListNotice
        basePath="/sk/insights/issue"
        searchValue={searchValue}
        data={data}
      />
      <CtaBanner data={ctaBannerData} />
    </div>
  );
}
