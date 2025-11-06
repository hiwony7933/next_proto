"use client";
import S from "./mainServiceM.module.scss";
import { useState } from "react";
import Link from "next/link";
import MzButton from "@/app/common/components/atom/mzButton";
import MzSwiperIndicator from "@/app/common/components/molecule/mzSwiperIndicator";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

interface MainServiceSecondAreaData {
  title: string;
  desc: string;
  list: string[];
  link: string;
}

interface MainServiceProps {
  data: MainServiceSecondAreaData[];
}

export default function MainServiceM({ data }: MainServiceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handlePaginationClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  return (
    <section className={S.mainServiceM}>
      {/* 배경 이미지 */}
      <div className={S.mainServiceM__background}>
        <div className={S.mainServiceM__backgroundImage} />
        <div className={S.mainServiceM__backgroundDim} />
      </div>

      {/* 컨텐츠 */}
      <div className={S.mainServiceM__content}>
        {/* 타이틀 */}
        <div className={S.mainServiceM__header}>
          <h2 className={S.mainServiceM__title}>
            진단, 모의해킹부터
            <br />
            컨설팅, 통합 관제까지
            <br />
            사이버보안 End-to-End 서비스
          </h2>
        </div>

        {/* Swiper 슬라이더 */}
        <div className={S.mainServiceM__swiperWrapper}>
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView="auto"
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            className={S.mainServiceM__swiper}
            centeredSlides={false}
            grabCursor={true}
            breakpoints={{
              // 모바일: 1개 카드 + 다음 카드 미리보기
              320: {
                slidesPerView: "auto",
                spaceBetween: 16,
              },
              // 태블릿: 2개 카드 + 다음 카드 미리보기
              720: {
                slidesPerView: "auto",
                spaceBetween: 20,
              },
            }}
          >
            {data.map((item, index) => (
              <SwiperSlide key={index} className={S.mainServiceM__slide}>
                <article className={S.mainServiceM__card}>
                  <Link
                    href={item.link}
                    className={S.mainServiceM__cardLink}
                    aria-label={`${item.title} 상세 페이지로 이동`}
                  >
                    <div className={S.mainServiceM__cardContent}>
                      <h3 className={S.mainServiceM__cardTitle}>
                        {item.title}
                      </h3>
                      <p className={S.mainServiceM__cardDesc}>{item.desc}</p>
                      <ul className={S.mainServiceM__cardTags}>
                        {item.list.map((tag, tagIndex) => (
                          <li
                            key={tagIndex}
                            className={S.mainServiceM__cardTag}
                          >
                            <span className={S.mainServiceM__cardTagHash}>
                              #
                            </span>
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={S.mainServiceM__cardMore}
                        aria-label="더보기"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = item.link;
                        }}
                      >
                        <span className={S.mainServiceM__cardMoreIcon}>+</span>
                      </button>
                    </div>
                  </Link>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 커스텀 인디케이터 */}
        <div className={S.mainServiceM__indicator}>
          <MzSwiperIndicator
            totalSlides={data.length}
            activeIndex={activeIndex}
            onIndicatorClick={handlePaginationClick}
            variant="dark"
            ariaLabel="서비스 카드 인디케이터"
          />
        </div>

        {/* 버튼 */}
        <div className={S.mainServiceM__button}>
          <MzButton
            className={S.mainServiceM__btn}
            size="Large"
            fill="Red"
            href="/contact/expert-consultation"
            passHref
          >
            사이버보안 전문상담
          </MzButton>
        </div>
      </div>
    </section>
  );
}
