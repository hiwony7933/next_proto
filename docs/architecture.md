# 아키텍처 개요

프로젝트의 SSR 구조, 테넌트 라우팅, 스타일/린트 체계를 고수준에서 설명합니다.

## 목표

- SSR 안정성 확보
- 테넌트 확장성 및 공통 코드 재사용성 향상
- 스타일/린트 일관성 유지

## 상위 구조

- `app/` App Router, 서버/클라이언트 컴포넌트 분리
- `middleware.ts` 테넌트 라우팅 전처리
- `stores/` 전역 상태(Zustand)
- 전역 SCSS(`styles/`), 컴포넌트 전용은 `.module.scss`

## SSR 원칙

- 브라우저 전용 라이브러리: 클라이언트 컴포넌트(상단 `use client`)에서만 사용
- `window/document` 접근은 `useEffect` 내부 처리
- 동적 import + `ssr:false`는 서버 컴포넌트에서 직접 사용 금지 → 클라이언트 래퍼 위임

## 라우팅

- 테넌트 세그먼트: `app/sk`, `app/cap`, `app/adt`
- 가이드: `app/guide`(slug 라우트 포함)

## 스타일/린트

- CSS Modules + BEM + camelCase 접근(상세: `docs/styleGuide.md`)
- ESLint: next/core-web-vitals + typescript + prettier
- Prettier: 저장소 설정 준수

### 브레이크포인트(반응형)

- Mobile: ≤ 719px
- Tablet: 720–1023px(작은 PC)
- PC: ≥ 1024px

- 구현 위치
  - SCSS 믹스인: `styles/_mixin.scss` (`@include mobile`, `@include tablet`)
  - JS/TS 분기(권장): `hooks/useBreakpoint` 또는 `hooks/useMediaQuery` + `lib/breakpoints`
  - 참고: `hooks/useIsMobile`는 `mediaQueries.mobile` 래퍼(Deprecated)

## 빌드/환경

- `next.config.ts` Sass includePaths 및 전역 SCSS additionalData
- `outputFileTracingRoot = process.cwd()`
- 패키지 매니저 고정: yarn@1.x

## 의존성(요약)

- 런타임: react-day-picker, @tanstack/_, embla-carousel-react, @tiptap/_, zustand
- 개발: prettier, eslint-config-prettier, sass, @types/react-modal, @types/react-syntax-highlighter

## 참고

- 스타일 가이드: `docs/styleGuide.md`
- 테넌트: `docs/tenancy.md`
- UI 패턴: `docs/uiPatterns.md`
