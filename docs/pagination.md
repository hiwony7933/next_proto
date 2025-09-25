## Pagination 가이드 (MzPagination / MzPaginationManaged)

본 프로젝트의 페이지네이션은 두 컴포넌트로 구성됩니다.

- MzPagination: UI 전용(제어형). 현재 페이지/총 페이지를 부모가 관리합니다.
- MzPaginationManaged: 상태/슬라이싱까지 내부에서 관리(관리형). 부모는 items와 itemsPerPage, 렌더만 넘깁니다.

모바일/PC 정책

- PC: 숫자 페이지 버튼(`pages`)
- Mobile(NEXT_PUBLIC_DEVICE_TYPE === "1"): 더보기(`loadMore`) 누적 노출
- 기본값 `mode="auto"`는 디바이스에 따라 자동 분기합니다.

---

### 1) 제어형 MzPagination

props

- `currentPage: number`: 현재 페이지
- `onChange(nextPage: number)`: 페이지 변경 콜백
- `totalPages?: number`: 총 페이지 수 (기본 10)
- `mode?: "auto"|"pages"|"loadMore"`: 기본 auto
- `loadMoreLabel?: string`: 더보기 라벨 (기본 "더보기")

예시

```tsx
<MzPagination
  currentPage={currentPage}
  onChange={setCurrentPage}
  totalPages={totalPages}
  mode="auto"
/>
```

---

### 2) 관리형 MzPaginationManaged

상태/슬라이싱을 내부에서 관리하고, render-props로 `currentItems`를 부모에 전달합니다.

props

- `items: T[]`: 원본 데이터
- `itemsPerPage?: number`: 페이지당 아이템 수(리스트 10, 이미지 12)
- `mode?: "auto"|"pages"|"loadMore"`: 기본 auto
- `resetKey?: unknown`: 변경 시 1페이지로 리셋할 키(예: 선택된 카테고리)
- `onPageChange?(page: number)`: 페이지 변경 알림이 필요할 때 사용
- `render(args)`: 현재 페이지 데이터/메타를 받아 렌더
  - `currentItems: T[]`
  - `currentPage: number`
  - `totalPages: number`
  - `pageStartIndex: number` (전역 인덱스 계산용)
  - `isMobile: boolean` (loadMore 모드 여부)

예시: 리스트형(10개/PC=숫자, Mobile=더보기)

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

예시: 이미지형(12개/PC=숫자, Mobile=더보기)

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

카테고리 필터 등 페이지 초기화가 필요한 경우

```tsx
<MzPaginationManaged
  items={filteredItems}
  itemsPerPage={10}
  resetKey={selectedCategory}
  onPageChange={() => setOpenIndexes([])}
  render={({ currentItems }) => /* ... */}
/>
```

---

### 접근성(A11y)

- 페이지 버튼에는 `aria-current="page"`를 적용
- 더보기 버튼에는 적절한 라벨(`aria-label`) 제공
- 목록/영역은 시맨틱 태그(table/ol/ul, region 등) 유지

---

### 반응형/고도화 제안

- 페이지 버튼 그룹핑: 숫자 버튼을 1–5, 6–10 등 그룹으로 노출하는 옵션 추가 가능(`visibleRange`)
- 무한 스크롤 전환: 모바일에서 `IntersectionObserver`로 더보기 자동 트리거(옵션)
- 서버 페이징 대응: `onPageChange`에서 외부 페치 후 `items` 업데이트 → 관리형은 자동으로 재계산
- 접근성 향상: 페이지 변경 시 `aria-live` 영역을 추가하여 “N페이지로 이동” 등 안내
- 스타일 토큰: `--pagination-color`, `--pagination-active-color` 등 CSS 변수로 테넌트별 스킨 일원화

---

### 유지보수 가이드

- 부모는 데이터 준비와 렌더만 담당. 페이징 상태/분기(PC/모바일)는 관리형이 책임
- 리스트(10)/이미지(12) 이외 타입 추가 시에도 `itemsPerPage`만 변경
- 리셋 트리거가 필요할 때는 `resetKey`로 처리(검색/필터 변경 등)
