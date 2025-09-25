# 테넌트 구조와 테마

도메인/호스트 기준으로 테넌트를 분기하고, 전역 테마 상태와 연동하는 방식을 설명합니다.

## 목표

- 멀티 테넌트 확장성
- 공통 레이아웃 유지 while 테넌트별 테마/콘텐츠 분리

## 미들웨어 동작

- `middleware.ts`에서 호스트 → 테넌트(sk/cap/adt) 매핑
- 제외 경로: `/_next`, `/api`, `/favicon` 등은 그대로 통과
- 나머지는 `/${tenant}`로 rewrite
- 로컬 강제: `?tenant=sk|cap|adt`

## 라우팅 구조

- `app/sk`, `app/cap`, `app/adt`에 각 테넌트의 레이아웃/페이지 구성
- 공통 레이아웃은 `app/layout.tsx`에서 처리

## 테마/상태 관리

- `stores/themeStore.ts`(Zustand) + `app/providers/ThemeProvider.tsx`
- `app/layout.tsx`에서 host를 기준으로 `body`에 `tenant-sk|cap|adt` 클래스 부여
- 전역 CSS 변수(`--brand` 등)로 테넌트별 테마 적용

## 환경 변수

- 호스트 매핑용 ENV: 예) `TENANT_SK_HOST`, `TENANT_CAPS_HOST`, `TENANT_ADT_HOST`
- Next 퍼블릭 환경 변수는 `process.env.NEXT_PUBLIC_*` 사용

## 주의사항

- 서버 컴포넌트에서 `ssr:false` 직접 사용 금지 → 클라이언트 컴포넌트로 위임 후 dynamic import
- public 자산은 import 대신 URL(`/images/...`) 또는 `next/image` 권장
