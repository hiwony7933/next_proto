# MzInputText Guide

## 개요

- 래퍼(`.mzInputText`)에 style/className 적용, 내부 입력은 `.mzInputText__input`.
- 옵션: `numberFormat`(숫자만 입력 + 천단위 콤마), `onSearch`(검색 버튼/엔터 트리거)
- 에러/벨리데이션: `errorText`(메시지), `showError`(표시 시점 제어)

## 검색(Search) 전용 사용

```tsx
<MzInputText
  placeholder="검색어"
  value={searchKeyword}
  onChange={(e) => setSearchKeyword(e.target.value)}
  onSearch={(q) => console.log("search:", q)}
/>
```

- `onSearch` 제공 시 검색 버튼과 엔터 키로 검색이 트리거됩니다.
- `numberFormat` 사용 시에도 검색 콜백으로는 콤마 제거된 값이 전달됩니다.

## 에러/벨리데이션 전용(검색과 분리)

```tsx
<MzInputText
  placeholder="필수 입력"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  errorText={errors.keyword}
  showError={submitted}
/>
```

- 제출 후에만 `showError`를 true로 전환하여 에러를 노출합니다.
- 접근성: aria-invalid/aria-describedby/aria-errormessage 자동 설정, 메시지는 `aria-live="polite"`로 읽힘.
- 에러 표시 중에는 검색(onSearch) 버튼/엔터 동작을 막습니다.

## 숫자 포맷(numberFormat)

```tsx
<MzInputText numberFormat placeholder="숫자만 입력" />
```

- 입력은 숫자만 허용, 표시에는 천단위 콤마 적용.
- onChange에는 콤마 제거된 원시값을 전달합니다.

## 스타일 참고(BEM)

- `.mzInputText` / `.mzInputText__input` / `.mzInputText__clear` / `.mzInputText__search` / `.mzInputText__error`
