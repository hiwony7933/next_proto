"use client";
import React, { useState } from "react";
import S from "./page.module.scss";

import MzInputText from "@/app/common/components/atom/mzInputText";
import MzRadioGroup from "@/app/common/components/atom/mzRadioGroup";

import useBreakpoint from "@/hooks/useBreakpoint";
import ImageListNotice from "@/app/common/components/template/imageListNotice";

export default function NewsRoomPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const { isMobile, isTablet } = useBreakpoint();

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
        <h2 className="top__title">뉴스룸</h2>
      </div>

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
        basePath="/sk/about/newsRoom"
        searchValue={searchValue}
      />
    </div>
  );
}
