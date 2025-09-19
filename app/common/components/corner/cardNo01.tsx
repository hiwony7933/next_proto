import React, { useRef, useEffect, useState } from 'react';
import styles from './cardNo01.module.scss';

const IMG_URL = '//cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/65f9638523f5ce1133c0bacb_cmshome-hero.webp';

export default function CardNo01() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // 화면에 들어온 비율 계산 (0~1)
      const visible = 1 - Math.max(0, rect.top) / windowHeight;
      // scale: 0.8 ~ 1.2
      const newScale = 0.8 + Math.max(0, Math.min(visible, 1)) * 0.4;
      setScale(newScale);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={imgRef}
      className={styles.cardNo01}
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
        willChange: 'transform',
      }}
    >
      <img src={IMG_URL} alt="cardNo01" />
    </div>
  );
}
