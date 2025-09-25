// Next.js의 Metadata 타입 import
import type { Metadata } from "next";
import { headers } from "next/headers";
// 구글 폰트(GEIST) import
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/common.scss";

// 테넌트 추출 함수 import
import { getTenantFromHost } from "../lib/tenant";
import ThemeProvider from "./providers/ThemeProvider";

// Geist Sans 폰트 설정 (CSS 변수로 등록)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono 폰트 설정 (CSS 변수로 등록)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "";
  const tenant = getTenantFromHost(host) ?? "sk";
  const siteName =
    tenant === "sk" ? "SK쉴더스" : tenant === "adt" ? "ADT캡스" : "캡스홈";
  const baseUrl = `https://${host}`;

  return {
    metadataBase: new URL(baseUrl),
    title: { default: `${siteName}`, template: `%s | ${siteName}` },
    description: `${siteName} 공식 랜딩/서비스 소개`,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName,
      url: baseUrl,
      title: siteName,
      description: `${siteName} 공식 랜딩/서비스 소개`,
      images: [
        { url: "/images/sk/demo.png", width: 1200, height: 630, alt: siteName },
      ],
      locale: "ko_KR",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

// 루트 레이아웃 컴포넌트
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버 헤더에서 host 추출 (SSR 안전)
  const headerList = await headers();
  const host = headerList.get("host");
  // host로부터 테넌트 정보 추출
  const tenant = getTenantFromHost(host);
  // 테넌트별 CSS 클래스 생성 (예: tenant-cap, tenant-sk 등)
  const tenantClass = tenant ? `tenant-${tenant}` : undefined;
  return (
    <html lang="ko">
      {/* 폰트 변수와 테넌트 클래스를 body에 적용 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tenantClass ?? ""}`}
      >
        <ThemeProvider initialTenant={tenant}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
