## Pagination 대화 요약 및 결정 기록 (2025-09-26)

### 개요

- 이 문서는 `MzPagination`(제어형)과 `MzPaginationManaged`(관리형) 도입 과정을 정리한 대화 요약입니다.
- 목표: PC는 숫자 페이지, Mobile은 더보기(누적) 정책을 통일하고, 부모 컴포넌트 코드를 간결화.

### 핵심 구현

- `app/common/components/ui/mzPagination.tsx`
  - 제어형 UI 컴포넌트
  - props: `currentPage`, `onChange`, `totalPages`, `mode`, `loadMoreLabel`
  - `mode="auto"`일 때 모바일은 더보기, PC는 숫자 버튼 표시

- `app/common/components/ui/mzPaginationManaged.tsx`
  - 관리형 컴포넌트(페이지 상태/슬라이싱 내장)
  - props: `items`, `itemsPerPage(10|12)`, `resetKey`, `onPageChange`, `render(...)`
  - 부모는 `items`와 `itemsPerPage`만 넘기고 `render`로 `currentItems`를 받아 렌더링

- 모바일 감지 훅: `hooks/useIsMobile.ts`
  - 의존성 없이 `window.matchMedia('(max-width: 1270px)')`로 모바일 여부 판별
  - SSR 초기 false → 클라이언트에서 동기화

### 적용처

- 리스트형 10개: `app/sk/components/common/listNotice.tsx`
- 이미지형 12개: `app/sk/components/common/imageNotice.tsx`
- FAQ 리스트형 10개(+카테고리 리셋): `app/common/components/corner/cornerFaq001.tsx`

### 사용 예시

리스트형(10개, PC=숫자 / Mobile=더보기)

```tsx
<MzPaginationManaged
  items={items}
  itemsPerPage={10}
  render={({ currentItems }) => (
    <table>
      <tbody>
        {currentItems.map((row) => (
          <tr key={row.id}>{/* ... */}</tr>
        ))}
      </tbody>
    </table>
  )}
/>
```

이미지형(12개, PC=숫자 / Mobile=더보기)

```tsx
<MzPaginationManaged
  items={items}
  itemsPerPage={12}
  render={({ currentItems }) => (
    <div className="grid">
      {currentItems.map((card, i) => (
        <div key={i}>{/* ... */}</div>
      ))}
    </div>
  )}
/>
```

카테고리 변경 시 1페이지 리셋(FAQ)

```tsx
<MzPaginationManaged
  items={filteredItems}
  itemsPerPage={10}
  resetKey={selectedCategory}
  onPageChange={() => setOpenIndexes([])}
  render={({ currentItems }) => (
    /* ... */
  )}
/>
```

### 접근성/반응형 정책

- 접근성: 페이지 버튼 `aria-current="page"`, 더보기 버튼 `aria-label` 제공
- 반응형: `useIsMobile(1270)`로 분기. 초기 SSR과 수화 시 UI 전환 가능 → 스켈레톤/높이 고정 등으로 깜빡임 최소화 권장

### 향후 과제(서버 페이징 전환)

- 현재 구조는 “클라이언트 페이지네이션(전량 데이터 수신)” 전제
- 서버 페이징 필요 시 권장안:
  - 제어형 `MzPagination` 사용: `onChange(page)`에서 서버 페치, `totalPages` 반영
  - 또는 `MzPaginationManaged`에 서버 모드 확장(내부 페치)도 가능
- 협의 포인트: URL 기반 페이지 상태(SSR/SEO), 더보기 누적 처리, `aria-live` 안내영역

### 참고 문서

- `docs/pagination.md`: API, 예시, 고도화 제안 상세
