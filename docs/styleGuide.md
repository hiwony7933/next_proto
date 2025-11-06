# 스타일 가이드 (SK Shields Renewal)

본 문서는 프로젝트 전반의 스타일/네이밍/구성 원칙을 요약합니다. 코드 반영과 함께 지속적으로 업데이트됩니다.

## 1) 네이밍 규칙

- 기본: camelCase
  - 변수/함수/폴더/비-컴포넌트 파일명은 camelCase 사용
  - 예외: React 컴포넌트 파일/컴포넌트명은 PascalCase

## 2) CSS Modules + BEM

- SCSS Modules를 사용하고 BEM(Block\_\_Element--Modifier) 네이밍을 적용합니다.
- JS/TS에서는 대시(-)가 포함된 클래스에 camelCase 접근을 지원합니다.
  - `.header-container` → `styles.headerContainer`
  - `.card__button--primary` → `styles.card__buttonPrimary`
- SCSS에서는 BEM 표기를 그대로 유지합니다. 접근 방식만 camelCase를 허용합니다.

### SCSS 예시

```scss
.card {
  border: 1px solid #eee;

  &__title {
    font-size: 1.2rem;
  }

  &__button {
    padding: 8px;

    &--primary {
      background-color: blue;
      color: white;
    }
  }
}
```

### TSX 예시

```tsx
<div className={styles.card}>
  <h2 className={styles.card__title}>Card Title</h2>
  <button className={`${styles.card__button} ${styles.card__buttonPrimary}`}>
    Action
  </button>
</div>
```

### 주의사항

- 브래킷 접근도 가능하나, 일관성을 위해 점 표기(camelCase) 사용을 권장합니다.
- 브라우저 전용 라이브러리/DOM 접근은 클라이언트 컴포넌트에서만 처리합니다.

## 3) SSR/Next 15 규칙 요약

- 동적 라우트 params는 서버 컴포넌트에서 await 처리
- 브라우저 전용 라이브러리는 클라이언트에서 dynamic import + `ssr: false` 사용
- public 자산은 URL 경로(`/images/...`) 또는 `next/image` 사용

## 4) 테넌트/테마

- `middleware.ts`로 호스트→테넌트 매핑, `app/layout.tsx`에서 body에 `tenant-xxx` 클래스 부여
- Zustand + `ThemeProvider`로 tenant/mode 상태 관리

## 5) 포맷터/린트

- ESLint: next/core-web-vitals + typescript + prettier
- Prettier: 규칙은 루트 설정 준수, 포맷 스크립트 사용

## 6) 운영 원칙(문서화)

- 변경 발생 시 PR에 문서 변경을 포함합니다(해당 섹션 링크 포함).
- UI 패턴/샘플은 `app/guide`에 추가하고, 본 문서에 참고 링크를 남깁니다.
- 릴리스 노트에 문서 변경 요약을 포함해 팀에 공지합니다.

## 7) 접근성(A11y) — 구조/마크업 범위

