"use client";
import S from "./mainSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import MzButton from "@/app/common/components/atom/mzButton";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type SliderBaseItem = {
  id: number;
  desc: string;
  title: string;
  imageSrc: string;
  path: string;
};

type SliderHoverItem = {
  id: number;
  hashTag: string[];
  desc: string;
  title: string;
  imageSrc: string;
  path: string;
};

type SliderCombinedItem = SliderBaseItem & {
  hashTag?: string[];
  hoverDesc?: string;
  hoverImageSrc?: string;
};

const sliderBaseData: SliderBaseItem[] = [
  {
    id: 1,
    desc: "환자 안전과 의료진 보호를\n 위한 특화 보안",
    title: "병원",
    imageSrc: "/images/adt/main_slider_01.png",
    path: "/adt/hospital",
  },
  {
    id: 2,
    desc: "넓은 시설도 빈틈없는\n관리가 가능합니다.",
    title: "공장 · 창고",
    imageSrc: "/images/adt/main_slider_02.png",
    path: "/adt/factory",
  },
  {
    id: 3,
    desc: "주민 모두가 안심하는\n 스마트 단지 보안",
    title: "아파트 단지",
    imageSrc: "/images/adt/main_slider_03.png",
    path: "/adt/apartment",
  },
  {
    id: 4,
    desc: "직원 출입부터 보안까지,\n 한번에 해결",
    title: "오피스",
    imageSrc: "/images/adt/main_slider_04.png",
    path: "/adt/office",
  },
  {
    id: 5,
    desc: "매장 관리 부담!\n운영 효율과 보안을 동시에",
    title: "무인매장",
    imageSrc: "/images/adt/main_slider_05.png",
    path: "/adt/store",
  },
  {
    id: 6,
    desc: "24시간 무인 운영도\n 안전하게 관리",
    title: "주차장",
    imageSrc: "/images/adt/main_slider_06.png",
    path: "/adt/store",
  },
  {
    id: 7,
    desc: "직원 규모에 따라 유연하게\n확장 가능한 보안 솔루션",
    title: "중소기업",
    imageSrc: "/images/adt/main_slider_07.png",
    path: "/adt/store",
  },
  {
    id: 8,
    desc: "직안전한 학습 환경을 위한\n 스마트 보안",
    title: "학교",
    imageSrc: "/images/adt/main_slider_08.png",
    path: "/adt/store",
  },
];

const sliderHoverData: SliderHoverItem[] = [
  {
    id: 1,
    hashTag: ["환자 · 방문객 출입통제", "직원 관리", "병원 시스템 인사 연동"],
    desc: "환자 안전과 의료진 보호를\n 위한 특화 보안",
    title: "병원",
    imageSrc: "/images/adt/main_slider_icon_01.svg",
    path: "/adt/hospital",
  },
  {
    id: 2,
    hashTag: ["화재 감지 · 알람 통보", "주차관리(LPR)", "경비구역 관제"],
    desc: "넓은 시설도 빈틈없는\n관리가 가능합니다.",
    title: "공장 · 창고",
    imageSrc: "/images/adt/main_slider_icon_02.svg",
    path: "/adt/factory",
  },
  {
    id: 3,
    hashTag: ["주차장 보안", "출입통제", "24시간 관제"],
    desc: "주민 모두가 안심하는\n 스마트 단지 보안",
    title: "아파트 단지",
    imageSrc: "/images/adt/main_slider_icon_03.svg",
    path: "/adt/apartment",
  },
  {
    id: 4,
    hashTag: ["출입근태 솔루션", "AI CCTV", "무인경비"],
    desc: "직원 출입부터 보안까지\n, 한번에 해결",
    title: "오피스",
    imageSrc: "/images/adt/main_slider_icon_04.svg",
    path: "/adt/office",
  },
  {
    id: 5,
    hashTag: ["매장관리 솔루션", "고객분석", "도난방지"],
    desc: "매장 관리 부담!\n운영 효율과 보안을 동시에",
    title: "무인매장",
    imageSrc: "/images/adt/main_slider_icon_05.svg",
    path: "/adt/store",
  },
  {
    id: 6,
    hashTag: ["Tmap 주차 솔루션", "무인 주차 운영", "주차면 공유 및 제휴"],
    desc: "24시간 무인 운영도\n 안전하게 관리",
    title: "주차장",
    imageSrc: "/images/adt/main_slider_icon_06.svg",
    path: "/adt/store",
  },
  {
    id: 7,
    hashTag: ["출입근태 관리", "모바일 카드", "얼굴인식"],
    desc: "직원 규모에 따라 유연하게\n확장 가능한 보안 솔루션",
    title: "중소기업",
    imageSrc: "/images/adt/main_slider_icon_07.svg",
    path: "/adt/store",
  },
  {
    id: 8,
    hashTag: ["모바일 출입통제", "순찰관리기능(NFC)", "기숙사 출입 통제"],
    desc: "직안전한 학습 환경을 위한\n 스마트 보안",
    title: "학교",
    imageSrc: "/images/adt/main_slider_icon_08.svg",
    path: "/adt/store",
  },
];

const sliderItems: SliderCombinedItem[] = sliderBaseData.map((item) => {
  const hoverData = sliderHoverData.find(
    (hoverItem) => hoverItem.id === item.id
  );

  if (!hoverData) {
    return item;
  }

  return {
    ...item,
    hashTag: hoverData.hashTag,
    hoverDesc: hoverData.desc,
    hoverImageSrc: hoverData.imageSrc,
  };
});

