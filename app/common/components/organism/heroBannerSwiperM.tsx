"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import S from "./heroBannerSwiperM.module.scss";
import MzButton from "../atom/mzButton";

type HeroSlide = {
  id?: number;
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

export default function HeroBannerSwiperM({ data }: slideDataProps) {
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

  return (
    <section className={S.heroBanner} aria-label="주요 프로모션 배너">
      <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        speed={0}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
        }}
        onSlideChange={handleSlideChange}
        className={S.heroBanner__swiper}
      >
        {data.map((item, index) => (
          <SwiperSlide
            key={item.id}
            className={S.heroBanner__slide}
            aria-label={`${index + 1} / ${data.length}`}
          >
            <div className={S.heroBanner__media}>
              <Image
                src={item.imageSrc ?? ""}
                alt={`${item.category} - ${item.title}`}
                width={0}
                height={0}
                style={{ width: "100%", height: "100%" }}
                sizes="100vw"
              />
            </div>
            <div className={S.heroBanner__contentBody}>
              <div className={S.heroBanner__contentBody__top}>
                {item.category && (
                  <p className={S.heroBanner__category}>{item.category}</p>
                )}
                <h2 className={S.heroBanner__title}>{item.title}</h2>
                {item.desc && <p className={S.heroBanner__desc}>{item.desc}</p>}
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
    </section>
  );
}
