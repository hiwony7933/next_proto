"use client";
import S from "./mzSwiperIndicator.module.scss";

interface MzSwiperIndicatorProps {
  /**
   * 전체 슬라이드 개수
   */
  totalSlides: number;
  /**
   * 현재 활성화된 슬라이드 인덱스
   */
  activeIndex: number;
  /**
   * 인디케이터 클릭 시 호출되는 콜백 함수
   */
  onIndicatorClick: (index: number) => void;
  /**
   * 인디케이터 색상 테마
   * - 'light': 밝은 배경용 (어두운 인디케이터)
   * - 'dark': 어두운 배경용 (밝은 인디케이터) - 기본값
   */
  variant?: "light" | "dark";
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 접근성 라벨
   */
  ariaLabel?: string;
}

/**
 * MzSwiperIndicator
 * 
 * Swiper 슬라이더를 위한 커스텀 인디케이터 컴포넌트
 * 
 * @example
 * ```tsx
 * <MzSwiperIndicator
 *   totalSlides={8}
 *   activeIndex={activeIndex}
 *   onIndicatorClick={handleIndicatorClick}
 *   variant="dark"
 * />
 * ```
 */
export default function MzSwiperIndicator({
  totalSlides,
  activeIndex,
  onIndicatorClick,
  variant = "dark",
  className = "",
  ariaLabel = "슬라이드 인디케이터",
}: MzSwiperIndicatorProps) {
  // 슬라이드 인덱스 배열 생성
  const slides = Array.from({ length: totalSlides }, (_, i) => i);

  return (
    <div
      className={`${S.mzSwiperIndicator} ${
        S[`mzSwiperIndicator--${variant}`]
      } ${className}`}
    >
      <div className={S.mzSwiperIndicator__track} aria-label={ariaLabel}>
        {slides.map((index) => (
          <button
            key={index}
            type="button"
            className={`${S.mzSwiperIndicator__item} ${
              activeIndex === index ? S.mzSwiperIndicator__item__active : ""
            }`}
            style={{ width: `${100 / totalSlides}%` }}
            onClick={() => onIndicatorClick(index)}
            aria-label={`${index + 1}번째 슬라이드 보기`}
            aria-current={activeIndex === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

