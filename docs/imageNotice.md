# ImageNotice Guide

## 개요

- 범용 이미지 리스트 컴포넌트(게시판형).
- 마크업 정책: 아이템 루트는 `div.imageNotice__item` 고정, 썸네일만 `Link`로 감싸 레이어 겹침 방지.
- 데이터 접근은 매퍼(getId/getTitle/getDateText/getImageSrc)로 유연하게 처리.

## 슬롯 API

- `renderHeader?(item)`: 카드 상단 사용자 정의 영역.
- `renderMetaArea?(item)`: 제목 아래 메타 정보 영역.
- `renderActions?(item)`: 액션(버튼 등) 영역.
- `renderFooter?(item)`: 카드 하단 푸터 영역.

슬롯을 제공하지 않으면 해당 영역은 렌더링하지 않습니다(기본 UI 없음).

## 링크/썸네일

```tsx
const href = basePath ? `${basePath}/${id}` : (buildHref?.(item) ?? null);
// href가 있으면 썸네일만 Link로 감싸고, 없으면 div로 렌더링
```

## 사용 예시

### 이벤트(날짜 메타)

```tsx
<ImageNotice
  items={eventData}
  basePath="/sk/support/event"
  renderMetaArea={(item) => (
    <span className={S.imageNotice__date}>{item.date}</span>
  )}
/>
```

### 브로슈어(다운로드 액션)

```tsx
<ImageNotice
  items={brochureData}
  renderActions={(item) =>
    item.downloadPath ? (
      <div className={S.imageNotice__actions}>
        <a
          className={S.imageNotice__download}
          href={item.downloadPath}
          download
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => e.stopPropagation()}
        >
          다운로드
        </a>
      </div>
    ) : null
  }
/>
```

### 헤더/푸터 확장

```tsx
<ImageNotice
  items={eventData}
  renderHeader={() => <div className="badge">NEW</div>}
  renderFooter={(item) => <button onClick={() => share(item)}>공유</button>}
/>
```

## 스타일 참고(BEM)

- `.imageNotice` / `.imageNotice__list` / `.imageNotice__item` / `.imageNotice__thumb` / `.imageNotice__body`
- 메타/액션: `.imageNotice__date` / `.imageNotice__actions` / `.imageNotice__download`
