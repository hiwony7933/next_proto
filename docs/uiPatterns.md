# UI 패턴 가이드

브라우저 전용 의존성과 상호작용이 필요한 컴포넌트 패턴을 정리합니다.

## 공통 원칙

- 상호작용/DOM 접근은 클라이언트 컴포넌트(`use client`)에서 처리
- 서드파티 브라우저 전용 라이브러리는 dynamic import + 로드 가드 사용
- CSS Modules + BEM + camelCase 접근(상세: `docs/styleGuide.md`)

## 모달/알림

- 모달(`MzModal`)과 컨테이너는 클라이언트 전용
- ReactModal의 `appElement`는 필요 시 설정
- 알림(`sweetalert2` 기반 `MzAlert`)은 동적 import로 SSR 충돌 방지

## 트리/그리드

- tui-tree, tui-grid는 클라이언트에서만 로드
- 라이브러리 로드 완료 후 인스턴스 생성(예: `gridLibReady` 플래그)
- 문서 이벤트 바인딩/해제는 `useEffect`에서 일괄 처리

## 탭/툴팁/FAQ

- 상태/이벤트는 클라이언트에서 관리
- 접근성 고려: 키보드 포커스, ARIA 속성 부여 권장

## 스타일

- 컴포넌트 전용 스타일은 `.module.scss` 사용
- BEM 표기 유지, JS/TS 접근은 camelCase 허용

### 반응형 참고

- 브레이크포인트
  - Mobile: ≤ 719px
  - Tablet: 720–1023px(작은 PC)
  - PC: ≥ 1024px

- 구현 팁
  - 태블릿은 PC 구조를 유지하고 간격/그리드만 축소 조정
  - 모바일은 수직 스택/터치 타겟 최적화, 필요 시 `useBreakpoint()`로 분기

## 링크

- 샘플 화면: `app/guide/*`
