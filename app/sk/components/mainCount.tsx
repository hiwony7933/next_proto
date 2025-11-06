import S from "./mainCount.module.scss";
import MainCountUp from "./mainCountUp";
import Image from "next/image";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function MainCount() {
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  return (
    <section className={`${S.count} layout__container`}>
      <div className={S.count__areaTextTop}>
        <span className={S.count__areaText}>대한민국 No.1 사이버보안</span>
        <div className={S.count__areaTextImage}>
          <Image
            src="/images/sk/mainCountText.svg"
            alt="대한민국 No.1 사이버보안"
            width={isDesktop ? 215 : isTablet ? 150 : 100}
            height={isDesktop ? 47 : isTablet ? 30 : 20}
            priority
          />
          {isDesktop ? (
            <span>의 전문성을 지금 만나보세요.</span>
          ) : (
            <span>의 전문성을</span>
          )}
        </div>
        {!isDesktop && (
          <div className={S.count__areaText}>지금 만나보세요.</div>
        )}
      </div>
      <div className={S.count__area}>
        <div className={S.count__areaWrapper}>
          <div className={S.count__areaItem}>
            <MainCountUp
              className={S.count__areaItemCount}
              end={1}
              start={0}
              durationMs={1500}
              startOnView
              useGrouping
              role="progressbar"
              aria-label="카운트 업: 1"
              aria-live="polite"
            />
          </div>
          <span className={S.count__areaItemText}>사이버보안 매출</span>
        </div>
        <div className={S.count__areaSeparator}></div>
        <div className={S.count__areaWrapper}>
          <div className={S.count__areaItem}>
            <MainCountUp
              className={S.count__areaItemCount}
              end={12000}
              start={0}
              durationMs={1500}
              startOnView
              useGrouping
              role="progressbar"
              aria-label="카운트 업: 12000"
              aria-live="polite"
            />
            <span>+</span>
          </div>
          <span className={S.count__areaItemText}>
            공공기관, 대기업, 중소기업을 아우르는 다양한 고객
          </span>
        </div>
        <div className={S.count__areaSeparator}></div>
        <div className={S.count__areaWrapper}>
          <div className={S.count__areaItem}>
            <MainCountUp
              className={S.count__areaItemCount}
              end={1500}
              start={0}
              durationMs={1500}
              startOnView
              useGrouping
              role="progressbar"
              aria-label="카운트 업: 1500"
              aria-live="polite"
            />
            <span>+</span>
          </div>
          <span className={S.count__areaItemText}>
            국내 최대 규모 보안 전문가 보유
          </span>
        </div>
      </div>
    </section>
  );
}
