"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import S from "./mainHeroBanner.module.scss";
import MzButton from "@/app/common/components/atom/mzButton";

type MainHeroBannerSlide = {
  id?: number;
  category?: string;
  title?: string;
  desc?: string;
  date?: string; // YYYY-MM-DD
  imageSrc?: string;
  detailUrl?: string;
  downloadUrl?: string;
};

interface MainHeroBannerProps {
  data: MainHeroBannerSlide[];
}

export default function MainHeroBanner({ data }: MainHeroBannerProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  };

  const handlePaginationClick = (targetIndex: number) => {
    const swiper = swiperRef.current;
    if (!swiper) {
      return;
    }

    if (swiper.params.loop) {
      swiper.slideToLoop(targetIndex);
      setActiveIndex(targetIndex);
      return;
    }

    swiper.slideTo(targetIndex);
    setActiveIndex(targetIndex);
  };

  const handlePrev = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.slidePrev();
  };

  const handleNext = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.slideNext();
  };

  return (
    <>
      <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        speed={600}
        loop
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
        }}
        onSlideChange={handleSlideChange}
        className={S.heroBanner__swiper}
        aria-roledescription="carousel"
        aria-label="주요 배너 슬라이드"
        aria-live="off"
      >
        {data.map((item, index) => (
          <SwiperSlide
            key={item.id}
            className={S.heroBanner__slide}
            aria-label={`${index + 1} / ${data.length}`}
          >
            <div
              className={S.heroBanner__contentBody}
              style={{
                backgroundImage: `url(${item.imageSrc ?? ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "780px",
              }}
            >
              <div
                className={`${S.heroBanner__contentBody__top} layout__container`}
              >
                <h2 className={S.heroBanner__title}>{item.title}</h2>
                {item.desc && <p className={S.heroBanner__desc}>{item.desc}</p>}
                <div className={S.heroBanner__actions}>
                  {item.detailUrl && (
                    <MzButton
                      size="Large"
                      fill="white"
                      href={item.detailUrl}
                      className={S.heroBanner__link}
                      aria-label={`${item.title} 자세히 보기`}
                    >
                      바로 상담하기
                      <i
                        className="icon__24_right_arrow"
                        style={{ backgroundColor: "white" }}
                      />
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className={S.heroBanner__nav} aria-label="배너 슬라이드 네비게이션">
        <button
          type="button"
          className={S.heroBanner__navButton}
          onClick={handlePrev}
          aria-label="이전 배너"
        >
          이전
        </button>
        <button
          type="button"
          className={S.heroBanner__navButton}
          onClick={handleNext}
          aria-label="다음 배너"
        >
          다음
        </button>
      </div> */}
      <div className={`${S.heroBanner__bottom} layout__container`}>
        <div className={S.heroBanner__pagination} aria-label="배너 바로가기">
          {data.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${S.heroBanner__pagination__inner} ${
                activeIndex === index
                  ? S.heroBanner__pagination__inner__active
                  : ""
              }`}
              style={{ width: `${100 / data.length}%` }}
              onClick={() => handlePaginationClick(index)}
              aria-label={`${index + 1}번째 배너 보기`}
              aria-current={activeIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </>
  );
}
