"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import S from "./mainLogo.module.scss";

type MainLogoLine = {
  content: string;
  isAccent?: boolean;
};

const revealInterval = 320;

const textLines: MainLogoLine[] = [
  { content: "50여년의 보안 노하우와", isAccent: true },
  { content: "최신 AI 기술이 만나" },
  { content: "당신의 소중한 자산을 지킵니다." },
  { content: "백만 고객이 신뢰한 ADT캡스," },
  { content: "이제 당신과 함께 합니다.", isAccent: true },
];

const gridLineIndices = Array.from({ length: 12 }, (_, index) => index + 1);

export default function MainLogo() {
  const sectionId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
            return;
          }

          if (entry.target === containerRef.current) {
            setIsActive(false);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setVisibleCount(0);
      return undefined;
    }

    setVisibleCount(0);

    const timers = textLines.map((_, index) =>
      setTimeout(
        () => {
          setVisibleCount(index + 1);
        },
        revealInterval * (index + 1)
      )
    );

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, [isActive]);

  // const headingLine = useMemo(() => textLines[0], []);
  const bodyLines = useMemo(() => textLines, []);

  return (
    <section
      ref={containerRef}
      className={clsx(S.mainLogo, { [S.mainLogoActive]: isActive })}
      role="region"
      aria-labelledby={`${sectionId}-heading`}
      tabIndex={-1}
    >
      <div className={S.mainLogo__background} aria-hidden="true">
        <div className={S.mainLogo__grid}>
          {gridLineIndices.map((lineIndex) => (
            <span
              key={`grid-${lineIndex}`}
              className={S.mainLogo__gridLine}
              style={{ "--line-index": lineIndex } as CSSProperties}
            />
          ))}
        </div>
        <div className={S.mainLogo__halo} />
        <div className={S.mainLogo__octagon} />
        <div className={S.mainLogo__waveLines}>
          <span className={S.mainLogo__waveLine} />
          <span className={S.mainLogo__waveLine} />
          <span className={S.mainLogo__waveLine} />
        </div>
      </div>

      <div className={S.mainLogo__content}>
        <ul className={S.mainLogo__textList} aria-live="polite">
          {bodyLines.map((line, index) => {
            const globalIndex = index;
            const isVisible = visibleCount > globalIndex;
            return (
              <li
                key={`${sectionId}-line-${globalIndex}`}
                className={clsx(
                  S.mainLogo__textLine,
                  line.isAccent && S.mainLogo__textLineAccent,
                  isVisible && S.mainLogo__textLineVisible
                )}
              >
                {line.content}
              </li>
            );
          })}
        </ul>

        <div className={S.mainLogo__logo}>
          <Image
            src="/images/adt/mainLogo.svg"
            alt="ADT 정팔각형 로고"
            fill
            priority
            sizes="(max-width: 768px) 200px, 240px"
          />
        </div>
      </div>
    </section>
  );
}
