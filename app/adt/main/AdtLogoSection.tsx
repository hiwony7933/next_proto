"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import Image from "next/image";

import styles from "./adtLogoSection.module.scss";

const ADT_LOGO_MESSAGES = [
  "50여년의 보안 노하우와",
  "최신 AI 기술이 만나",
  "당신의 소중한 자산을 지킵니다.",
  "백만 고객이 신뢰한 ADT캡스,",
  "이제 당신과 함께 합니다.",
];

const OCTAGON_CONFIG = {
  size: 1400,
  center: 700,
  count: 50,
  maxRadius: 2100,
  gap: 40,
} as const;

const BACKGROUND_PROGRESS_RANGE: [number, number] = [0.05, 0.25];
const TEXT_PROGRESS_RANGE: [number, number] = [BACKGROUND_PROGRESS_RANGE[1], 0.7];
const LOGO_PROGRESS_RANGE: [number, number] = [0.78, 0.88];
const RINGS_REVEAL_GROUP_SIZE = 2.5;

const OCTAGON_POINTS = Array.from({ length: OCTAGON_CONFIG.count }, (_, index) => {
  const radius = Math.max(
    OCTAGON_CONFIG.maxRadius - index * OCTAGON_CONFIG.gap,
    OCTAGON_CONFIG.gap,
  );
  return createOctagonPoints(radius, OCTAGON_CONFIG.center);
}).reverse();

export default function AdtLogoSection() {
  const adtLogoWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: adtLogoWrapperRef,
    offset: ["start start", "end end"],
  });
  const adtLogoSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.9,
  });
  const logoOpacity = useTransform(
    adtLogoSpring,
    LOGO_PROGRESS_RANGE,
    [0, 1],
    { clamp: true },
  );
  const logoScale = useTransform(
    adtLogoSpring,
    LOGO_PROGRESS_RANGE,
    [0.85, 1],
    { clamp: true },
  );
  const ringsOpacity = useTransform(
    adtLogoSpring,
    [LOGO_PROGRESS_RANGE[0], 1],
    [0, 1],
    { clamp: true },
  );
  const backgroundFill = useTransform(
    adtLogoSpring,
    BACKGROUND_PROGRESS_RANGE,
    [0, 1],
    { clamp: true },
  );

  const ringsProgress = useMotionValue(0);
  const hasTriggeredRingsRef = useRef(false);

  useEffect(() => {
    const unsubscribe = adtLogoSpring.on("change", (value) => {
      if (value >= LOGO_PROGRESS_RANGE[1] && !hasTriggeredRingsRef.current) {
        hasTriggeredRingsRef.current = true;
        ringsProgress.set(1);
      }

      if (value < LOGO_PROGRESS_RANGE[0]) {
        hasTriggeredRingsRef.current = false;
        ringsProgress.set(0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [adtLogoSpring, ringsProgress]);

  return (
    <div ref={adtLogoWrapperRef} className={styles.adtLogoWrapper}>
      <motion.div className={styles.adtLogo}>
        <motion.section
          className={styles.adtLogo__panel}
          aria-label="ADT 소개 문구"
        >
          <motion.div
            className={styles.adtLogo__bgOverlay}
            style={{ scaleY: backgroundFill }}
            aria-hidden="true"
          />
          <motion.ul className={styles.adtLogo__list}>
            {ADT_LOGO_MESSAGES.map((message, index) => (
              <AdtLogoMessage
                key={message}
                springValue={adtLogoSpring}
                index={index}
              >
                {message}
              </AdtLogoMessage>
            ))}
          </motion.ul>
          <motion.div
            className={styles.adtLogo__visual}
            aria-hidden="true"
            style={{ opacity: ringsOpacity }}
          >
            <AdtLogoRings springValue={ringsProgress} />
          </motion.div>
          <motion.div
            className={styles.adtLogo__logoWrapper}
            style={{ opacity: logoOpacity }}
            aria-hidden="true"
          >
            <motion.div style={{ scale: logoScale }}>
              <Image
                src="/images/common/adt_logo.svg"
                alt="ADT 로고"
                width={320}
                height={320}
                className={styles.adtLogo__logo}
              />
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
}

const AdtLogoRings = ({ springValue }: { springValue: MotionValue<number> }) => {
  const points = useMemo(() => OCTAGON_POINTS, []);

  return (
    <motion.svg
      className={styles.adtLogo__rings}
      viewBox={`0 0 ${OCTAGON_CONFIG.size} ${OCTAGON_CONFIG.size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {points.map((pointString, index) => (
        <AdtLogoRing
          key={`octagon-${index}`}
          points={pointString}
          index={index}
          springValue={springValue}
        />
      ))}
    </motion.svg>
  );
};

const AdtLogoMessage = ({
  children,
  springValue,
  index,
}: {
  children: ReactNode;
  springValue: MotionValue<number>;
  index: number;
}) => {
  const total = ADT_LOGO_MESSAGES.length;
  const rangeSize = TEXT_PROGRESS_RANGE[1] - TEXT_PROGRESS_RANGE[0];
  const progressStart = TEXT_PROGRESS_RANGE[0] + (index / total) * rangeSize;
  const progressEnd = TEXT_PROGRESS_RANGE[0] + ((index + 1) / total) * rangeSize;
  const opacity = useTransform(springValue, [progressStart, progressEnd], [0, 1], {
    clamp: true,
  });
  const translateY = useTransform(
    springValue,
    [progressStart, progressEnd],
    [24, 0],
    { clamp: true },
  );

  return (
    <motion.li className={styles.adtLogo__item} style={{ opacity, y: translateY }}>
      {children}
    </motion.li>
  );
};

const AdtLogoRing = ({
  points,
  springValue,
  index,
}: {
  points: string;
  springValue: MotionValue<number>;
  index: number;
}) => {
  const groupSize = Math.max(1, RINGS_REVEAL_GROUP_SIZE);
  const effectiveCount = Math.max(1, Math.ceil(OCTAGON_CONFIG.count / groupSize));
  const segment = 1 / effectiveCount;
  const groupIndex = Math.min(
    effectiveCount - 1,
    Math.floor(index / groupSize),
  );
  const start = segment * groupIndex;
  const end = Math.min(1, start + segment);

  const opacity = useTransform(springValue, [start, end], [0, 1], { clamp: true });

  return <motion.polygon points={points} className={styles.adtLogo__ring} style={{ opacity }} />;
};

function createOctagonPoints(radius: number, center: number) {
  const angleOffset = Math.PI / 8;
  const step = Math.PI / 4;

  return Array.from({ length: 8 })
    .map((_, index) => {
      const angle = angleOffset + index * step;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x.toFixed(3)} ${y.toFixed(3)}`;
    })
    .join(" ");
}

