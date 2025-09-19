'use client';

import React from 'react';
import Link from 'next/link';
import styles from './cornerBanner002.module.scss';

interface CornerBanner002Props {
  title: string;
  pcImage: string;
  mobileImage: string;
  link: string;
  target?: boolean;
}

export default function CornerBanner002({
  title,
  pcImage,
  mobileImage,
  link,
  target = false,
}: CornerBanner002Props) {
  return (
    <Link
      href={link}
      target={target ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={styles.cornerBanner002}
    >
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <img src={pcImage} alt={title} className={styles.image} />
      </picture>
    </Link>
  );
}
