"use client";
import React, { useState } from "react";
import S from "./page.module.scss";
import Banner from "@/app/common/components/organism/banner";
import CtaBanner from "@/app/sk/components/ctaBanner";
import MzInputText from "@/app/common/components/atom/mzInputText";
import MzRadioGroup from "@/app/common/components/atom/mzRadioGroup";
import HeroBannerSwiper from "@/app/common/components/organism/heroBannerSwiper";
import HeroBannerSwiperM from "@/app/common/components/organism/heroBannerSwiperM";
import useBreakpoint from "@/hooks/useBreakpoint";
import ImageListNotice from "@/app/common/components/template/imageListNotice";

export default function SecurityNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const { isMobile, isTablet } = useBreakpoint();
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
  const data = [
    {
      id: 1,
      // category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      desc: "SK쉴더스의 EQST, 글로벌 최초로 신종 랜섬웨어 취약점 발견… 복호화 도구 무료 제공 \n- ‘ArgonWiper’ 분석한 프로파일링 보고서 배포… 유사구조 랜섬웨어 복호화 연구 활성화 기여",

      label: "new",
      thumbnailData: {
        image: "/images/sk/thumbnail_1.png",
        type: "video",
        videoUrl: "https://youtu.be/EdnyDhlEPk0?si=V8kWMiSNen9GuY79",
      },
    },
    {
      id: 2,
      // category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      desc: "SK쉴더스의 EQST, 글로벌 최초로 신종 랜섬웨어 취약점 발견… 복호화 도구 무료 제공 \n- ‘ArgonWiper’ 분석한 프로파일링 보고서 배포… 유사구조 랜섬웨어 복호화 연구 활성화 기여",

      label: "new",
      thumbnailData: {
        image: "/images/sk/thumbnail_2.png",
        type: "blog",
      },
    },
    {
      id: 3,
      // category: "보안이슈 & 인사이트",
      title:
        "보안이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.이슈 & 인사이트를 확인하세요.",
      date: "2025-01-01",
      desc: "SK쉴더스의 EQST, 글로벌 최초로 신종 랜섬웨어 취약점 발견… 복호화 도구 무료 제공 \n- ‘ArgonWiper’ 분석한 프로파일링 보고서 배포… 유사구조 랜섬웨어 복호화 연구 활성화 기여",

      label: "",
      thumbnailData: {
        image: "/images/sk/thumbnail_3.png",
        type: "webinar",
      },
    },
  ];
  const slideData = [
    {
      id: 1,
      // category: "INSIGHTS",
      title:
        "SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향",
      desc: "랜섬웨어 남의 일이 아닙니다.1 데이터 유출과 업무 중단을 막기 위해터 유출과 업무 중단을 막기 위해터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      date: "2025-10-01",
      imageSrc: "/images/sk/swpier01.png",
    },
    {
      id: 2,
      // category: "NEWS",
      title: "Shadow AI: 제조업 기빌 보호를 위한 \n탐지·통제·거버넌스 전략",
      desc: "랜섬웨어 남의 일이 아닙니다.2 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      date: "2025-10-08",
      imageSrc: "/images/sk/swpier02.png",
    },
    {
      id: 3,
      // category: "REPORT",
      title: "제로트러스트 도입 체크리스트 10",
      desc: "랜섬웨어 남의 일이 아닙니다.3 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      date: "2025-10-15",
      imageSrc: "/images/sk/swpier03.png",
    },
    {
      id: 4,
      // category: "CASE STUDY",
      title: "대기업 A사의 전사 보안 고도화 사례",
      desc: "랜섬웨어 남의 일이 아닙니다.4 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      date: "2025-10-22",
      imageSrc: "/images/sk/swpier04.png",
    },
    {
      id: 5,
      // category: "WHITEPAPER",
      title: "AI 위협 인텔리전스 활용 전략",
      desc: "랜섬웨어 남의 일이 아닙니다.5 데이터 유출과 업무 중단을 막기 위해 꼭 알아야 할 5가지 실전 대응법을 알려드립니다.",
      date: "2025-10-29",
      imageSrc: "/images/sk/swpier05.png",
    },
  ];
  const handleCategoryClick = (v: string) => {
    console.log("category:", v);
  };
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };

  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">사이버보안 뉴스</h2>
      </div>
      {isMobile || isTablet ? (
        <HeroBannerSwiperM data={slideData} />
      ) : (
        <HeroBannerSwiper data={slideData} />
      )}
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
        data={data}
        basePath="/sk/insights/securityNews"
        searchValue={searchValue}
      />
      <CtaBanner data={ctaBannerData} />
    </div>
  );
}