- 본 프로젝트 접근성 범위는 구조/마크업 중심입니다(명도 대비 등 디자인 항목 제외).
- 핵심 체크리스트
  - 버튼: 텍스트 없으면 `aria-label`/`aria-labelledby`; 토글은 `aria-expanded`/`aria-controls` 및 대상 패널 `role="region"`, `aria-labelledby` 연결
  - 링크 vs 버튼: 네비게이션은 `a/Link(href)`, 동작은 `button`
  - 이미지: 의미 있는 이미지 `alt`, 장식/아이콘은 `alt=""` + `aria-hidden="true``
  - 테이블: `caption`(시각적 숨김 가능), `thead/tbody`, `th scope="col|row"` 권장
  - 폼: `label`↔`input`(htmlFor/id) 또는 `aria-labelledby`, 도움말/오류는 `aria-describedby`
  - 제목/랜드마크: `h1–h6` 실제 텍스트, `header/nav/main/footer` 시맨틱 태그
- 린트: `eslint-plugin-jsx-a11y` 적용(구조/마크업 규칙). 가이드 샘플(`app/guide/**`)은 린트 제외.
- 상세 규칙과 예시는 `.cursor/rules/a11y.mdc`를 참조하세요.

## 8) 아이콘/로고 클래스 관리(전역 .icon\_\_\*)

- 기본 원칙
  - 단색 아이콘/로고는 CSS mask 기반 전역 클래스(`.icon__*`)로 관리합니다.
  - 기본 색상은 전역 클래스에 선언하고, 페이지/모듈에서 필요 시 오버라이드합니다.
  - 자산은 `public/icons` 또는 테넌트 경로(`public/images/<tenant>/...`)에 둡니다.

- 네이밍
  - 전역 클래스: `.icon__<kebab-case-name>`
  - 예: `.icon__adt-logo`, `.icon__search`, `.icon__close`

- 구현 위치/패턴
  - 파일: `styles/_icon.scss`에 정의하고, `styles/common.scss`에서 1회 `@import`합니다.
  - 스타일: `mask`(웹킷 접두 포함)로 벡터를 마스킹하고, `background-color`로 색상을 채웁니다.

```scss
// styles/_icon.scss
.icon {
  &__adt-logo {
    display: inline-block;
    width: 195px;
    height: 46px;
    background-color: #003594; // 기본 색(필요 시 테넌트 변수로 교체 가능)
    -webkit-mask: url("/images/sk/faq_adt_logo.svg") no-repeat center / contain;
    mask: url("/images/sk/faq_adt_logo.svg") no-repeat center / contain;
  }
}
```

- 페이지 사용(오버라이드 포함)
  - 의미 있는 아이콘/로고: `role="img"` + `aria-label` 제공
  - 장식용: `aria-hidden="true"`

```tsx
// 인라인 스타일로 색/크기 오버라이드
<i
  className="icon__adt-logo"
  role="img"
  aria-label="ADT캡스 로고"
  style={{ backgroundColor: 'var(--brand-color)', width: 210, height: 50 }}
/>

// 모듈 SCSS로 오버라이드
<i className={`icon__adt-logo ${S.myAdtLogo}`} role="img" aria-label="ADT캡스 로고" />
```

```scss
// page.module.scss
.myAdtLogo {
  background-color: var(--brand-color);
  width: 210px;
  height: 50px;
}
```

- 테넌트/테마 연동
  - 전역 기본색은 가능하면 CSS 변수 사용: `background-color: var(--brand-color, #003594)`
  - `body.tenant-<키>` 범위에서 변수만 바꿔 테마를 전파합니다.

- 다른 방식을 선택해야 하는 경우
  - 다색(멀티컬러) 아이콘/로고: 인라인 SVG 또는 SVGR 컴포넌트 사용 권장
  - 비트맵/사진: `next/image` 사용
  - 주의: `next/image`로는 `currentColor`를 SVG 내부에 전달할 수 없습니다.

- 추가/운영 절차
  1. SVG를 `public/icons` 또는 테넌트 경로에 저장
  2. `styles/_icon.scss`에 `.icon__<name>` 추가(크기/기본색/mask 지정)
  3. 화면에서 `<i className="icon__<name>" />`로 사용
  4. 색/크기는 페이지에서 인라인 또는 모듈 SCSS로 오버라이드
  5.

## 9) 반응형/브레이크포인트

- 기준(픽셀)
  - Mobile: ≤ 719px
  - Tablet: 720–1023px(작은 PC로 간주, PC 레이아웃을 소폭 축소/재배열)
  - PC: ≥ 1024px

- SCSS 믹스인(전역 `styles/_mixin.scss`)

```scss
// 모바일, 테블릿 같이 선언
@include mobiles {
  /* ... */
}

// tablet: 720–1023
@include tablet {
  /* ... */
}

