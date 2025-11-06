### 레이아웃 가이드 (SK 테넌트 공통)

본 문서는 SK 테넌트 화면 전반에 적용되는 레이아웃 원칙과 전역 유틸리티, 배너 높이 연동 방식, 섹션별 컨테이너 사용 패턴을 정리합니다. 다른 테넌트에도 동일한 패턴을 재사용할 수 있습니다.

---

## 목표

- 풀사이즈(100% 너비) 섹션과 1440px 제한 섹션을 유연하게 혼용
- 상단 헤더/배너 높이 변화에 따라 메뉴/본문이 자동 보정
- SSR/SEO/A11y 규칙을 유지하면서 단순한 코드 구조 유지

---

## 전역 유틸리티 클래스

전역 유틸은 `styles/common.scss`에 정의되어 있으며, 모든 페이지에서 즉시 사용 가능합니다.

- `layout__main`: 페이지 최상위 메인 래퍼
  - 기본 배경/텍스트 색, 오버플로우, 상단 패딩을 전역으로 관리합니다.
  - 상단 패딩은 `calc(헤더기본높이 + var(--banner-height))`를 사용해 배너 높이 변화에 자동 대응합니다.

- `layout__container`: 1440px 컨테이너
  - 컨텐츠를 1440px로 제한하고 좌우 20px 패딩을 제공합니다.
  - 섹션 내부에서 선택적으로 감싸서 사용합니다.

정의 위치: `styles/common.scss`

```scss
.layout__main {
  width: 100%;
  overflow: auto;
  margin: 0 auto;
  background-color: #fff;
  color: #000;
  padding-top: calc(100px + var(--banner-height, 0px));
}

.layout__container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
}
```

---

## 배너 높이 연동(전역 상태 + CSS 변수)

- 전역 상태: `stores/headerStore.ts`
  - `bannerHeight: number`
  - `setBannerHeight(height: number)`

- 헤더: `app/sk/layouts/header.tsx`
  - `ResizeObserver`로 `header__topBanner` 실제 높이를 관찰합니다.
  - 관찰 결과를 전역 store와 CSS 변수 `--banner-height`에 반영합니다.
  - 배너는 언마운트하지 않고 `header__topBannerCollapsed` 클래스로 접힘 애니메이션을 적용합니다.

- 스타일: `app/sk/layouts/header.module.scss`
  - 메뉴 오픈 컨테이너 `header__menu-open`의 `top`은 `calc(100px + var(--banner-height, 0px))`로 배너 높이를 반영합니다.

- 본문 상단 패딩
  - `layout__main`에서 `padding-top: calc(100px + var(--banner-height, 0px))` 적용

요약: 배너 높이 변경 → 전역 store 저장 + `--banner-height` 업데이트 → 메뉴 위치/본문 상단패딩 자동 보정

---

## 반응형/브레이크포인트

- 기준
  - Mobile: ≤ 719px
  - Tablet: 720–1023px(작은 PC)
  - PC: ≥ 1024px

- 적용 원칙
  - 태블릿은 PC 레이아웃을 유지하되, 여백/그리드/타이포를 축소 조정합니다.
  - 모바일은 단순화/스택 정렬을 우선하며, 상호작용 영역은 최소 40px을 확보합니다.
  - SCSS: 전역 믹스인 `@include tablet`, `@include mobile` 사용
  - JS/TS: 분기 필요 시 `useBreakpoint()` 또는 `useMediaQuery(mediaQueries.*)` 사용

---

## 전역 여백 토큰 사용 가이드

- 여백은 전역 CSS 변수 `--space-*` 스케일을 사용합니다. (정의: `styles/common.scss`)
- PC와 모바일에서 같은 토큰 키를 참조하면, 스케일 차이가 자동으로 반영됩니다.

예시

```scss
.someGrid {
  display: grid;
  gap: var(--space-6); // PC: 20px(1.25rem), Mobile: 12px(0.75rem)
}

.section {
  padding: var(--space-10) 0; // PC: 40px, Mobile: 20px
}
```

