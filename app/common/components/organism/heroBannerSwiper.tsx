"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import S from "./heroBannerSwiper.module.scss";
import MzButton from "../atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";

type HeroSlide = {
  id: number;
  category?: string;
  title?: string;
  desc?: string;
  date?: string; // YYYY-MM-DD
  imageSrc?: string;
  detailUrl?: string;
  downloadUrl?: string;
};

interface slideDataProps {
  data: HeroSlide[];
}

export default function HeroBannerSwiper({ data }: slideDataProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null
  );
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section className={S.heroBanner} aria-label="주요 프로모션 배너">
      <div className={`row ${S.heroBanner__row}`} style={{ height: "100%" }}>
        {/* 좌측: 썸네일(이미지) - 효과 없이 즉시 교체 */}
        <div className={`col-${isMobile || isTablet ? 12 : 6}`}>
          <div className={S.heroBanner__media}>
            <Image
              src={data[activeIndex].imageSrc ?? ""}
              alt={`${data[activeIndex].category} - ${data[activeIndex].title}`}
              width={0}
              height={0}
              style={{ width: "100%", height: "100%" }}
              sizes="100vw"
            />
          </div>
        </div>

        {/* 우측: 컨텐츠 - 아래에서 위로 등장 */}
        <div
          className={`col-${isMobile || isTablet ? 12 : 6}`}
          style={{ position: "relative" }}
        >
          <Swiper
            modules={[Navigation, A11y, Keyboard]}
            slidesPerView={1}
            speed={0}
            loop={isMobile || isTablet ? true : false}
            keyboard={{ enabled: true }}
            a11y={{ enabled: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onBeforeInit={(swiper) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const nav = (swiper.params.navigation || {}) as any;
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            onAfterInit={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            className={S.heroBanner__swiper}
          >
            {data.map((item, index) => (
              <SwiperSlide
                key={item.id}
                className={S.heroBanner__slide}
                aria-label={`${index + 1} / ${data.length}`}
              >
                <div className={S.heroBanner__contentBody}>
                  <div className={S.heroBanner__contentBody__top}>
                    {item.category && (
                      <p className={S.heroBanner__category}>{item.category}</p>
                    )}
                    <h2 className={S.heroBanner__title}>{item.title}</h2>
                    {item.desc && (
                      <p className={S.heroBanner__desc}>{item.desc}</p>
                    )}
                    <p className={S.heroBanner__meta}>
                      <time dateTime={item.date}>{item.date}</time>
                    </p>
                  </div>
                  <div className={S.heroBanner__actions}>
                    {item.detailUrl && (
                      <MzButton
                        size="Large"
                        fill="black"
                        href={item.detailUrl}
                        className={S.heroBanner__link}
                        aria-label={`${item.title} 자세히 보기`}
                      >
                        자세히 보기
                      </MzButton>
                    )}
                    {item.downloadUrl && (
                      <MzButton
                        size="Large"
                        fill="gray"
                        href={item.downloadUrl}
                        className={S.heroBanner__link}
                        aria-label={`${item.title} 파일 다운로드`}
                        style={{ gap: 8 }}
                        download
                      >
                        다운로드
                        <i
                          className="icon__12_download"
                          style={{
                            backgroundColor: "black",
                          }}
                        />
                      </MzButton>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 네비게이션 버튼(우측 하단 고정, 애니메이션 제외) */}
          <div className={S.heroBanner__nav} aria-label="배너 탐색">
            <button
              ref={prevRef}
              type="button"
              className={`${S.heroBanner__navButton} ${S.heroBanner__navButtonPrev}`}
              aria-label="이전 슬라이드"
              onClick={() => {
                console.log("이전");
              }}
            >
              <i className={`icon__24_left_arrow ${S.icon}`} />
            </button>
            <div className={S.heroBanner__navIndex}>
              <span className={S.heroBanner__navIndexNumber}>
                {activeIndex + 1}
              </span>
              <span className={S.heroBanner__navIndexTotal}>
                / {data.length}
              </span>
            </div>
            <button
              ref={nextRef}
              type="button"
              className={`${S.heroBanner__navButton} ${S.heroBanner__navButtonNext}`}
              aria-label="다음 슬라이드"
              onClick={() => {
                console.log("다음");
              }}
            >
              <i className={`icon__24_right_arrow ${S.icon}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
