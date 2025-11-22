"use client";
import React, { useState } from "react";
import S from "./page.module.scss";
import MzTabs from "@/app/common/components/molecule/mzTabs";
import MzInputText from "@/app/common/components/atom/mzInputText";
import Banner from "@/app/common/components/organism/banner";
import BoardDownLoad from "@/app/common/components/template/boardDownLoad";
import HeroBannerSwiper from "@/app/common/components/organism/heroBannerSwiper";
import HeroBannerSwiperM from "@/app/common/components/organism/heroBannerSwiperM";
import useBreakpoint from "@/hooks/useBreakpoint";
import CtaBanner from "@/app/sk/components/ctaBanner";
import Image from "next/image";
import BoardDownLoadList from "@/app/common/components/template/boardDownLoadList";

export default function ReportPage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
    setSearchValue(q);
  };
  const [searchValue, setSearchValue] = useState("");
  const slideData = [
    {
      id: 1,
      category: "INSIGHTS",
      title: "SK쉴더스 보안 리포트 Q4 — 랜섬웨어 동향",
      date: "2025-10-01",
      imageSrc: "/images/sk/swpier01.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 2,
      category: "NEWS",
      title: "Shadow AI: 제조업 기빌 보호를 위한 \n탐지·통제·거버넌스 전략",
      date: "2025-10-08",
      imageSrc: "/images/sk/swpier02.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 3,
      category: "REPORT",
      title: "제로트러스트 도입 체크리스트 10",
      date: "2025-10-15",
      imageSrc: "/images/sk/swpier03.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 4,
      category: "CASE STUDY",
      title: "대기업 A사의 전사 보안 고도화 사례",
      date: "2025-10-22",
      imageSrc: "/images/sk/swpier04.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 5,
      category: "WHITEPAPER",
      title: "AI 위협 인텔리전스 활용 전략",
      date: "2025-10-29",
      imageSrc: "/images/sk/swpier05.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
  ];
  const tabData = [
    {
      label: "EQST 월간리포트",
      content: (
        <BoardDownLoad searchValue={searchValue} basePath="/insights/report" />
      ),
    },
    {
      label: "스페셜 리포트",
      content: <BoardDownLoadList searchValue={searchValue} />,
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

  const bgData = [
    {
      image: "/images/sk/insights_issue_report_bg_icon1.png",
      title: "신기술 연구",
      subTitle: "AI, IoT,\nCloud",
    },
    {
      image: "/images/sk/insights_issue_report_bg_icon2.png",
      title: "보고서 발간",
      subTitle: "최신 해킹\n기법 분석",
    },
    {
      image: "/images/sk/insights_issue_report_bg_icon3.png",
      title: "다수 입상",
      subTitle: "해킹\n방어대회",
    },
  ];
  const { isMobile, isTablet } = useBreakpoint();
  const BackgroundBanner = () => {
    return (
      <div className={`layout__full__container ${S.report__background}`}>
        <div className={`layout__container ${S.report__background__content}`}>
          <div className={`row ${S.report__background__contentRow}`}>
            <div
              className={`col-${isMobile || isTablet ? "12" : "6"} ${S.report__background__contentLeft}`}
            >
              <div className={S.report__background__contentLeft__title}>
                EQST 보안전문가 그룹
              </div>
              <div className={S.report__background__contentLeft__description}>
                QST(Experts, Qualified Security Team, 이큐스트)는 사이버 위협
                분석과 연구 분야에서 검증 받은 최고 수준의 보안 전문가
                그룹입니다. 침해사고 대응, 전략해킹, 취약점 진단, 위협
                인텔리전스 등 사업 수행과 함께 침해위협 연구 활동에 중점을 두고
                있습니다.
              </div>
            </div>
            <div
              className={`col-${isMobile || isTablet ? "12" : "6"} ${S.report__background__contentRight}`}
            >
              <div className="row" style={{ width: "100%" }}>
                {bgData.map((item, index) => (
                  <div
                    key={index}
                    className={`col-4 ${S.report__background__contentRight__item}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={93}
                      height={93}
                    />
                    <div
                      className={
                        S.report__background__contentRight__item__content
                      }
                    >
                      <p className={S.report__background__contentRight__title}>
                        {item.title}
                      </p>
                      <p
                        className={
                          S.report__background__contentRight__description
                        }
                      >
                        {item.subTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="layout__container">
        <div className="top__inner">
          <h2 className="top__title">전문가 리포트</h2>
        </div>
        {isMobile || isTablet ? (
          <HeroBannerSwiperM data={slideData} />
        ) : (
          <HeroBannerSwiper data={slideData} />
        )}
      </div>
      <BackgroundBanner />
      <div className="layout__container">
        <Banner data={dataList} />
        <div className="notice-wrapper">
          <MzInputText
            style={{ width: 700 }}
            placeholder="제목이나 키워드로 검색해 보세요."
            search
            onSearch={onSearchHandler}
          />
        </div>
        <MzTabs tabs={tabData} tabSize={true} solid={true} />
        <CtaBanner data={ctaBannerData} />
      </div>
    </>
  );
}
