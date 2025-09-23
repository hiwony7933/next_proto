export type HeaderThirdMenu = {
  label: string;
  href: string;
};

export type HeaderSecondMenu = {
  label: string;
  href: string;
  children?: HeaderSecondMenu[];
};

export type HeaderMenuItem = {
  label: string;
  href: string;
  children?: HeaderSecondMenu[];
};

export const skHeaderMenus: HeaderMenuItem[] = [
  {
    label: "정보보안",
    href: "",
    children: [
      {
        label: "중소기업보안",
        href: "",
        children: [
          { label: "서비스", href: "" },
          { label: "사고대응", href: "" },
          { label: "모의해킹", href: "" },
          { label: "취약점진단", href: "" },
        ],
      },
      {
        label: "보안 관제 서비스",
        href: "",
        children: [
          { label: "원격 보안 관제(MSS)", href: "" },
          { label: "파견 보안 관제", href: "" },
          { label: "MDR서비스", href: "" },
        ],
      },
      {
        label: "보안 컨설팅",
        href: "",
        children: [
          { label: "취약점 진단", href: "" },
          { label: "통합 정보 보호", href: "" },
          { label: "정보 보안 관리체계", href: "" },
          { label: "모의해킹", href: "" },
          { label: "개인정보보호", href: "" },
          { label: "해킹사고분석", href: "" },
        ],
      },
      {
        label: "클라우드보안",
        href: "",
      },
      {
        label: "솔루션/SI",
        href: "",
        children: [
          { label: "보안 SI", href: "" },
          { label: "모바일가드", href: "" },
          { label: "오피스홈", href: "" },
          { label: "총판솔루션", href: "" },
        ],
      },
    ],
  },
  {
    label: "시설보안",
    href: "",
    children: [
      { label: "산업안전", href: "" },
      { label: "시설관리(FM)", href: "" },
      { label: "스마트팩토리(OT보안)", href: "" },
    ],
  },
  {
    label: "인사이트",
    href: "",
    children: [
      { label: "2025", href: "" },
      { label: "archive", href: "" },
    ],
  },
  {
    label: "고객지원",
    href: "/sk/support",
    children: [
      { label: "이벤트", href: "/sk/support/event" },
      { label: "공지사항", href: "/sk/support/notice" },
      { label: "FAQ", href: "/sk/support/faq" },
      { label: "브로셔", href: "/sk/support/brochure" },
      { label: "청구세금계산서", href: "/sk/support/invoice" },
    ],
  },
  {
    label: "회사소개",
    href: "/sk/about",
    children: [
      { label: "SK쉴더스", href: "/sk/about/sk" },
      { label: "연혁", href: "/sk/about/history" },
      { label: "ESG윤리 경영", href: "/sk/about/esg" },
      { label: "전자공고", href: "/sk/about/notice" },
      { label: "News", href: "/sk/about/news" },
      { label: "CI/BI", href: "/sk/about/ci" },
    ],
  },
];
