"use client";
import React, { useState } from "react";
import S from "./footer.module.scss";
import Link from "next/link";
import MzSelectBox from "@/app/common/components/atom/mzSelectBox";
import MzButton from "@/app/common/components/atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";
import Image from "next/image";
// public 자산은 URL 사용 권장(또는 next/image 문자열 경로)

type FooterLink = { label: string; href: string };
type FooterLinkGroup = { id: string; items: FooterLink[] };
type FooterSns = { label: string; href: string; short: string };

export default function Footer() {
  const { isMobile } = useBreakpoint();
  // 링크 그룹(순서 보장)과 SNS를 배열로 관리
  const pcLinkGroups: FooterLinkGroup[] = [
    {
      id: "group01",
      items: [
        { label: "개인정보처리방침", href: "#" },
        { label: "위치기반서비스 이용약관", href: "#" },
        { label: "영상정보처리방침", href: "#" },
        { label: "신용정보활용체제공시", href: "#" },
        { label: "사업자등록증", href: "#" },
      ],
    },
    {
      id: "group02",
      items: [
        { label: "회사소개", href: "/about" },
        { label: "SK윤리경영", href: "/about/esg" },
        { label: "채용정보", href: "#" },
        { label: "ESG경영", href: "/about/esg" },
      ],
    },
  ];
  const moLinkGroups: FooterLinkGroup[] = [
    {
      id: "group01",
      items: [
        { label: "회사소개", href: "/about" },
        { label: "개인정보처리방침", href: "#" },
        { label: "영상정보처리방침", href: "#" },
        { label: "위치기반서비스 이용약관", href: "#" },
        { label: "신용정보활용체제공시", href: "#" },
      ],
    },
    // {
    //   id: "group02",
    //   items: [
    //     { label: "SK윤리경영", href: "/about/esg" },
    //     { label: "채용정보", href: "#" },
    //     { label: "사업자등록증", href: "#" },
    //     { label: "ESG경영", href: "/about/esg" },
    //   ],
    // },
  ];
  const snsLinks: FooterSns[] = [
    {
      label: "Facebook",
      href: "#",
      short: "/images/common/ico_40_facebook.svg",
    },
    {
      label: "YouTube",
      href: "#",
      short: "/images/common/ico_40_youtube.svg",
    },
    {
      label: "Blog",
      href: "#",
      short: "/images/common/ico_40_naver.svg",
    },

    {
      label: "Instagram",
      href: "#",
      short: "/images/common/ico_40_instargram.svg",
    },
  ];
  const linkGroups: FooterLinkGroup[] = isMobile ? moLinkGroups : pcLinkGroups;
  const options = ["Family Site", "SK쉴더스", "ADT캡스", "캡스홈"];
  const [selected, setSelected] = useState<string>(options[0]);
  const selectedOption = options.find((o) => o === selected);
  return (
    <footer className={S.footer}>
      <div className={S.footer__inner}>
        {/* Top: Title + Phone + SNS/Family */}
        <div className={S.footer__top}>
          <div className={S.footer__topLeft}>
            <h2 className={S.footer__title}>
              SK쉴더스의
              <br />
              전문가와 상담하세요.
            </h2>
            <p className={S.footer__desc}>
              원하는 상담 내용과 간단한 정보를 남겨주시면
              <br />
              전문 상담사가 친절히 돕겠습니다.
            </p>
          </div>

          <div className={S.footer__topCenter}>
            <div className={S.footer__topCenterInner}>
              <div className={S.footer__topCenterInnerContent}>
                <div className={S.footer__phone}>
                  <div className={S.footer__phoneNumberWrapper}>
                    <span className={S.footer__phoneLabel}>
                      {isMobile ? "SK쉴더스 고객센터" : "전화상담"}
                    </span>
                    <strong
                      className={S.footer__phoneNumber}
                      aria-label="전화상담 번호 1800-6400"
                    >
                      1800-6400
                    </strong>
                  </div>
                  <span className={S.footer__phoneTime}>
                    평일 09:00~18:00 (토/일/공휴일 휴무)
                  </span>
                </div>
                <div className={S.footer__actions}>
                  <MzButton
                    className={S.footer__actionBtn}
                    aria-label="정보보안 전문상담"
                  >
                    정보보안 전문상담
                  </MzButton>
                  <MzButton
                    className={S.footer__actionBtn}
                    aria-label="ADT 캡스 상담 (물리보안)"
                  >
                    ADT 캡스 상담{" "}
                    <span className={S.footer__actionSub}>(물리보안)</span>
                  </MzButton>
                </div>
              </div>
            </div>
          </div>

          <div className={S.footer__topRight}>
            <ul className={S.footer__snsList} aria-label="SK쉴더스 SNS">
              {snsLinks.map((sns, idx) => (
                <li key={idx} className={S.footer__snsItem}>
                  <MzButton
                    aria-label={sns.label}
                    className={S.footer__snsLink}
                    icon={true}
                    href={sns.href}
                  >
                    <Image
                      src={sns.short}
                      alt={sns.label}
                      width={40}
                      height={40}
                    />
                  </MzButton>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: Logo + Links + Certified */}
        <div className={S.footer__bottom}>
          <div className={S.footer__bottomLeft}>
            <div className={S.footer__logo}>
              <img src="/images/sk/sk_logo.svg" alt="SK쉴더스" />
            </div>
            <div className={S.footer__company}>
              <strong className={S.footer__companyName}>
                에스케이쉴더스 주식회사
              </strong>
              <address className={S.footer__address}>
                13486 경기도 성남시 분당구 판교로 227번길 23, 4&5층
                <br />
                사업자등록번호 : 120-86-07747
              </address>
              <div className={S.footer__copyEn}>
                COPYRIGHT © 2026 SK SHIELDUS. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>

          <nav className={S.footer__bottomCenter} aria-label="푸터 링크">
            <div className={S.footer__bottomCenterInner}>
              <div className={S.footer__links}>
                {linkGroups.map((group, groupIdx) => (
                  <React.Fragment key={group.id}>
                    <ul className={S.footer__linkGroup}>
                      {group.items.map((link, i) => (
                        <li key={`${group.id}-${i}`}>
                          <Link
                            className={`${S.footer__link} ${
                              groupIdx === 0 && i === 0
                                ? S.footer__linkEmphasis
                                : ""
                            }`}
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {groupIdx < linkGroups.length - 1 ? (
                      <span className={S.footer__slash} aria-hidden="true" />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </nav>

          <div className={S.footer__bottomRight}>
            <div className={S.footer__familySelect}>
              <MzSelectBox
                options={options.map((o) => ({ label: o, value: o }))}
                selected={selected}
                onSelect={(v: string) => setSelected(v)}
              />
            </div>
            <img src="/images/common/iso_logo.svg" alt="" />
            <div className={S.footer__certLogos} aria-hidden="true">
              <img src="/images/common/isms_logo.svg" alt="" />
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
