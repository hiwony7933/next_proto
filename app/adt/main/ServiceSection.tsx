"use client";

import { useRef } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import styles from "./serviceSection.module.scss";

const SCROLL_SENSITIVITY = 0.0015;

export default function ServiceSection() {
  const serviceRef = useRef<HTMLDivElement>(null);
  const widthProgress = useMotionValue(0);
  const widthSpring = useSpring(widthProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });
  const width = useTransform(widthSpring, (value) => {
    const clampedValue = Math.min(Math.max(value, 0), 1);
    return `${100 - clampedValue * 50}%`;
  });
  const serviceRightX = useTransform(widthSpring, [0, 0.6, 1], ["0%", "0%", "100%"]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!serviceRef.current?.contains(event.target as Node)) {
      return;
    }

    const nextValue = widthProgress.get() + event.deltaY * SCROLL_SENSITIVITY;
    const clampedValue = Math.min(Math.max(nextValue, 0), 1);
    widthProgress.set(clampedValue);
  };

  return (
    <motion.div className={styles.serviceWrapper}>
      <motion.section
        className={styles.serviceRight}
        style={{ x: serviceRightX }}
        aria-label="ADT 사이버보안 서비스 목록"
      >
        <div className={styles.serviceRight__inner}>
          <div className={styles.serviceRight__inner__title}>사이버보안 서비스 & 솔루션</div>
          <ul className={styles.serviceRight__list}>
            <li>취약점 진단</li>
            <li>통합 정보 보호</li>
            <li>정보 보안 관리체계</li>
            <li>모의해킹</li>
            <li>개인정보보호</li>
            <li>침입 탐지 시스템</li>
            <li>방화벽 관리</li>
            <li>암호화 솔루션</li>
            <li>보안 컨설팅</li>
            <li>데이터 백업</li>
            <li>재해 복구</li>
            <li>보안 교육</li>
            <li>24시간 관제</li>
            <li>위협 인텔리전스</li>
            <li>보안 감사</li>
          </ul>
        </div>
      </motion.section>
      <motion.div
        ref={serviceRef}
        style={{ width }}
        onWheel={handleWheel}
        className={styles.service}
        tabIndex={0}
        aria-label="사이버보안 서비스 영역"
      >
        <div className={styles.service__inner}>
          <div className={styles.service__inner__title}>사이버보안 서비스 & 솔루션</div>
          <div className={styles.service__inner__desc}>
            진단, 모의해킹부터 컨설팅, 통합 관제까지
            <br />
            사이버보안 End-to-End 서비스
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

