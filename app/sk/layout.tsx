import React from "react";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import styles from "./layout.module.scss";
import BreadCrumb from "./components/common/breadCrumb";
import Banner from "./components/common/Banner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const banner = [
    {
      path: "/support/faq",
      title: "자주 하는 질문",
      desc: "고객님들이 가장 궁금해하시는 내용들을 정리했습니다. 추가 문의사항은 언제든 상담받으실 수 있습니다.",
      image: "/images/sk/support/faq/banner.png",
    },
    {
      path: "/support/notice",
      title: "공지사항",
      desc: "SK쉴더스의 중요한 공지와 업데이트를 빠르게 알려드립니다.",
      image: "/images/sk/support/notice/banner.png",
    },
    {
      path: "/support/event",
      title: "이벤트",
      desc: "고객님만을 위한 다양한 이벤트와 프로모션 정보를 제공합니다.",
      image: "/images/sk/support/event/banner.png",
    },
    {
      path: "/support/brochure",
      title: "브로셔",
      desc: "산업을 선도하는 SK쉴더스, 다양한 제품을 체계적으로 담은 브로셔를 제공합니다.",
      image: "/images/sk/support/brochure/banner.png",
    },
    {
      path: "/support/invoice",
      title: "청구세금계산서",
      desc: "청구세금계산서 내용",
      image: "/images/sk/support/invoice/banner.png",
    },
    {
      path: "/about/sk",
      title: "SK쉴더스",
      desc: "온전한 지속가능의 시작, 안녕을 지키는 기술에서 시작합니다.",
      image: "/images/sk/about/sk/banner.png",
    },
    {
      path: "/about/history",
      title: "연혁",
      desc: "대한민국 보안 분야의 선두 주자로서, 보안 서비스의 혁신과 국내 보안 시장의 성장을 이끌어 왔습니다.",
      image: "/images/sk/about/history/banner.png",
    },
    {
      path: "/about/esg",
      title: "ESG윤리 경영",
      desc: "이웃과 사회의 지속 가능한 스마트안정망! SK쉴더스가 함께합니다.",
      image: "/images/sk/about/esg/banner.png",
    },
    {
      path: "/about/notice",
      title: "전자공고",
      desc: "투명한 경영과 신뢰 강화를 위해 주요 공시 사항을 전자공고로 안내합니다.",
      image: "/images/sk/about/notice/banner.png",
    },
    {
      path: "/about/news",
      title: "News",
      desc: "최신 보안 동향과 위협정보를 한 눈에 확인하세요. 업계가 인정하는 SK쉴더스의 전문성과 혁신성을 확인하세요",
      image: "/images/sk/about/news/banner.png",
    },
    {
      path: "/about/ci",
      title: "CI/BI",
      desc: "안전과 신뢰, SK쉴더스의 철학과 가치를 담은 아이덴티티를 소개합니다.",
      image: "/images/sk/about/ci/banner.png",
    },
  ];
  return (
    <>
      <Header />
      <Banner items={banner} />
      <BreadCrumb />
      <main className={styles.layout__main}>{children}</main>
      <Footer />
    </>
  );
}
