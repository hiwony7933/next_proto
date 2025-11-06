"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./floatingButtons.module.scss";
import Link from "next/link";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGoTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={styles.fab} role="region" aria-label="바로가기 버튼 영역">
      <ul className={styles.fab__list}>
        <li className={styles.fab__item}>
          <Link
            className={styles.fab__button}
            href="tel:1588-6400"
            aria-label="전화 상담 연결"
          >
            <span className={styles.fab__icon} aria-hidden="true">
              ☎
            </span>
          </Link>
        </li>
        <li className={styles.fab__item}>
          <button
            type="button"
            className={`${styles.fab__button} ${styles.fab__buttonSecondary}`}
            onClick={handleGoTop}
            aria-label="상단으로 이동"
            disabled={!showTop}
          >
            <span className={styles.fab__icon} aria-hidden="true">
              ↑
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
