## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Docs

문서는 `/docs` 폴더에서 확인할 수 있습니다.

## 로컬 호스트 매핑(Hosts) 설정

멀티 테넌트 로컬 개발을 위해 `hosts` 파일에 아래 항목을 추가해 주세요.

macOS/Linux: `/etc/hosts`, Windows: `C:\\Windows\\System32\\drivers\\etc\\hosts`

```
127.0.0.1 sk.localhost
127.0.0.1 adt.localhost
127.0.0.1 cap.localhost
```

적용 후 개발 서버를 재시작하세요. 접속 예시:

- http://localhost:3000 (포털)
- http://sk.localhost:3000
- http://adt.localhost:3000
- http://cap.localhost:3000

쿼리로 강제 지정도 가능합니다: `http://localhost:3000?tenant=adt`

## Dev 환경 도메인 구성

배포용 Dev 환경에서는 다음 ENV로 호스트→테넌트 매핑을 설정합니다. 도메인이 확정되면 실제 값으로 교체하세요.

ENV 파일: `.env.dev`

```
TENANT_SK_HOST=sk.dev.example.com
TENANT_CAPS_HOST=cap.dev.example.com
TENANT_ADT_HOST=adt.dev.example.com
NEXT_PUBLIC_DEV_TENANT=sk
```

동작 개요

- 미들웨어가 요청 host를 기준으로 테넌트를 판별하고 내부적으로 `/${tenant}`로 rewrite합니다.
- 모든 요청에는 `x-tenant` 헤더가 주입되며, 서버 컴포넌트는 이를 우선 사용합니다.
- 도메인이 확정되면 위 값을 실제 서브도메인으로 교체하여 재배포합니다.

## 스타일 가이드

### CSS Modules + BEM (camelCase 접근)

- 컴포넌트 전용 스타일은 SCSS Modules와 BEM 네이밍을 사용합니다.
- 하이픈(-)이 포함된 클래스는 JS/TS에서 camelCase로 접근할 수 있습니다.
  - `.header-container` → `styles.headerContainer`
  - `.card__button--primary` → `styles.card__buttonPrimary`
- SCSS에서는 BEM 표기를 그대로 유지하고, JS/TS 접근만 camelCase를 사용합니다.
- 필요 시 브래킷 표기도 가능: `styles['card__button--primary']`.

예시 (SCSS):

```scss
.card {
  /* Block styles */
  border: 1px solid #eee;

  &__title {
    /* Element styles */
    font-size: 1.2rem;
  }

  &__button {
    /* Element styles */
    padding: 8px;

    &--primary {
      /* Modifier styles */
      background-color: blue;
      color: white;
    }
  }
}
```

예시 (TSX):

```tsx
<div className={styles.card}>
  <h2 className={styles.card__title}>Card Title</h2>
  <button className={`${styles.card__button} ${styles.card__buttonPrimary}`}>
    Action
  </button>
</div>
```

주의사항

- SCSS는 BEM 규칙(언더스코어/대시)을 그대로 사용하고, JS/TS에서는 대시가 포함된 부분만 camelCase 접근을 지원합니다.
- 기존 브래킷 접근 코드가 있다면 일관성을 위해 점 표기(camelCase)로 점진 전환을 권장합니다.

### Typography

- 정의: `styles/_fonts.scss` (PC: `$typography-tokens`, MO: `$typography-tokens-mobile`)
- 믹스인: `typography`, `typographyMobile`, `typographyBoth`
- 권장 사용: `typographyBoth`로 PC/모바일 동시 적용, 모바일 예외는 두 번째 인자로 토큰 또는 맵 전달

예시:

```scss
.titleBoth {
  @include typographyBoth(t2B);
}
.titleBothStrong {
  @include typographyBoth(b4R, b3B);
}
.bodyCustomMo {
  @include typographyBoth(
    b4R,
    (
      size: 15px,
      lineHeight: 150%,
      weight: 500,
    )
  );
}
```

### 여백 스케일(Spacing Tokens)

- 전역 여백 토큰은 `styles/common.scss`에 정의되어 있습니다.
- 문서: `docs/styleGuide.md`의 “여백 스케일(Spacing Tokens)” 섹션과 `docs/layout.md`의 “전역 여백 토큰 사용 가이드”를 참고하세요.
- 사용 예: `gap: var(--space-6); // PC 20px, Mobile 12px`