// mobile: ≤719
@include mobiles {
  /* ... */
}
```

- JS/TS 분기(모바일 전용 분기 필요 시)

```ts
// 권장: 3분기 상태 사용
const { isMobile, isTablet, isDesktop } = useBreakpoint();
// 또는 특정 쿼리만 필요하면
const isTabletOnly = useMediaQuery(mediaQueries.tablet);
```

- 가이드
  - 태블릿은 “작은 PC”: PC 레이아웃/타이포를 유지하되 간격/그리드를 축소 조정
  - 모바일은 단순화/스택 정렬, 클릭 타겟 최소 40px, 주요 액션은 하단에 배치 권장

## 10) 여백 스케일(Spacing Tokens)

- 정의 위치: `styles/common.scss`의 `::root` 및 `@include mobiles { :root { ... } }`
- 사용 방법: `var(--space-<n>)` 형태로 여백을 참조합니다. (예: `gap: var(--space-6)`)

### PC 기본 값 (root)

```scss
::root {
  /* 기본 여백 토큰 (px 값은 실제 변수 값, 주석은 rem 기준 안내) */
  --space-1: 4px; /* 0.25rem */
  --space-2: 6px; /* 0.375rem */
  --space-3: 8px; /* 0.5rem */
  --space-4: 12px; /* 0.75rem */
  --space-5: 16px; /* 1rem */
  --space-6: 20px; /* 1.25rem */
  --space-7: 24px; /* 1.5rem */
  --space-8: 28px; /* 1.75rem */
  --space-9: 32px; /* 2rem */
  --space-10: 40px; /* 2.5rem */
  --space-11: 48px; /* 3rem */
  --space-12: 52px; /* 3.25rem */
  --space-13: 60px; /* 3.75rem */
  --space-14: 68px; /* 4.25rem */
  --space-15: 80px; /* 5rem */
  --space-16: 100px; /* 6.25rem */
  --space-17: 120px; /* 7.5rem */
  --space-18: 140px; /* 8.75rem */
  --space-19: 160px; /* 10rem */
}
```

### 모바일 값 (mobile mixin 내부)

```scss
@include mobiles {
  :root {
    --space-1: 4px; /* 0.25rem */
    --space-2: 4px; /* 0.25rem */
    --space-3: 6px; /* 0.375rem */
    --space-4: 8px; /* 0.5rem */
    --space-5: 8px; /* 0.5rem */
    --space-6: 12px; /* 0.75rem */
    --space-7: 14px; /* 0.875rem */
    --space-8: 16px; /* 1rem */
    --space-9: 16px; /* 1rem */
    --space-10: 20px; /* 1.25rem */
    --space-11: 24px; /* 1.5rem */
    --space-12: 28px; /* 1.75rem */
    --space-13: 28px; /* 1.75rem */
    --space-14: 32px; /* 2rem */
    --space-15: 40px; /* 2.5rem */
    --space-16: 44px; /* 2.75rem */
    --space-17: 60px; /* 3.75rem */
    --space-18: 72px; /* 4.5rem */
    --space-19: 80px; /* 5rem */
  }
}
```

권장사항

- 개별 컴포넌트에서는 고정 px 대신 여백 토큰을 참조하세요.
- PC/모바일 모두 동일 토큰 키를 사용하여 스케일 차이를 자동 전파합니다.

## 11) 타이포그래피(Typography)

- 정의 위치: `styles/_fonts.scss`
- 구성
  - PC 토큰: `$typography-tokens`
  - 모바일 토큰: `$typography-tokens-mobile`
  - 믹스인: `@mixin typography($token)`, `@mixin typographyMobile($token)`, `@mixin typographyBoth($pcToken, $mobileOverride: null)`
- 사용 원칙
  - 기본은 `typographyBoth` 사용으로 PC/모바일 한 번에 처리합니다.
  - 예외적으로 모바일에 다른 단계나 하드코딩이 필요하면 `mobileOverride`를 문자열(토큰) 또는 맵(수치)으로 전달합니다.

### 기본 헤딩 매핑

- 전역(`styles/common.scss`)에서 아래 규칙이 적용됩니다.
  - `h2` → `h2B`
  - `h3` → `h3B`
  - `h4` → `h4B`
- 즉, 마크업에서 `<h2>...</h2>`만 사용해도 자동으로 디자인 토큰이 반영됩니다.
- 테넌트/화면 특이 케이스에서는 클래스 추가 후 `typographyBoth`로 오버라이드하세요.

### 사용 예

```scss
/* PC 전용 */
.pageTitle {
  @include typography(t1B);
}

/* 모바일 전용 */
.pageTitleMo {
  @include typographyMobile(t1B);
}

/* 반응형(권장) - 같은 키 매핑 */
.titleBoth {
  @include typographyBoth(t2B);
}

/* 반응형 - 모바일만 다른 토큰 */
.titleBothStrong {
  @include typographyBoth(b4R, b3B);
}

/* 반응형 - 모바일 하드코딩 맵 */
.bodyCustomMo {
  @include typographyBoth(
    b4R,
    (
      size: 15px,
      lineHeight: 150%,
      weight: 500,
      letterSpacing: -0.15px,
    )
  );
}
```

참고: font-family는 전역(`styles/common.scss`)에서 적용됩니다.