export default function MainSlider() {
  const [hoveredSlideId, setHoveredSlideId] = useState<number | null>(null);
  const loopedSlidesCount = sliderItems.length;

  const handleMouseEnter = (id: number) => {
    setHoveredSlideId(id);
  };

  const handleMouseLeave = () => {
    setHoveredSlideId(null);
  };

  const getSlideDescriptionId = (id: number, position: "base" | "detail") =>
    `mainSlider-description-${id}-${position}`;
  return (
    <div className={S.mainSlider}>
      <div className={`layout_container ${S.mainSlider__center}`}>
        <div className={S.mainSlider__title}>
          어떤 비즈니스를 하고 계신가요?
          <br />
          <span className={S.mainSlider__title__accent}>꼭 맞는 서비스</span>를
          추천해 드릴께요.
        </div>
      </div>
      <div className={S.mainSlider__slider}>
        <Swiper
          modules={[Autoplay, A11y, Keyboard]}
          slidesPerView={1.2}
          spaceBetween={24}
          loop
          centeredSlides
          speed={600}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          grabCursor
          loopAdditionalSlides={loopedSlidesCount}
          loopPreventsSliding={false}
          watchSlidesProgress
          onBeforeInit={(swiper) => {
            const params = swiper.params as typeof swiper.params & {
              loopedSlides?: number;
              loopedSlidesLimit?: boolean;
            };
            params.loopAdditionalSlides = loopedSlidesCount;
            params.loopedSlides = loopedSlidesCount;
            params.loopedSlidesLimit = false;
          }}
          onResize={(swiper) => {
            swiper.updateSlides();
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateProgress();
          }}
          className={S.mainSlider__slider__swiper}
          breakpoints={{
            480: {
              slidesPerView: 1.4,
            },
            768: {
              slidesPerView: 2.4,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3.6,
              centeredSlides: false,
            },
            1280: {
              slidesPerView: 4.8,
              centeredSlides: true,
            },
            1440: {
              slidesPerView: 5.2,
              centeredSlides: true,
            },
          }}
        >
          {sliderItems.map((item) => {
            const isActive = hoveredSlideId === item.id;
            const baseDescriptionId = getSlideDescriptionId(item.id, "base");
            const detailDescriptionId = getSlideDescriptionId(
              item.id,
              "detail"
            );
            const descriptionIds = item.hashTag?.length
              ? `${baseDescriptionId} ${detailDescriptionId}`
              : baseDescriptionId;
            const cardClassName = `${S.mainSlider__slider__item__card} ${
              isActive ? S.mainSlider__slider__item__cardActive : ""
            }`;
            const overlayClassName = `${S.mainSlider__slider__item__overlay} ${
              isActive ? S.mainSlider__slider__item__overlayVisible : ""
            }`;

            return (
              <SwiperSlide key={item.id} className={S.mainSlider__slider__item}>
                <article className={S.mainSlider__slider__item__article}>
                  <Link
                    href={item.path}
                    className={S.mainSlider__slider__item__link}
                    aria-label={`${item.title} 서비스 자세히 보기`}
                    aria-describedby={descriptionIds}
                    onMouseEnter={() => {
                      handleMouseEnter(item.id);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => {
                      handleMouseEnter(item.id);
                    }}
                    onBlur={handleMouseLeave}
                  >
                    <div className={cardClassName}>
                      <span
                        className={`${S.mainSlider__slider__item__plus} ${
                          isActive ? S.mainSlider__slider__item__plusActive : ""
                        }`}
                        aria-hidden="true"
                      />
                      <div
                        className={S.mainSlider__slider__item__background}
                        style={{ backgroundImage: `url(${item.imageSrc})` }}
                        aria-hidden
                      />
                      <div
                        className={S.mainSlider__slider__item__scrim}
                        aria-hidden
                      />
                      <div className={S.mainSlider__slider__item__content}>
                        <div
                          className={S.mainSlider__slider__item__contentBody}
                        >
                          <h3 className={S.mainSlider__slider__item__title}>
                            {item.title}
                          </h3>
                          <p
                            id={baseDescriptionId}
                            className={S.mainSlider__slider__item__desc}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      {item.hashTag?.length ? (
                        <div
                          className={overlayClassName}
                          aria-hidden={!isActive}
                        >
                          <div
                            className={S.mainSlider__slider__item__overlayTop}
                          >
                            <ul
                              className={
                                S.mainSlider__slider__item__hashTagList
                              }
                            >
                              {item.hashTag.map((tag) => (
                                <li
                                  key={`${item.id}-${tag}`}
                                  className={
                                    S.mainSlider__slider__item__hashTagItem
                                  }
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div
                            className={
                              S.mainSlider__slider__item__overlayBottom
                            }
                          >
                            <div
                              className={
                                S.mainSlider__slider__item__overlayText
                              }
                            >
                              <p
                                id={detailDescriptionId}
                                className={
                                  S.mainSlider__slider__item__overlayDesc
                                }
                              >
                                {item.hoverDesc ?? item.desc}
                              </p>
                              <h3
                                className={
                                  S.mainSlider__slider__item__overlayTitle
                                }
                              >
                                {item.title}
                              </h3>
                            </div>
                          </div>
                          {item.hoverImageSrc ? (
                            <div
                              className={
                                S.mainSlider__slider__item__overlayIcon
                              }
                            >
                              <Image
                                src={item.hoverImageSrc}
                                alt=""
                                aria-hidden
                                width={52}
                                height={52}
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className={`layout_container ${S.mainSlider__center}`}>
        <MzButton size="Large" fill="white" className="button-more">
          더 많은 업종별 사례 보기
          <i className="icon__24_right_arrow" />
        </MzButton>
      </div>
      {/* <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        speed={600}
        loop
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
      /> */}
    </div>
  );
}
