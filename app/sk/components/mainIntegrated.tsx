"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import S from "./mainIntegrated.module.scss";
import MzButton from "@/app/common/components/atom/mzButton";
import MzSwiperIndicator from "@/app/common/components/molecule/mzSwiperIndicator";
import useBreakpoint from "@/hooks/useBreakpoint";

interface MainIntegratedProps {
  data: IntegratedItemProps[];
}

interface IntegratedItemProps {
  title: string;
  descLines: string;
  href: string;
  tags?: string[];
}

export default function MainIntegrated({ data }: MainIntegratedProps) {
  const { isDesktop } = useBreakpoint();
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const componentId = useId();

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = data.length > 1;
  const swiperId = `${componentId}-integrated-swiper`;

  const prevButtonClassName = [
    S.integrated__navButton,
    S.integrated__navButtonPrev,
    !isBeginning && hasMultipleSlides ? S.integrated__navButtonActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  const nextButtonClassName = [
    S.integrated__navButton,
    S.integrated__navButtonNext,
    !isEnd && hasMultipleSlides ? S.integrated__navButtonActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  const updateNavigationState = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const attachNavigation = useCallback((swiper: SwiperType) => {
    if (!prevButtonRef.current || !nextButtonRef.current) {
      return;
    }

    const navigation = swiper.params.navigation;
    if (typeof navigation === "boolean") {
      swiper.params.navigation = {
        prevEl: prevButtonRef.current,
        nextEl: nextButtonRef.current,
      };
    } else if (navigation) {
      navigation.prevEl = prevButtonRef.current;
      navigation.nextEl = nextButtonRef.current;
    }

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  const handleSwiperInit = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      attachNavigation(swiper);
      updateNavigationState(swiper);
    },
    [attachNavigation, updateNavigationState]
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      swiper.navigation.update();
      updateNavigationState(swiper);
      setActiveIndex(swiper.activeIndex);
    },
    [updateNavigationState]
  );

  useEffect(() => {
    if (!hasMultipleSlides) {
      setIsBeginning(true);
      setIsEnd(true);
      return;
    }

    if (swiperRef.current) {
      swiperRef.current.update();
      attachNavigation(swiperRef.current);
      updateNavigationState(swiperRef.current);
    }
  }, [attachNavigation, hasMultipleSlides, updateNavigationState]);

  useEffect(() => {
    if (!swiperRef.current) {
      return;
    }

    attachNavigation(swiperRef.current);
  }, [attachNavigation]);

  const handleIndicatorClick = useCallback((index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, []);

  return (
    <section className={S.integrated}>
      <div className={S.integrated__dimmed} aria-hidden="true" />
      <div className="layout__container">
        <header className={S.integrated__header}>
          <h2 className={S.integrated__title}>
            다양한 기업의 보안 고민, SK쉴더스가 해결합니다.
          </h2>
          <div className={S.integrated__nav}>
            <button
              ref={prevButtonRef}
              type="button"
              className={prevButtonClassName}
              aria-label="이전 사례 슬라이드"
              aria-controls={swiperId}
              disabled={!hasMultipleSlides || isBeginning}
            >
              <i
                className={`icon__24_left_arrow ${S.integrated__navButtonIcon}`}
                aria-hidden="true"
              />
            </button>
            <button
              ref={nextButtonRef}
              type="button"
              className={nextButtonClassName}
              aria-label="다음 사례 슬라이드"
              aria-controls={swiperId}
              disabled={!hasMultipleSlides || isEnd}
            >
              <i
                className={`icon__24_right_arrow ${S.integrated__navButtonIcon}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        <div className={S.integrated__swiperWrapper}>
          <Swiper
            id={swiperId}
            modules={[Navigation, A11y, Keyboard]}
            slidesPerView="auto"
            spaceBetween={24}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 32,
              },
            }}
            keyboard={{ enabled: true }}
            a11y={{ enabled: true }}
            className={S.integrated__swiper}
            role="list"
            aria-live="polite"
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
          >
            {data.map((item, index) => {
              const baseId = `${componentId}-integrated-card-${index}`;
              const titleId = `${baseId}-title`;
              const descId = `${baseId}-desc`;

              return (
                <SwiperSlide
                  key={`${item.title}-${index}`}
                  className={S.integrated__slide}
                  role="listitem"
                >
                  <article
                    className={S.integrated__card}
                    aria-labelledby={titleId}
                    aria-describedby={descId}
                  >
                    <div className={S.integrated__cardInner}>
                      <div className={S.integrated__cardHeader}>
                        <p className={S.integrated__cardTitle} id={titleId}>
                          {item.title}
                        </p>
                        <p
                          className={S.integrated__cardDescription}
                          id={descId}
                        >
                          {item.descLines}
                        </p>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <ul className={S.integrated__cardTags}>
                          {item.tags.map((tag) => (
                            <li
                              key={`${titleId}-${tag}`}
                              className={S.integrated__cardTagItem}
                            >
                              <span className={S.integrated__cardTag}>
                                {tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        {!isDesktop && (
          <div className={S.integrated__indicator}>
            <MzSwiperIndicator
              totalSlides={data.length}
              activeIndex={activeIndex}
              onIndicatorClick={handleIndicatorClick}
              variant="dark"
              ariaLabel="업종별 사례 인디케이터"
            />
          </div>
        )}
        <div className={S.integrated__cta}>
          <MzButton size="Large" fill="white" className="button-more">
            업종별 사례 더보기
            <i className="icon__24_right_arrow" />
          </MzButton>
        </div>
      </div>
    </section>
  );
}