토큰 요약

- PC(root): 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 52, 60, 68, 80, 100, 120, 140, 160(px)
- Mobile: 4, 4, 6, 8, 8, 12, 14, 16, 16, 20, 24, 28, 28, 32, 40, 44, 60, 72, 80(px)

참고: 각 값의 rem 환산은 16px = 1rem 기준입니다. 주석으로 병기되어 있습니다.

---

## 섹션별 사용 패턴

1. 풀사이즈 섹션(배경/밴드 등 전체 폭 사용)

```tsx
// 섹션은 full-width, 내부 컨텐츠만 컨테이너로 제한
<section className="someFullWidthSection">
  <div className="layout__container">{/* 제한된 1440px 컨텐츠 */}</div>
  {/* 필요 시 섹션 배경/장식 요소는 섹션 레벨에서 처리 */}
  {/* 배경 이미지는 CSS에서 관리 권장 */}
  {/* 접근성: 섹션에 aria-label 또는 헤딩 계층(h2–h3) 보장 */}
</section>
```

2. 컨테이너 섹션(문단/폼/리스트 등 제한 폭)

```tsx
// 컨텐츠 자체가 제한 폭만 필요할 때 섹션을 바로 컨테이너로 구성
<section className="layout__container">{/* 1440px 제한 컨텐츠 */}</section>
```

3. 페이지 최상위 구성

```tsx
// 메인은 전역 클래스 layout__main 사용(상단 패딩/배경/색 관리)
<main className="layout__main">{children}</main>
```

권장 사항

- 섹션마다 의미 있는 헤딩(h2–h3)과 랜드마크를 부여하세요.
- 네비게이션/메뉴/배너는 시맨틱 태그(`header`, `nav`, `main`, `footer`)를 사용하세요.

---

## 헤더 배너 접힘 애니메이션

- 언마운트 대신 클래스 토글(`header__topBannerCollapsed`)로 접힘 처리
- `max-height`/`padding`/`opacity`에 transition 적용 → 아래에서 위로 접힘 효과

주의

- 배너 높이는 콘텐츠에 따라 달라지므로 하드코딩하지 않습니다.
- 높이 변화는 `ResizeObserver`가 감지하여 전역으로 전파됩니다.

---

## SSR/CSR 경계

- 브라우저 API(ResizeObserver) 사용 코드는 클라이언트 컴포넌트(`"use client"`)에서만 처리합니다.
- 레이아웃/페이지는 SSR 안전성을 유지하고, 전역 상태/스타일만 의존합니다.

---

## 접근성(A11y) 체크

- 레이아웃 헤딩 계층: 페이지 당 `h1` 1회, 섹션별 `h2–h3` 계층 유지
- 랜드마크 태그 사용: `header`/`nav`/`main`/`footer`
- 네비게이션: `aria-current="page"` 적용
- 배너 닫기 버튼: 적절한 `aria-label`과 상태(`aria-expanded`) 관리

---

## 페이지 적용 예시(요약)

```tsx
// app/sk/layout.tsx (발췌)
<div className="layout__container">
  <BreadCrumb />
</div>
<Banner items={banner} />
<ClientMain className="layout__main">{children}</ClientMain>
```

```tsx
// app/sk/page.tsx (발췌)
<section className={S.count}>
  <div className="layout__container">
    {/* 제한 폭 컨텐츠 */}
  </div>
</section>

<section className={S.news}>
  <div className="layout__container">{/* 제한 폭 컨텐츠 */}</div>
</section>
```

---

## 참고 파일

- 전역 유틸/변수: `styles/common.scss`
- 헤더(배너 연동): `app/sk/layouts/header.tsx`, `app/sk/layouts/header.module.scss`
- 전역 상태: `stores/headerStore.ts`
- 레이아웃: `app/sk/layout.tsx`, `app/sk/layout.module.scss`
- 메인 클라이언트 래퍼: `app/sk/layouts/mainClient.tsx`
