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
