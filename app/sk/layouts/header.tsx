'use client';
import React, { useState } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import { skHeaderMenus } from './menus';
import MzButton from '@/app/common/components/ui/mzButton';
import skLogo from '@/public/images/sk_logo.svg';

export default function Header() {
  const menus = skHeaderMenus;
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.inner_left}>
          <img src={skLogo.src} alt="쉴더스 로고" width={100} height={100} />
          <div className={styles.menus}>
            {menus.map((menu) => (
              <Link className={styles.menu_link} key={menu.label} href={menu.href}>
                {menu.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.inner_right}>
          <MzButton>검색</MzButton>
          <MzButton>KR</MzButton>
          <MzButton>ADT캡스</MzButton>
          <MzButton>캡스홈</MzButton>
        </div>
      </div>
      <div className={styles.menu_open}>
        <div className={styles.menu_open_inner}>
          {menus.map((menu) => (
            <>
              <Link className={styles.menu_link} key={menu.label} href={menu.href}>
                {menu.label}
              </Link>
              {menu.children && (
                <div className={styles.menu_children}>
                  {menu.children.map((child) => (
                    <Link className={styles.menu_children_link} key={child.label} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </header>
  );
}
