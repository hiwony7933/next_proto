"use client";
import {
  mainPageData,
  integratedItems,
  newsItems,
  mainHeroBannerData,
  mainServiceSecondAreaData,
  insightsData,
} from "./components/data/mainPage";
import MainHeroBanner from "@/app/sk/components/mainHeroBanner";
import MainSpecialList from "@/app/sk/components/mainSpecialList";
import MainIntegrated from "@/app/sk/components/mainIntegrated";
import MainInsights from "@/app/sk/components/mainInsights";
import MainCount from "@/app/sk/components/mainCount";
import MainNews from "@/app/sk/components/mainNews";
import MainService from "@/app/sk/components/mainService";
import useBreakpoint from "@/hooks/useBreakpoint";
import MainServiceM from "@/app/sk/components/mainServiceM";

export default function Page() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <div>
      <MainHeroBanner data={mainHeroBannerData} />
      <MainCount />
      {!isMobile && !isTablet ? (
        <MainService data={mainServiceSecondAreaData} />
      ) : (
        <MainServiceM data={mainServiceSecondAreaData} />
      )}
      <MainInsights data={insightsData} />
      <MainSpecialList data={mainPageData} />
      <MainIntegrated data={integratedItems} />
      <MainNews data={newsItems} />
    </div>
  );
}
