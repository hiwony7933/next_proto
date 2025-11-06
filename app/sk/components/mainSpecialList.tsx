import { useCallback, useEffect, useId, useRef, useState } from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import { Navigation, A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import S from "./mainSpecialList.module.scss";
import MzSwiperIndicator from "@/app/common/components/molecule/mzSwiperIndicator";
import useBreakpoint from "@/hooks/useBreakpoint";
interface SpecialReportAction {
  label: string;
  href: string;
}

interface SpecialReportItem {
  id: number;
  label?: string;
  category?: string;
  imagePath: string;
  title: string;
  desc?: string;
  buttons: SpecialReportAction[];
}

interface MainSpecialListProps {
  data: SpecialReportItem[];
}

export default function MainSpecialList({ data }: MainSpecialListProps) {
  const { isDesktop } = useBreakpoint();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const componentId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = data.length > 1;
  const swiperId = `${componentId}-swiper`;

  const prevButtonClassName = [
    S.eqst__navButton,
    S.eqst__navButtonPrev,
    !isBeginning && hasMultipleSlides ? S.eqst__navButtonActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  const nextButtonClassName = [
    S.eqst__navButton,
    S.eqst__navButtonNext,
    !isEnd && hasMultipleSlides ? S.eqst__navButtonActive : "",
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
      setActiveIndex(swiper.activeIndex); // 인디케이터 업데이트
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

  const handleIndicatorClick = useCallback((index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, []);

  return (
    <section className={S.eqst}>
      <div className="layout__container">
        <div className={S.eqst__header}>
          <h2 className={S.eqst__title}>
            보안 전문가의 위협 분석과 대응 전략 리포트를 확인하세요.
          </h2>
        </div>
        <div className={S.eqst__swiperWrapper}>
          <button
            ref={prevButtonRef}
            type="button"
            className={prevButtonClassName}
            aria-label="이전 슬라이드"
            aria-controls={swiperId}
            disabled={!hasMultipleSlides || isBeginning}
          >
            <i
              className={`icon__24_left_arrow ${S.eqst__navButtonIcon}`}
              aria-hidden="true"
            />
          </button>
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
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            keyboard={{ enabled: true }}
            a11y={{ enabled: true }}
            className={S.eqst__swiper}
            role="list"
            aria-live="polite"
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
          >
            {data.map((item) => {
              const titleId = `${componentId}-title-${item.id}`;
              const descId = item.desc
                ? `${componentId}-desc-${item.id}`
                : undefined;
              const badgeClassName = [
                S.eqst__cardBadge,
                item.label?.toLowerCase() === "eqst"
                  ? S.eqst__cardBadgeEqst
                  : S.eqst__cardBadgeReport,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <SwiperSlide
                  key={item.id}
                  className={S.eqst__slide}
                  role="listitem"
                >
                  <article
                    className={S.eqst__card}
                    aria-labelledby={titleId}
                    aria-describedby={descId}
                  >
                    <div
                      className={S.eqst__cardBackground}
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${item.imagePath})`,
                      }}
                    />
                    <div className={S.eqst__cardContent}>
                      <div className={S.eqst__cardHeader}>
                        {item.label && (
                          <span className={badgeClassName}>{item.label}</span>
                        )}
                        <div className={S.eqst__cardTextBlock}>
                          {item.category && (
                            <p className={S.eqst__cardCategory}>
                              {item.category}
                            </p>
                          )}
                          <h3 className={S.eqst__cardTitle} id={titleId}>
                            {item.title}
                          </h3>
                          {item.desc && (
                            <p className={S.eqst__cardDesc} id={descId}>
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                      <ul className={S.eqst__cardActions}>
                        {item.buttons.map((button) => (
                          <li
                            key={`${item.id}-${button.label}`}
                            className={S.eqst__cardActionItem}
                          >
                            <MzButton
                              href={button.href}
                              size="Medium"
                              fill="black"
                              className={S.eqst__cardActionButton}
                            >
                              {button.label}
                              {button.label === "자세히보기" && (
                                <i
                                  className={`icon__20_right_arrow ${S.eqst__cardActionButtonArrowIcon}`}
                                  style={{ backgroundColor: "white" }}
                                  aria-hidden="true"
                                />
                              )}
                              {button.label === "다운로드" && (
                                <i
                                  className={`icon__12_download ${S.eqst__cardActionButtonDownloadIcon}`}
                                  style={{ backgroundColor: "white" }}
                                  aria-hidden="true"
                                />
                              )}
                            </MzButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <button
            ref={nextButtonRef}
            type="button"
            className={nextButtonClassName}
            aria-label="다음 슬라이드"
            aria-controls={swiperId}
            disabled={!hasMultipleSlides || isEnd}
          >
            <i
              className={`icon__24_right_arrow ${S.eqst__navButtonIcon}`}
              aria-hidden="true"
            />
          </button>
        </div>
        {!isDesktop && (
          <div className={S.eqst__indicator}>
            <MzSwiperIndicator
              totalSlides={data.length}
              activeIndex={activeIndex}
              onIndicatorClick={handleIndicatorClick}
              variant="light"
              ariaLabel="스페셜 리포트 인디케이터"
            />
          </div>
        )}
        <div className={S.eqst__cta}>
          <MzButton
            size="Large"
            fill="white"
            className={`${S.eqst__ctaButton} button-more`}
          >
            전문가 리포트 더보기
            <i className="icon__20_right_arrow" />
          </MzButton>
        </div>
      </div>
    </section>
  );
}
