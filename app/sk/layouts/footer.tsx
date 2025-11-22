"use client";
import React, { useState } from "react";
import S from "./footer.module.scss";
import Link from "next/link";
import MzSelectBox from "@/app/common/components/atom/mzSelectBox";
import MzButton from "@/app/common/components/atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";
import Image from "next/image";

type FooterLink = { label: string; href: string };
type FooterSns = { label: string; href: string; icon: string };

export default function Footer() {
  const { isMobile } = useBreakpoint();

  // PC 링크 데이터
  const pcLinks = {
    group1: [
      { label: "개인정보처리방침", href: "#" },
      { label: "영상정보보처리방침", href: "#" },
      { label: "사업자등록증", href: "#" },
    ],
    group2: [
      { label: "위치기반서비스 이용약관", href: "#" },
      { label: "신용정보활용체제공시", href: "#" },
      { label: "SK윤리경영", href: "/about/esg" },
    ],
  };

  // 모바일 링크 데이터
  const moLinks: FooterLink[] = [
    { label: "개인정보처리방침", href: "#" },
    { label: "영상정보보처리방침", href: "#" },
    { label: "사업자등록증", href: "#" },
    { label: "위치기반서비스 이용약관", href: "#" },
    { label: "신용정보활용체제공시", href: "#" },
    { label: "SK윤리경영", href: "/about/esg" },
  ];

  // SNS 데이터 (모바일 순서: Instagram, Facebook, Blog, YouTube)
  const snsLinks: FooterSns[] = isMobile
    ? [
        {
          label: "Instagram",
          href: "#",
          icon: "/images/common/ico_40_instargram.svg",
        },
        {
          label: "Facebook",
          href: "#",
          icon: "/images/common/ico_40_facebook.svg",
        },
        { label: "Blog", href: "#", icon: "/images/common/ico_40_naver.svg" },
        {
          label: "YouTube",
          href: "#",
          icon: "/images/common/ico_40_youtube.svg",
        },
      ]
    : [
        {
          label: "YouTube",
          href: "#",
          icon: "/images/common/ico_40_youtube.svg",
        },
        { label: "Blog", href: "#", icon: "/images/common/ico_40_naver.svg" },
        {
          label: "Facebook",
          href: "#",
          icon: "/images/common/ico_40_facebook.svg",
        },
        {
          label: "Instagram",
          href: "#",
          icon: "/images/common/ico_40_instargram.svg",
        },
      ];

  const options = [
    { label: "FAMILY SITE", value: "FAMILY SITE" },
    { label: "SK쉴더스", value: "SK쉴더스" },
    { label: "ADT캡스", value: "ADT캡스" },
    { label: "캡스홈", value: "캡스홈" },
  ];

  const [selected, setSelected] = useState<string>(options[0].value);

  return (
    <footer className={S.footer}>
      <div className={S.footer__inner}>
        {/* 상단: 제목 + 전화 + 버튼 */}
        <div className={S.footer__top}>
          {/* PC 전용 제목 */}
          {!isMobile && (
            <div className={S.footer__title}>
              <h2>
                SK쉴더스의
                <br />
                전문가와 상담하세요.
              </h2>
            </div>
          )}

          {/* 전화 정보 */}
          <div className={S.footer__phone}>
            <span className={S.footer__phoneLabel}>전화상담</span>
            <a href="tel:18006400" className={S.footer__phoneNumber}>
              1800-6400
            </a>
            <p className={S.footer__phoneTime}>
              평일 09:00~18:00 (토/일/공휴일 휴무)
            </p>
          </div>

          {/* 버튼 */}
          <div className={S.footer__buttons}>
            <MzButton
              className={S.footer__btnPrimary}
              aria-label="사이버보안 전문상담"
            >
              사이버보안 전문상담
            </MzButton>
            <MzButton
              className={S.footer__btnSecondary}
              aria-label="산업보안 전문상담"
            >
              산업보안 전문상담
            </MzButton>
          </div>
        </div>

        {/* 구분선 */}
        <div className={S.footer__divider} />

        {/* 하단 */}
        <div className={S.footer__bottom}>
          {/* 로고 + 회사 정보 */}
          <div className={S.footer__company}>
            <div className={S.footer__logo}>
              <Image
                src="/images/sk/sk_logo.svg"
                alt="SK쉴더스"
                width={96}
                height={46}
              />
            </div>
            <p className={S.footer__companyName}>에스케이쉴더스 주식회사</p>
            <address className={S.footer__address}>
              {isMobile ? (
                <>
                  경기도 성남시 분당구 판교로 227번길 23, 4&5층 13486
                  <br />
                  사업자등록번호 : 120-86-07747
                </>
              ) : (
                <>
                  13486 경기도 성남시 분당구 판교로 227번길 23, 4&5층
                  <br />
                  사업자등록번호 : 120-86-07747
                </>
              )}
            </address>
            <p className={S.footer__copyright}>
              COPYRIGHT © 2026 SK SHIELDUS. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* 링크 */}
          {!isMobile ? (
            <nav className={S.footer__links} aria-label="푸터 링크">
              <ul className={S.footer__linkGroup}>
                {pcLinks.group1.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className={i === 0 ? S.footer__linkEmphasis : ""}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className={S.footer__linkGroup}>
                {pcLinks.group2.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <nav className={S.footer__linksMobile} aria-label="푸터 링크">
              {moLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={i === 0 ? S.footer__linkEmphasis : ""}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* SNS */}
          <div className={S.footer__sns}>
            {!isMobile
              ? snsLinks.map((sns, i) => (
                  <a
                    key={i}
                    href={sns.href}
                    className={S.footer__snsItem}
                    aria-label={sns.label}
                  >
                    <Image
                      src={sns.icon}
                      alt=""
                      width={isMobile ? 40 : 32}
                      height={isMobile ? 40 : 32}
                    />
                    <span>{sns.label}</span>
                  </a>
                ))
              : snsLinks.map((sns, i) => (
                  <a
                    key={i}
                    href={sns.href}
                    className={S.footer__snsItemMobile}
                    aria-label={sns.label}
                  >
                    <Image src={sns.icon} alt="" width={40} height={40} />
                  </a>
                ))}
          </div>

          {/* 뉴스레터 + Family Site + 인증 */}
          <div className={S.footer__extra}>
            {isMobile && (
              <MzButton className={S.footer__btnNewsletter}>
                뉴스레터 구독신청
              </MzButton>
            )}

            <div className={S.footer__familySelect}>
              {!isMobile && (
                <MzButton className={S.footer__btnNewsletter}>
                  뉴스레터 구독신청
                </MzButton>
              )}
              <MzSelectBox
                style={{ width: isMobile ? "100%" : "" }}
                nood={true}
                options={options}
                selected={
                  options.find((o) => o.value === selected)?.label ||
                  options[0].label
                }
                onSelect={(v: string) => setSelected(v)}
              />
            </div>

            <div className={S.footer__certifications}>
              <div className={S.footer__certLogos}>
                <Image
                  src="/images/common/isms_logo.svg"
                  alt="ISMS 인증"
                  width={isMobile ? 45 : 53}
                  height={isMobile ? 40 : 48}
                />
                <Image
                  src="/images/common/iso_logo.svg"
                  alt="ISO 인증"
                  width={isMobile ? 81 : 85}
                  height={isMobile ? 41 : 43}
                />
              </div>
              <p className={S.footer__certText}>
                <strong>인증범위</strong> : SK쉴더스 대표 홈페이지 및 홈보안 /
                물리보안 / 정보보안 / 융합보안 / 케어 서비스 운영
                <br />
                <strong>유효기간</strong> : 2023.08.02 ~ 2026.08.01
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
