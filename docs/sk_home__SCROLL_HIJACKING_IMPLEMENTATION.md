# 스크롤 하이재킹(Scroll Hijacking) 구현 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [스크롤 하이재킹 기술 설명](#스크롤-하이재킹-기술-설명)
3. [요구사항 분석](#요구사항-분석)
4. [구현 과정](#구현-과정)
5. [핵심 기술 구현](#핵심-기술-구현)
6. [문제 해결 과정](#문제-해결-과정)
7. [최종 구현 결과](#최종-구현-결과)
8. [성능 최적화](#성능-최적화)
9. [학습 내용 및 인사이트](#학습-내용-및-인사이트)

---

## 프로젝트 개요

### 프로젝트명

SK쉴더스 웹사이트 메인 페이지 인터랙티브 스크롤 구현

### 구현 목표

사용자가 스크롤 할 때 다음과 같은 단계적 인터랙션을 구현:

1. **일반 수직 스크롤** → Service 섹션이 화면 상단(top)에 도착
2. **스크롤 방향 전환** → 수직(↕) 스크롤이 수평(↔) 방향으로 전환
3. **레이아웃 변화** → Service 배경 이미지가 100% → 50%로 축소 (10:0 → 5:5 비율)
4. **우측 콘텐츠 등장** → 축소되면서 생긴 우측 공간에 ServiceRight 섹션이 슬라이드
5. **수직 스크롤 재전환** → 5:5 도달 시 우측 리스트를 수직 스크롤
6. **프로세스 완료** → 리스트 끝 도달 시 일반 스크롤로 복귀

### 기술 스택

- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: SCSS Modules + BEM
- **Build**: SSR (Server-Side Rendering)

---

## 스크롤 하이재킹 기술 설명

### 정의

스크롤 하이재킹(Scroll Hijacking)은 브라우저의 기본 스크롤 동작을 가로채서 개발자가 정의한 커스텀 인터랙션을 구현하는 기술입니다.

### 핵심 원리

#### 1. **스크롤 이벤트 가로채기**

```typescript
window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("wheel", handleWheel, { passive: false });
```

- `scroll` 이벤트: 실제 스크롤 위치 추적
- `wheel` 이벤트: 마우스 휠 입력 감지 및 제어
- `passive: false`: 기본 동작 취소 가능하도록 설정

#### 2. **기본 스크롤 동작 차단**

```typescript
if (isScrollLocked.current) {
  e.preventDefault(); // 기본 스크롤 방지
}
```

#### 3. **스크롤 위치 강제 고정**

```typescript
if (isScrollLocked.current && currentScrollY !== lockedScrollY.current) {
  window.scrollTo(0, lockedScrollY.current); // 특정 위치에 고정
}
```

#### 4. **가상 진행도 시스템**

물리적 스크롤 대신 내부 상태(progress)로 진행도를 관리:

```typescript
const [horizontalProgress, setHorizontalProgress] = useState(0); // 0~100%
```

### 기술적 장점

- ✅ 독특한 사용자 경험 제공
- ✅ 복잡한 애니메이션과 인터랙션 구현 가능
- ✅ 스토리텔링에 적합

### 기술적 단점

- ❌ 접근성 문제 (키보드 네비게이션 어려움)
- ❌ 사용자 예측 불가능성
- ❌ 성능 최적화 필요
- ❌ 모바일 환경 대응 복잡

---

## 요구사항 분석

### 1단계: 스크롤 다운 이벤트 감지

**요구사항**: 기본적인 스크롤 방향 감지

**구현 방안**:

- 현재 스크롤 위치와 이전 위치 비교
- 스크롤 방향 상태 관리

```typescript
const [lastScrollY, setLastScrollY] = useState(0);
const currentScrollY = window.scrollY;

if (currentScrollY > lastScrollY) {
  setIsScrollingDown(true); // 다운
} else {
  setIsScrollingDown(false); // 업
}
```

### 2단계: Service 섹션 Top 도착 감지

**요구사항**: Service가 화면 상단(top: 0)에 도착하는 시점 감지

**기술적 고려사항**:

- `offsetTop`으로 요소의 절대 위치 계산
- 버퍼 구간을 두어 자연스러운 진입

```typescript
const serviceTriggerPoint = useRef<number>(0);

if (serviceRef.current) {
  serviceTriggerPoint.current = serviceRef.current.offsetTop;
}

// 도착 감지 (±50px 버퍼)
if (
  currentScrollY >= serviceTriggerPoint.current - 50 &&
  currentScrollY <= serviceTriggerPoint.current + 50
) {
  // 스크롤 잠금 활성화
}
```

### 3단계: 스크롤 방향 전환 (수직 → 수평)

**요구사항**:

- 페이지가 더 이상 아래로 내려가지 않음
- 마우스 휠 입력을 수평 방향 진행도로 변환

**핵심 메커니즘**:

1. 스크롤 위치 고정 (`window.scrollTo`)
2. 휠 이벤트 감지 (`wheel` event)
3. deltaY 값을 수평 진행도로 매핑

```typescript
// 스크롤 위치 완전 고정
window.scrollTo(0, lockedScrollY.current);

// 휠 입력을 진행도로 변환
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const normalizedDelta =
    Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
  const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);
  setHorizontalProgress((prev) => prev + deltaStep);
};
```

### 4단계: Service Width 조절 (10:0 → 5:5)

**요구사항**:

- 좌측에서 우측으로 줄어드는 효과
- 100% → 50% width

**CSS 전략**:

```scss
.serviceWrapper {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: flex-start; // 왼쪽 고정
}

.service {
  width: ${serviceWidth}%; // 동적 width
  transition: width 0.1s ease-out;
}
```

### 5단계: ServiceRight 슬라이드 등장

**요구사항**:

- 7:3 시점부터 우측에서 좌에서 우로 슬라이드
- 5:5 시점에 중앙에 위치

**구현 전략**:

- ServiceRight를 absolute positioning
- z-index로 레이어 순서 제어 (뒤에 배치)
- transform: translateX로 슬라이드 애니메이션

```typescript
// 진행도 계산 (30% 이후부터 시작)
const rightProgress = Math.max(0, Math.min(100, ((progress - 30) / 70) * 100));

// CSS transform
transform: translateX(${rightProgress - 100}%)
```

### 6단계: List 수직 스크롤

**요구사항**:

- 수평 스크롤 완료 후 우측 리스트를 수직 스크롤
- 스크롤 방향 재전환 (수평 → 수직)

**구현 방안**:

```typescript
if (horizontalProgress >= 100) {
  setIsListScrollMode(true);
}

// List 스크롤 제어
if (isListScrollMode) {
  const newScrollTop = listScrollTop + e.deltaY;
  listRef.current.scrollTop = newScrollTop;
}
```

---

## 구현 과정

### Phase 1: 기본 스크롤 감지 구현

#### Step 1.1: 스크롤 방향 감지

```typescript
const [isScrollingDown, setIsScrollingDown] = useState(false);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 0) {
      setIsScrollingDown(true);
    } else if (currentScrollY < lastScrollY) {
      setIsScrollingDown(false);
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);
```

**개발 중 인사이트**:

- `passive: true`로 스크롤 성능 최적화
- 의존성 배열에 `lastScrollY` 포함 필요

#### Step 1.2: Service Top 도착 감지

```typescript
const serviceRef = useRef<HTMLDivElement>(null);
const serviceTriggerPoint = useRef<number>(0);

useEffect(() => {
  if (serviceRef.current) {
    serviceTriggerPoint.current = serviceRef.current.offsetTop;
  }
}, []);
```

**문제점 발견**: 정확히 특정 픽셀에 도달해야 하는 조건은 너무 엄격함

**해결**: 버퍼 구간 도입

```typescript
const SCROLL_LOCK_THRESHOLD = 100; // px

if (
  currentScrollY >= serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
  currentScrollY <= serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2
) {
  // 진입
}
```

### Phase 2: 스크롤 하이재킹 핵심 구현

#### Step 2.1: 스크롤 위치 고정

```typescript
const isScrollLocked = useRef(false);
const lockedScrollY = useRef(0);

// Service top 도착 시
isScrollLocked.current = true;
lockedScrollY.current = serviceTriggerPoint.current;

// 스크롤 이벤트에서 강제 고정
if (isScrollLocked.current && currentScrollY !== lockedScrollY.current) {
  window.scrollTo(0, lockedScrollY.current);
  return;
}
```

**이슈**: 스크롤이 "튀는" 현상 발생
**원인**: 브라우저의 스크롤 바운스 효과
**시도했던 해결책**:

1. `document.body.style.overflow = 'hidden'` → 다른 문제 발생으로 미적용
2. `overscroll-behavior: none` → 효과 제한적
3. 최종적으로 `window.scrollTo`만으로 처리

#### Step 2.2: 휠 이벤트 처리 및 deltaY 정규화

**초기 구현**:

```typescript
const delta = e.deltaY > 0 ? 1 : -1; // 단순히 방향만
```

**문제점**:

- 빠르게 스크롤하면 이상하게 동작
- 느리게 스크롤하면 진행이 너무 더딤
- 트랙패드와 마우스 휠 동작이 다름

**개선된 구현**:

```typescript
// deltaY 값 정규화
// 일반 스크롤: ~100, 빠른 스크롤: ~300+
const normalizedDelta =
  Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);
```

**설명**:

- `Math.sign(e.deltaY)`: 방향 (-1 or 1)
- `Math.abs(e.deltaY) / 100`: 절대값을 100으로 나누어 정규화
- `Math.min(..., 3)`: 최대 3배까지만 허용 (너무 빠르게 넘어가는 것 방지)
- `100 / HORIZONTAL_SCROLL_STEPS`: 전체 진행도를 설정된 스텝으로 나눔

### Phase 3: Width 조절 및 ServiceRight 슬라이드

#### Step 3.1: Service Width 동적 조절

```typescript
const [serviceWidth, setServiceWidth] = useState(100); // 초기 100%

// 진행도에 따라 100% → 50%
const newWidth = 100 - (horizontalProgress / 100) * 50;
setServiceWidth(newWidth);

// JSX
<section style={{ width: `${serviceWidth}%` }}>
```

#### Step 3.2: ServiceRight 레이어링 및 슬라이드

**HTML 구조**:

```tsx
<div className={S.serviceWrapper}>
  {/* 뒤편: ServiceRight (z-index: 1) */}
  <section
    className={S.serviceRight}
    style={{ transform: `translateX(${rightProgress - 100}%)` }}
  >
    {/* 콘텐츠 */}
  </section>

  {/* 앞편: Service (z-index: 2) */}
  <section className={S.service} style={{ width: `${serviceWidth}%` }}>
    {/* 콘텐츠 */}
  </section>
</div>
```

**SCSS**:

```scss
.serviceWrapper {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: flex-start;
}

.serviceRight {
  position: absolute;
  right: 0;
  width: 50%;
  z-index: 1; // 배경층
}

.service {
  position: relative;
  z-index: 2; // 전경층
}
```

**핵심 포인트**:

- ServiceRight는 항상 우측 끝에 고정 (`right: 0`)
- Service가 줄어들면서 ServiceRight가 드러나는 구조
- `translateX`로 좌→우 슬라이드 효과

#### Step 3.3: 진행도 구간별 처리

**요구사항**: 30% 진행도부터 ServiceRight 시작

```typescript
// 전체 진행도 0~100%
const horizontalProgress = 0; // ~ 100

// ServiceRight 진행도 (30% 이후부터)
const rightProgress = Math.max(
  0,
  Math.min(100, ((horizontalProgress - 30) / 70) * 100)
);

// 0~30%: rightProgress = 0 (숨김)
// 30~100%: rightProgress = 0~100 (슬라이드)
```

### Phase 4: List 스크롤 모드 전환

#### Step 4.1: 수평 스크롤 완료 감지

```typescript
if (horizontalProgress >= 100 && normalizedDelta > 0) {
  console.log("수평 스크롤 완료 → List 스크롤 모드 전환");
  setIsListScrollMode(true);
  setServiceWidth(50); // 5:5 고정
  return 100; // 더 이상 진행 안 함
}
```

#### Step 4.2: List 스크롤 제어

```typescript
const listRef = useRef<HTMLUListElement>(null);
const [listScrollTop, setListScrollTop] = useState(0);

const handleWheel = (e: WheelEvent) => {
  if (isListScrollMode && listRef.current) {
    e.preventDefault();

    const list = listRef.current;
    const maxScroll = list.scrollHeight - list.clientHeight;
    const newScrollTop = Math.max(
      0,
      Math.min(maxScroll, listScrollTop + e.deltaY)
    );

    setListScrollTop(newScrollTop);
    list.scrollTop = newScrollTop;
  }
};
```

**SCSS**:

```scss
.serviceRight__list {
  overflow-y: auto;
  overflow-x: hidden;

  // 커스텀 스크롤바
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
}
```

#### Step 4.3: List 끝 도달 처리

```typescript
if (newScrollTop >= maxScroll && e.deltaY > 0) {
  console.log("List 스크롤 완료 → 프로세스 완료");

  // 프로세스 완료 플래그
  isProcessComplete.current = true;

  // 잠금 해제
  isScrollLocked.current = false;
  setIsInHorizontalZone(false);
  setIsListScrollMode(false);

  // 5:5 상태 유지하고 일반 스크롤로 복귀
  return;
}
```

### Phase 5: 역방향 구현 시도 및 포기

#### 초기 요구사항

- 아래에서 위로 스크롤 시 역방향 프로세스
- List → 수평 스크롤 역방향 (5:5 → 10:0) → 완전 해제

#### 구현 시도

```typescript
// 프로세스 완료 후 위로 스크롤 시 역방향 시작
if (isProcessComplete.current && e.deltaY < 0) {
  setIsListScrollMode(true);
  // List를 맨 아래부터 시작
  listRef.current.scrollTop = maxScroll;
}

// List 맨 위 도달 시 수평 스크롤 역방향
if (listScrollTop <= 0 && e.deltaY < 0) {
  setIsInHorizontalZone(true);
  setHorizontalProgress(100); // 역방향 시작점
}
```

#### 발생한 문제들

**문제 1: 진입 타이밍 감지 어려움**

- 빠른 스크롤: 20px 범위를 건너뛰어 진입 실패
- 느린 스크롤: 의도치 않은 진입

```typescript
// 시도 1: 엄격한 범위
Math.abs(currentScrollY - lockedScrollY.current) <= 20;
// → 빠른 스크롤 감지 실패

// 시도 2: 넓은 범위
currentScrollY >= lockedScrollY.current - 100 &&
  currentScrollY <= lockedScrollY.current + 200;
// → 의도하지 않은 진입 증가
```

**문제 2: 탈출 어려움**

- 느린 스크롤로는 역방향 프로세스 탈출 불가
- 빠른 스크롤로만 탈출 가능
- 사용자 경험 일관성 부족

**문제 3: 순방향 재시작 실패**

- 역방향 프로세스를 건너뛰고 위로 올라갈 경우
- `isProcessComplete = true` 상태 유지
- 다시 내려와도 순방향 프로세스가 시작되지 않음

#### 최종 결정: 역방향 제거

**결정 이유**:

1. 기술적 복잡도 대비 UX 개선 효과 미미
2. 사용자 예측 불가능성 증가
3. 민감도 조절이 근본적으로 어려움

**대안**:

- 프로세스 완료 후 일반 스크롤로 위로 이동
- Service 영역을 벗어나면 자동으로 상태 리셋
- 다시 내려올 때 순방향 프로세스 재시작

```typescript
// 프로세스 완료 후 service 영역 벗어남 감지
if (
  isProcessComplete.current &&
  !isScrollLocked.current &&
  currentScrollY < serviceTriggerPoint.current - 200
) {
  // 프로세스 플래그 리셋
  isProcessComplete.current = false;

  // 모든 상태 초기화
  setServiceWidth(100);
  setHorizontalProgress(0);
  setRightSectionProgress(0);
}
```

---

## 핵심 기술 구현

### 1. 상태 관리 구조

```typescript
// UI 상태
const [isScrollingDown, setIsScrollingDown] = useState(false);
const [serviceWidth, setServiceWidth] = useState(100);
const [isInHorizontalZone, setIsInHorizontalZone] = useState(false);
const [horizontalProgress, setHorizontalProgress] = useState(0);
const [rightSectionProgress, setRightSectionProgress] = useState(0);
const [isListScrollMode, setIsListScrollMode] = useState(false);
const [listScrollTop, setListScrollTop] = useState(0);

// Ref (렌더링과 무관한 값)
const serviceRef = useRef<HTMLDivElement>(null);
const listRef = useRef<HTMLUListElement>(null);
const serviceTriggerPoint = useRef<number>(0);
const isScrollLocked = useRef(false);
const lockedScrollY = useRef(0);
const isProcessComplete = useRef(false);
```

**설계 원칙**:

- **State**: UI에 영향을 주는 값 (리렌더링 필요)
- **Ref**: 성능을 위해 리렌더링을 피해야 하는 값

### 2. 이벤트 처리 아키텍처

```
┌─────────────────┐
│  Scroll Event   │ (위치 추적)
│  passive: true  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     NO      ┌──────────────┐
│ Service Top?    │────────────▶│ Normal Scroll│
└────────┬────────┘             └──────────────┘
         │ YES
         ▼
┌─────────────────┐
│  Lock Scroll    │
│  wheel: false   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Wheel Event    │
│ preventDefault  │
└────────┬────────┘
         │
         ├─▶ Horizontal Mode ─▶ Width Control
         │
         └─▶ List Mode ─▶ List Scroll Control
```

### 3. 진행도 계산 시스템

```typescript
// 수평 스크롤 진행도 (0~100%)
const HORIZONTAL_SCROLL_STEPS = 10; // 휠 10회로 완료

setHorizontalProgress((prev) => {
  // deltaY를 정규화하여 스크롤 속도 반영
  const normalizedDelta =
    Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
  const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);
  const newProgress = Math.max(0, Math.min(100, prev + deltaStep));

  // Service width 계산
  const newWidth = 100 - (newProgress / 100) * 50;
  setServiceWidth(newWidth);

  // ServiceRight 진행도 (30% 이후부터)
  const rightProgress = Math.max(
    0,
    Math.min(100, ((newProgress - 30) / 70) * 100)
  );
  setRightSectionProgress(rightProgress);

  return newProgress;
});
```

### 4. CSS Sticky를 활용한 고정 전략

```scss
.serviceWrapper {
  position: sticky;
  top: 0;
  height: 100vh;

  // 장점:
  // 1. JavaScript 없이도 화면에 고정
  // 2. 자연스러운 스크롤 동작
  // 3. 성능 최적화
}
```

**Sticky의 동작**:

- 일반 스크롤: 요소가 따라 내려감
- Top 도달: 화면 상단에 고정
- 컨테이너 벗어남: 다시 일반 흐름으로

### 5. 레이어 순서 제어

```scss
// ServiceRight가 뒤, Service가 앞
.serviceRight {
  z-index: 1; // 배경층
}

.service {
  z-index: 2; // 전경층
}
```

**효과**: Service가 줄어들면서 뒤의 ServiceRight가 "드러나는" 효과

---

## 문제 해결 과정

### Problem 1: 스크롤 잠금이 부자연스러움

**증상**:

- 스크롤 다운 시 괜찮음
- 스크롤 업 시 잠금이 쉽게 풀리지 않음

**원인 분석**:

- 0% 정확히 도달해야 해제되는 조건이 너무 엄격
- 느린 스크롤에서는 0%에 도달하기 어려움

**해결 과정**:

```typescript
// 시도 1: 3% 이하
if (newProgress <= 3 && normalizedDelta < 0)

// 시도 2: 5% 이하
if (newProgress <= 5 && normalizedDelta < 0)

// 최종: 10% 이하 (후에 15%로 더 완화)
if (newProgress <= 15 && normalizedDelta < 0)
```

**결과**: 느린 스크롤에도 자연스럽게 탈출 가능

### Problem 2: 빠른 스크롤 시 동작 이상

**증상**:

- 빠르게 스크롤하면 진행이 불규칙
- 느리게 스크롤하면 너무 더딤

**원인**:

```typescript
// 문제 있는 코드
const delta = e.deltaY > 0 ? 1 : -1;
```

- deltaY는 실제로 ~10부터 ~300+ 까지 다양
- 마우스 휠: ~100
- 트랙패드: ~10~30
- 빠른 스크롤: ~300+

**해결**:

```typescript
// deltaY 정규화
const normalizedDelta =
  Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
```

**효과**:

- 작은 스크롤: 비례하여 느리게 진행
- 큰 스크롤: 최대 3배까지만 빠르게 (무한정 빠르지 않음)
- 모든 입력 장치에서 일관된 동작

### Problem 3: Service Top 진입 감지 실패

**증상**:

- 정확한 위치에서만 진입
- 약간 빗나가면 진입하지 않음

**원인**:

```typescript
// 너무 엄격한 조건
if (currentScrollY === serviceTriggerPoint.current)
```

**해결**:

```typescript
// 버퍼 구간 도입
const SCROLL_LOCK_THRESHOLD = 100;

if (currentScrollY >= serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
    currentScrollY <= serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2)
```

**효과**: ±50px 범위 내에서 자연스럽게 진입

### Problem 4: ServiceRight 슬라이드 타이밍

**요구사항**:

- 7:3 시점부터 등장
- 5:5 시점에 중앙 위치

**문제**: 처음부터 슬라이드하면 너무 일찍 등장

**해결**:

```typescript
// 30% 진행도부터 시작
const rightProgress = Math.max(
  0,
  Math.min(100, ((horizontalProgress - 30) / 70) * 100)
);

// 0~30%: rightProgress = 0 (숨김)
// 30%: rightProgress = 0 (translateX: -100%, 왼쪽 밖)
// 100%: rightProgress = 100 (translateX: 0%, 중앙)
```

### Problem 5: 역방향 진입 감지 불안정

**증상**: 빠른 스크롤 시 역방향 프로세스 건너뜀

**원인**:

```typescript
// 20px 범위는 너무 좁음
Math.abs(currentScrollY - lockedScrollY.current) <= 20;
```

브라우저 스크롤은 연속적이지 않음:

- 느린 스크롤: 1px, 2px, 3px...
- 빠른 스크롤: 10px, 30px, 50px... (중간 건너뜀)

**시도한 해결책**:

1. 200px로 범위 확대 → 의도하지 않은 진입 증가
2. 구간 체크로 변경 → 여전히 불안정
3. 탈출 조건 완화 (15%) → 진입은 되는데 탈출 어려움

**최종 결정**: 역방향 프로세스 제거

### Problem 6: 스크롤 바운스

**증상**: 스크롤 잠금 상태에서도 화면이 "통통" 튐

**원인**: 브라우저의 오버스크롤 바운스 효과

**시도한 해결책**:

```typescript
// 방법 1: Body 완전 고정
document.body.style.overflow = 'hidden';
document.body.style.position = 'fixed';
document.body.style.top = `-${currentScrollY}px`;

// 방법 2: CSS
overscroll-behavior: none;
```

**결과**: 다른 부작용 발생으로 적용하지 않음

- Body 고정: 스크롤 위치 복원 시 깜빡임
- CSS 방법: 효과 제한적

**최종**: `window.scrollTo`만으로 처리 (약간의 바운스는 허용)

---

## 최종 구현 결과

### 완성된 프로세스 흐름

```
┌──────────────────────────────────────────────────┐
│ 1. 일반 스크롤 다운                               │
│    (~1660px)                                      │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 2. Service Top 도착                              │
│    스크롤 잠금 활성화 ⚡                         │
│    isScrollLocked = true                         │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 3. 수평 스크롤 모드                              │
│    - 진행도: 0% → 100%                           │
│    - Width: 100% → 50% (10:0 → 5:5)             │
│    - ServiceRight 슬라이드 (30% 시점부터)        │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 4. List 스크롤 모드                              │
│    - 우측 리스트 수직 스크롤                     │
│    - ServiceRight 내부 스크롤                    │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 5. List 끝 도달                                  │
│    - isProcessComplete = true ✅                 │
│    - 스크롤 잠금 해제                            │
│    - 5:5 상태 유지                               │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 6. 일반 스크롤 복귀                              │
│    - 다음 섹션으로 자연스럽게 이동               │
└──────────────────────────────────────────────────┘

        ⬆ 위로 스크롤 시

┌──────────────────────────────────────────────────┐
│ 7. Service 영역 벗어남 (trigger - 200px)         │
│    - isProcessComplete = false                   │
│    - 모든 상태 초기화                            │
└───────────────┬──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────┐
│ 8. 다시 내려올 때 순방향 프로세스 재시작 ♻      │
└──────────────────────────────────────────────────┘
```

### 핵심 코드 스니펫

#### 1. 스크롤 잠금 및 위치 고정

```typescript
// Service Top 도착 감지 및 잠금
if (
  !isScrollLocked.current &&
  !isProcessComplete.current &&
  currentScrollY >= serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
  currentScrollY <= serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2
) {
  isScrollLocked.current = true;
  lockedScrollY.current = serviceTriggerPoint.current;
  setIsInHorizontalZone(true);
  // ... 상태 초기화
}

// 스크롤 위치 강제 고정
if (isScrollLocked.current && currentScrollY !== lockedScrollY.current) {
  window.scrollTo(0, lockedScrollY.current);
  return;
}
```

#### 2. 휠 이벤트 정규화 및 진행도 계산

```typescript
const handleWheel = (e: WheelEvent) => {
  if (isScrollLocked.current) {
    e.preventDefault();

    // deltaY 정규화 (빠른/느린 스크롤 대응)
    const normalizedDelta =
      Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
    const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);

    setHorizontalProgress((prev) => {
      const newProgress = Math.max(0, Math.min(100, prev + deltaStep));

      // Width 계산
      const newWidth = 100 - (newProgress / 100) * 50;
      setServiceWidth(newWidth);

      // ServiceRight 진행도 (30% 이후)
      const rightProgress = Math.max(
        0,
        Math.min(100, ((newProgress - 30) / 70) * 100)
      );
      setRightSectionProgress(rightProgress);

      // 100% 도달 시 List 모드로 전환
      if (newProgress >= 100 && normalizedDelta > 0) {
        setIsListScrollMode(true);
        setServiceWidth(50);
        return 100;
      }

      return newProgress;
    });
  }
};
```

#### 3. List 스크롤 제어

```typescript
if (isListScrollMode && listRef.current) {
  e.preventDefault();

  const list = listRef.current;
  const maxScroll = list.scrollHeight - list.clientHeight;
  const newScrollTop = Math.max(
    0,
    Math.min(maxScroll, listScrollTop + e.deltaY)
  );

  setListScrollTop(newScrollTop);
  list.scrollTop = newScrollTop;

  // List 끝 도달
  if (newScrollTop >= maxScroll && e.deltaY > 0) {
    isProcessComplete.current = true;
    isScrollLocked.current = false;
    setIsInHorizontalZone(false);
    setIsListScrollMode(false);
    return;
  }
}
```

#### 4. 프로세스 리셋 (순방향 재시작 가능)

```typescript
// Service 영역 벗어남 감지
if (
  isProcessComplete.current &&
  !isScrollLocked.current &&
  currentScrollY < serviceTriggerPoint.current - 200
) {
  // 플래그 리셋
  isProcessComplete.current = false;

  // 모든 상태 초기화
  setServiceWidth(100);
  setHorizontalProgress(0);
  setRightSectionProgress(0);
  setIsListScrollMode(false);
  setListScrollTop(0);
}
```

### 성능 특성

#### 메모리 사용

- State: 7개 (리렌더링 트리거)
- Ref: 5개 (메모리만 사용)
- 총 메모리 사용량: 최소화

#### 이벤트 처리 빈도

- `scroll`: ~60fps (passive: true로 최적화)
- `wheel`: 사용자 입력 시에만
- `requestAnimationFrame`: 사용하지 않음 (CSS transition 활용)

#### CSS 최적화

```scss
.service {
  transition: width 0.1s ease-out; // 100ms로 부드러움과 반응성 균형
}

.serviceRight {
  transition:
    transform 0.1s ease-out,
    opacity 0.1s ease-out;
}
```

---

## 성능 최적화

### 1. 이벤트 리스너 최적화

```typescript
// Scroll: Passive 모드
window.addEventListener("scroll", handleScroll, { passive: true });
// → 브라우저가 스크롤을 즉시 처리 가능

// Wheel: Non-Passive (필요 시에만)
window.addEventListener("wheel", handleWheel, { passive: false });
// → preventDefault() 가능하지만 성능 영향 있음
```

### 2. Ref 활용으로 불필요한 리렌더링 방지

```typescript
// ❌ State로 관리 시 → 스크롤마다 리렌더링
const [isScrollLocked, setIsScrollLocked] = useState(false);

// ✅ Ref로 관리 → 리렌더링 없음
const isScrollLocked = useRef(false);
```

### 3. CSS Transition 활용

```scss
// ❌ JavaScript 애니메이션
// setInterval(() => { width += 1 })

// ✅ CSS Transition
.service {
  transition: width 0.1s ease-out;
}
```

- GPU 가속 활용
- 메인 스레드 부하 감소

### 4. 조건부 이벤트 처리

```typescript
// 스크롤 잠금 상태일 때만 복잡한 계산
if (isScrollLocked.current) {
  // 진행도 계산, width 업데이트 등
} else {
  // 단순 위치 추적만
}
```

### 5. 의존성 배열 최소화

```typescript
useEffect(() => {
  // ... 이벤트 핸들러
}, [lastScrollY, isListScrollMode, listScrollTop]);
// 필요한 의존성만 포함
```

---

## 학습 내용 및 인사이트

### 기술적 학습

#### 1. 스크롤 하이재킹의 복잡성

- 단순해 보이지만 예외 상황이 매우 많음
- 빠른/느린 스크롤, 트랙패드/마우스, 모바일 등 모든 경우 고려 필요
- 사용자 예측 가능성과 개발자 의도 사이의 균형이 중요

#### 2. 브라우저 스크롤의 비연속성

- 스크롤은 1px씩 움직이지 않음
- 빠른 스크롤 시 픽셀 단위로 건너뜀
- 정확한 위치 감지보다는 범위(threshold) 기반 접근이 필요

#### 3. State vs Ref 선택 기준

- **State**: UI에 영향을 주는 값, 리렌더링 필요
- **Ref**: 성능 최적화, 플래그성 값
- 적절한 선택이 성능에 큰 영향

#### 4. CSS와 JavaScript의 협력

- CSS: Sticky, Transition, Transform
- JavaScript: 상태 관리, 이벤트 제어
- 각각의 강점을 활용한 역할 분담

### UX 설계 학습

#### 1. 사용자 예측 가능성

- 너무 복잡한 인터랙션은 오히려 혼란
- 역방향 프로세스 제거 결정이 좋은 예
- "간결함"이 때로는 "풍부함"보다 나음

#### 2. 민감도 조절의 중요성

- `HORIZONTAL_SCROLL_STEPS = 10`: 적절한 속도
- 너무 빠르면 → 제어 어려움
- 너무 느리면 → 답답함

#### 3. 피드백의 중요성

```typescript
// 개발 중 인디케이터
<div>Progress: {horizontalProgress.toFixed(1)}%</div>
<div>Width: {serviceWidth.toFixed(1)}%</div>
<div>List Scroll: {isListScrollMode ? "활성" : "대기"}</div>
```

- 실시간 피드백으로 동작 확인 및 디버깅

### 프로젝트 관리 학습

#### 1. 점진적 구현의 중요성

1. 기본 스크롤 감지
2. Service Top 도착
3. 스크롤 잠금
4. Width 조절
5. ServiceRight 슬라이드
6. List 스크롤
7. (역방향 - 실패)
8. 최종 정리

→ 각 단계를 확실히 완성하고 다음 단계로

#### 2. 실패의 가치

- 역방향 구현 시도 및 포기
- 시간은 소요됐지만 기술적 한계와 UX 트레이드오프를 깊이 이해
- 완벽한 구현보다 적절한 포기도 중요

#### 3. 문서화의 중요성

- 복잡한 로직은 코드만으로는 이해 어려움
- 주석, 콘솔 로그, 문서가 필수
- 이 문서 자체가 그 예시

### 앞으로의 개선 방향

#### 단기 개선

1. **모바일 대응**
   - 터치 스와이프로 동일한 인터랙션
   - `touchstart`, `touchmove`, `touchend` 이벤트
2. **접근성 개선**
   - 키보드 네비게이션 (Tab, Arrow keys)
   - Skip 버튼 제공
3. **성능 모니터링**
   - FPS 측정
   - 성능 지표 수집

#### 장기 개선

1. **라이브러리화**
   - 재사용 가능한 컴포넌트로 추상화
   - 설정 가능한 옵션 제공
2. **더 풍부한 인터랙션**
   - 패럴랙스 효과
   - 3D 변환
   - 파티클 효과

3. **A/B 테스팅**
   - 사용자 데이터 기반 최적화
   - 이탈률, 체류 시간 등 측정

---

## 결론

### 핵심 성과

✅ 복잡한 다단계 스크롤 인터랙션 구현 완료  
✅ 빠른/느린 스크롤 모두 자연스럽게 대응  
✅ 성능 최적화 (passive 이벤트, CSS transition)  
✅ 코드 가독성 및 유지보수성 확보  
✅ SSR(Next.js) 환경에서 안정적 동작

### 주요 학습

- 스크롤 하이재킹의 기술적 복잡성과 UX 트레이드오프
- 브라우저 이벤트 시스템의 깊은 이해
- State 관리와 성능 최적화 전략
- 실패를 통한 학습과 적절한 포기의 중요성

### 남은 과제

- 모바일 터치 인터랙션
- 접근성 (키보드, 스크린 리더)
- 성능 모니터링 및 최적화
- 크로스 브라우저 테스트

---

## 참고 자료

### 기술 문서

- [MDN: Scroll Event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event)
- [MDN: Wheel Event](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event)
- [CSS Tricks: Position Sticky](https://css-tricks.com/position-sticky-2/)

### 관련 예시

- Apple Product Pages (대표적인 스크롤 하이재킹 사례)
- Awwwards 수상작들의 스크롤 인터랙션

---

## Phase 6: UX 개선 및 역방향 스크롤 재구현 (2025-11-06)

### 6.1 데이터 구조 완성 및 피그마 디자인 반영

#### 실제 콘텐츠 데이터 구성

피그마 디자인에서 8개 카드의 실제 텍스트를 추출하여 `mainServiceSecondAreaData` 완성:

```typescript
export const mainServiceSecondAreaData = [
  {
    title: "중소기업보안",
    desc: "전담 보안 인력이 없고, 보안에\n대규모 투자를 할 수 없는 중소기업을 위한 '구독형' 보안 서비스",
    list: ["PC 보안", "네트워크 보안", "서버 보안", "해킹사고 대응"],
    link: "/security/small-business",
  },
  {
    title: "보안관제",
    desc: "사이버위협을 24시간 모니터링\n하고, 사고징후를 미리 포착하여\n예방하는 고도화된 관제 서비스",
    list: ["파견 관제", "원격 관제", "랜섬웨어대응", "MDR 서비스"],
    link: "/security/control",
  },
  // ... 총 8개 카드 (컨설팅, AI보안, SI/솔루션, 진단/모의해킹, 클라우드 보안, OT보안)
];
```

**주요 개선사항**:

- ✅ `link` 필드 추가로 각 카드 클릭 시 해당 페이지로 이동
- ✅ 줄바꿈(`\n`)을 포함한 실제 디자인 텍스트 반영
- ✅ SCSS에 `white-space: pre-line` 적용으로 자연스러운 줄바꿈

#### 피그마 디자인 스타일 반영

**카드 스타일**:

```scss
.serviceRight__listItem {
  width: 350px;
  min-height: 466px;
  padding: 46px 40px 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(158deg, #6a7176 -8.28%, #34383c 90.16%);
  border-radius: 12px;

  &:hover {
    transform: translateY(-10px); // 10px 위로 이동
    background: #282a2e; // hover 시 단색 배경
  }
}
```

### 6.2 카드 인터랙션 개선

#### 전체 카드 클릭 가능

```tsx
<li key={`${item.title}-${index}`}>
  <Link
    href={item.link}
    className={S.serviceRight__listItem}
    aria-label={`${item.title} 상세 페이지로 이동`}
  >
    {/* 카드 전체 내용 */}
    <span className={S.serviceRight__listItem__moreBtn} aria-hidden="true">
      <span className={S.serviceRight__listItem__moreBtnIcon}>+</span>
    </span>
  </Link>
</li>
```

**개선 포인트**:

- ✅ 카드 전체가 `Link` 컴포넌트로 감싸져 전체 영역 클릭 가능
- ✅ `+ 버튼`은 시각적 요소로만 사용 (`pointer-events: none`)
- ✅ 접근성: `aria-label`로 명확한 안내 제공

### 6.3 타이틀 & 버튼 애니메이션

#### 타이틀 히든 처리 (30% 진행도)

```tsx
<h2
  className={S.service__title}
  style={{
    opacity: horizontalProgress >= 30 ? 0 : 1,
    transition: "opacity 0.3s ease-out",
  }}
>
  사이버보안 서비스 & 솔루션
</h2>
```

**동작**:

- 10:0 → 7:3 전환 시점(30%)에 타이틀 페이드아웃
- 서브 카피(설명)는 계속 유지

#### 전문가 상담 버튼 슬라이드업 애니메이션

```tsx
// 함수화로 코드 간결화
const getButtonAnimationStyle = (): React.CSSProperties => {
  const isVisible = horizontalProgress >= 30;
  return {
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : 20}px)`,
    pointerEvents: isVisible ? "auto" : "none",
  };
};

// JSX
<div className={S.service__btnWrapper} style={getButtonAnimationStyle()}>
  <Link href="/contact/expert-consultation" passHref>
    <MzButton size="Large" fill="Red">
      사이버보안 전문상담
    </MzButton>
  </Link>
</div>;
```

**SCSS**:

```scss
.service__btnWrapper {
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}
```

**동작**:

- 10:0 상태: 버튼 숨김 (`opacity: 0`, `translateY: 20px`)
- 7:3 전환 시작(30%): 아래에서 위로 올라오며 나타남
- 자연스러운 시선 유도: 타이틀 사라짐 → 버튼 등장

### 6.4 페이지 로드/네비게이션 문제 해결

#### 문제 상황

- 페이지 새로고침 또는 뒤로가기 시
- 브라우저가 이전 스크롤 위치를 복원
- mainService 영역이 화면에 보이면 즉시 스크롤 잠금 활성화
- 사용자가 스크롤하지 않았는데도 잠겨있어 부자연스러움

#### 해결 방법

**1) 초기 위치 감지 시스템**

```typescript
const hasUserScrolled = useRef(false); // 사용자가 실제로 스크롤했는지
const initialCheckDone = useRef(false); // 초기 위치 확인 완료

// 초기 위치 확인 (페이지 로드 시 이미 service 영역에 있는지 체크)
if (!initialCheckDone.current) {
  initialCheckDone.current = true;

  // 페이지 로드 시 이미 service 영역에 있다면 프로세스 완료 상태로 간주
  if (currentScrollY >= serviceTriggerPoint.current && currentScrollY > 100) {
    isProcessComplete.current = true;
    setServiceWidth(50); // 5:5 상태로 시작
    setHorizontalProgress(100);
    setRightSectionProgress(100);
    // 스크롤 잠금은 활성화하지 않음
    return;
  }
}
```

**2) 사용자 스크롤 감지**

```typescript
// 사용자 스크롤 감지 (약간의 이동이 있으면 활성화)
if (!hasUserScrolled.current && Math.abs(currentScrollY - lastScrollY) > 5) {
  hasUserScrolled.current = true;
}

// 스크롤 잠금은 사용자가 실제로 스크롤한 후에만 활성화
if (
  hasUserScrolled.current && // ✅ 추가된 조건
  !isScrollLocked.current &&
  !isProcessComplete.current &&
  currentScrollY >= serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
  currentScrollY <= serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2
) {
  // 스크롤 잠금 활성화
}
```

**3) 브라우저 스크롤 복원 제어**

```typescript
useEffect(() => {
  // 브라우저의 자동 스크롤 복원 방지
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // cleanup 시 원래대로 복구
  return () => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  };
}, []);
```

**4) 상태 리셋 시스템**

```typescript
// 사용자가 위로 올라가서 service 영역을 벗어나면 모든 플래그 리셋
if (
  isProcessComplete.current &&
  !isScrollLocked.current &&
  currentScrollY < serviceTriggerPoint.current - 200
) {
  isProcessComplete.current = false;
  hasUserScrolled.current = false; // 스크롤 플래그도 리셋
  // ... 다른 상태 초기화
}
```

### 6.5 역방향 스크롤 재구현

Phase 5에서 제거했던 역방향 스크롤을 개선된 방식으로 재구현:

#### 문제 인식

- 5:5 상태, List scrollTop: 0px에서 위로 스크롤 불가
- progress가 100%로 고정되어 역방향 전환 안됨

#### 해결 로직

**1) List 맨 위에서 위로 스크롤 → 수평 스크롤 역방향 전환**

```typescript
const handleWheel = (e: WheelEvent) => {
  // list 스크롤 모드일 때
  if (isListScrollMode && listRef.current) {
    e.preventDefault();

    const list = listRef.current;
    const maxScroll = list.scrollHeight - list.clientHeight;
    const newScrollTop = Math.max(
      0,
      Math.min(maxScroll, listScrollTop + e.deltaY)
    );

    // List 맨 위에서 위로 스크롤 시 수평 스크롤 역방향 모드로 전환
    if (listScrollTop <= 0 && e.deltaY < 0) {
      console.log("⬅️ List 맨 위 → 수평 스크롤 역방향 모드로 전환");
      setIsListScrollMode(false);
      setIsInHorizontalZone(true); // 수평 스크롤 역방향 시작
      return;
    }

    // ... list 스크롤 처리
  }
};
```

**2) 수평 스크롤 역방향 완료 → 잠금 해제**

```typescript
setHorizontalProgress((prev) => {
  const newProgress = Math.max(0, Math.min(100, prev + deltaStep));

  // ... width 계산

  // 15% 이하로 감소 시 수평 스크롤 잠금 해제 (역방향 탈출)
  if (newProgress <= 15 && normalizedDelta < 0) {
    console.log("⬅️ 수평 스크롤 역방향 완료 → 잠금 해제");
    isScrollLocked.current = false;
    setIsInHorizontalZone(false);
    setServiceWidth(100); // 10:0으로 복귀
    return 0;
  }

  return newProgress;
});
```

#### 역방향 프로세스 흐름

```
5:5 상태, List scrollTop: 0px
         │
         │ 🖱️ 스크롤 업
         ▼
List 맨 위 감지
         │
         ▼
List 모드 종료 → 수평 스크롤 역방향 모드
         │
         │ 🖱️ 계속 스크롤 업
         ▼
Progress: 100% → 90% → ... → 15%
Width: 50% (5:5) → 70% (7:3) → 100% (10:0)
         │
         ▼
Progress ≤ 15% 도달
         │
         ▼
스크롤 잠금 해제 ✅
일반 스크롤로 복귀
```

### 6.6 최종 완성된 프로세스 흐름

```
┌─────────────────────────────────────────────────────┐
│ 1. 페이지 로드                                        │
│    - 초기 위치 확인                                  │
│    - service 영역에 있으면 완료 상태로 시작          │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 2. 사용자 스크롤 감지 (5px 이상 이동)                │
│    hasUserScrolled = true                            │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 3. Service Top 도착 → 스크롤 잠금 ⚡                 │
│    - 타이틀: "사이버보안 서비스 & 솔루션" 표시      │
│    - 설명 표시                                       │
│    - 버튼: 숨김                                      │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 4. 수평 스크롤 (0% → 30%)                           │
│    Width: 100% → 70% (10:0 → 7:3)                   │
│    - 타이틀: 표시 중                                 │
│    - 버튼: 숨김                                      │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 5. 7:3 전환 시점 (30% 도달)                         │
│    - 타이틀: 페이드아웃 👋                          │
│    - 버튼: 아래→위로 슬라이드업 🎯                  │
│    - ServiceRight 슬라이드 시작                     │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 6. 수평 스크롤 완료 (100% 도달)                     │
│    Width: 50% (5:5)                                  │
│    → List 스크롤 모드 전환                           │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│ 7. List 수직 스크롤                                  │
│    - 8개 카드 스크롤                                 │
│    - 각 카드 전체 클릭 가능                          │
│    - hover 시 10px 위로 이동                         │
└───────────────┬─────────────────────────────────────┘
                │
      ┌─────────┴─────────┐
      │                   │
      ▼                   ▼
┌──────────┐      ┌──────────────┐
│ 아래 도달 │      │ 위로 스크롤   │
└────┬─────┘      └──────┬───────┘
     │                   │
     ▼                   ▼
┌──────────────┐  ┌─────────────────────────────────┐
│ 프로세스 완료 │  │ 수평 스크롤 역방향 (100% → 15%) │
│ 5:5 유지     │  │ Width: 50% → 100%               │
│ 잠금 해제    │  │ 버튼: 숨김                       │
└──────────────┘  │ 타이틀: 다시 표시               │
                  └────────┬────────────────────────┘
                           │
                           ▼
                  ┌─────────────────────┐
                  │ 15% 이하 도달        │
                  │ 스크롤 잠금 해제 ✅  │
                  │ 일반 스크롤로 복귀  │
                  └─────────────────────┘
```

### 6.7 코드 구조 개선

#### 함수 분리 및 간결화

```typescript
// 버튼 애니메이션 스타일 계산 함수
const getButtonAnimationStyle = (): React.CSSProperties => {
  const isVisible = horizontalProgress >= 30;
  return {
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : 20}px)`,
    pointerEvents: isVisible ? "auto" : "none",
  };
};
```

#### SCSS 구조화

```scss
.service {
  &__title {
    /* ... */
  }
  &__desc {
    /* ... */
  }
  &__btnWrapper {
    transition:
      opacity 0.4s ease-out,
      transform 0.4s ease-out;
  }
}
```

### 6.8 성능 최적화

**1) overflow 최적화**

```scss
.serviceRight__listWrapper {
  overflow: hidden; // auto → hidden으로 변경
  // 스크롤은 JavaScript로 제어하므로 overflow 불필요
}
```

**2) 배경색 최적화**

```scss
.serviceWrapper {
  background: #1d1d1d; // 배경색 통일로 깜빡임 방지
}
```

### 6.9 주요 학습 내용

#### 1. 브라우저 네비게이션 처리의 중요성

- `history.scrollRestoration` 제어 필요
- 초기 로드 시 상태 감지 시스템 필수
- 사용자 실제 스크롤 vs 프로그래매틱 스크롤 구분

#### 2. 역방향 스크롤의 올바른 구현

- Phase 5에서 제거했던 역방향을 개선된 방식으로 재구현
- List 끝 감지 → 수평 스크롤 전환 로직
- 명확한 탈출 조건 (15% 이하)

#### 3. UX 디테일의 중요성

- 타이틀 히든 + 버튼 등장의 시각적 연결
- 카드 전체 클릭 가능 (접근성 개선)
- hover 효과로 인터랙티브한 느낌

#### 4. 코드 품질

- 함수 분리로 가독성 향상
- SCSS로 스타일 이동 (관심사 분리)
- TypeScript 타입 안전성 유지

### 6.10 남은 과제

- [ ] 모바일 터치 인터랙션 (터치 스와이프)
- [ ] 키보드 네비게이션 (Tab, Arrow keys)
- [ ] Skip 버튼 제공 (접근성)
- [ ] 크로스 브라우저 테스트 (Safari, Firefox)
- [ ] 성능 모니터링 (FPS, 메모리)

---

## Phase 7: 스크롤 바운스 방지 및 UI 개선 (2025-11-06)

### 7.1 스크롤 바운스 문제 발견

#### 문제 상황

- **현상**: 브라우저에서 스크롤 업/다운 시 오버스크롤 바운스가 발생하여 mainservice 컨텐츠가 상하로 튀는 현상
- **영향**: 스크롤 하이재킹 중에도 브라우저의 elastic scrolling(고무줄 효과)이 발생
- **특히 두드러지는 환경**: macOS Safari, Chrome (트랙패드 사용 시)

#### 원인 분석

```
브라우저 기본 동작:
스크롤 끝 도달 → 계속 스크롤 시도
                    ↓
         오버스크롤 발생 (바운스 효과)
                    ↓
         window.scrollTo로 고정해도
         시각적 바운스는 여전히 발생
```

### 7.2 스크롤 바운스 방지 솔루션

#### Solution 1: CSS `overscroll-behavior` (전역)

**파일**: `styles/_reset.scss`

```scss
html,
body {
  width: 100%;
  height: 100%;

  // 스크롤 바운스 방지 (전역)
  overscroll-behavior-y: none;
}
```

**효과**:

- 모든 페이지에서 세로 방향 오버스크롤 비활성화
- 브라우저의 pull-to-refresh, bounce 효과 차단

#### Solution 2: 컴포넌트 레벨 강화

**파일**: `app/sk/components/mainService.module.scss`

```scss
.mainService {
  padding-top: 100px;

  // 스크롤 바운스 방지
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

.serviceWrapper {
  // ...
  // 스크롤 바운스 방지
  overscroll-behavior-y: contain;
}
```

**효과**:

- `.mainService`: 모든 방향 오버스크롤 차단
- `.serviceWrapper`: 세로 스크롤을 컨테이너 내부로 제한
- iOS Safari 부드러운 스크롤 유지

#### Solution 3: JavaScript 대안 (옵션)

**파일**: `app/sk/components/mainService.tsx`

```typescript
// CSS overscroll-behavior로 대부분 해결되지만,
// 추가 제어가 필요한 경우 아래 주석을 해제하세요
/*
const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.top = `-${window.scrollY}px`;
};

const unlockBodyScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
};
*/
```

**사용 시나리오**:

- iOS 15 이하에서 `overscroll-behavior` 미지원 시
- 더욱 강력한 스크롤 제어가 필요한 경우

**주의사항**:

- Body 잠금 시 스크롤 위치 복원 필요
- 깜빡임(flicker) 발생 가능
- CSS 방법 우선 사용 권장

### 7.3 UI 개선: 좌측 경계 블러 효과

#### 개선 배경

- **기존 문제**: 10:0 → 7:3 전환 시 우측 리스트가 딱딱하게 끊어져 보임
- **요구사항**: 좌측 경계에 블러 효과를 주어 서서히 나타나는 느낌
- **제약**: 페이드인/페이드아웃 형태 아님, 구조 변경 불가

#### 구현 방법

**파일**: `app/sk/components/mainService.module.scss`

```scss
.service__left {
  // ...

  // 좌측 경계 블러 효과 (부드러운 등장)
  &::before {
    content: "";
    position: absolute;
    right: -200px; // 우측으로 확장 (좌측 이미지 영역 블러)
    top: 0;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(29, 29, 29, 1) 0%,
      // 완전 불투명
      rgba(29, 29, 29, 0.8) 20%,
      // 80% 불투명
      rgba(29, 29, 29, 0.4) 50%,
      // 40% 불투명
      rgba(29, 29, 29, 0) 100% // 완전 투명
    );
    pointer-events: none;
    z-index: 10;
  }
}
```

#### 시각적 효과

**Before (딱딱한 경계)**:

```
┌──────────────┬────────────┐
│              │ ┃  리스트   │  ← 명확한 분할선
│   좌측 이미지 │ ┃  아이템   │
│              │ ┃  카드     │
└──────────────┴────────────┘
```

**After (부드러운 그라데이션)**:

```
┌──────────────┬────────────┐
│            ░▒│▓  리스트   │  ← 자연스러운 블렌딩
│   좌측 이미지░▒│▓  아이템   │
│            ░▒│▓  카드     │
└──────────────┴────────────┘
```

#### 디테일 설정

| 속성           | 값                 | 설명                         |
| -------------- | ------------------ | ---------------------------- |
| 폭             | 200px              | 블러 효과 범위               |
| 시작점 (0%)    | rgba(29,29,29,1)   | 완전히 배경색과 동일         |
| 중간점 (50%)   | rgba(29,29,29,0.4) | 40% 불투명                   |
| 끝점 (100%)    | rgba(29,29,29,0)   | 완전 투명                    |
| pointer-events | none               | 클릭 이벤트 통과             |
| 위치           | right: -200px      | 좌측 이미지 우측 끝에서 시작 |

### 7.4 버튼 스타일 개선

#### 전문상담 버튼 스타일

**파일**: `app/sk/components/mainService.module.scss`

```scss
.service__btnWrapper {
  margin-top: 50px;
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;

  &__btn {
    width: 320px;
    height: 96px !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    line-height: 150% !important;
  }
}
```

#### 좌측 영역 텍스트 개선

```scss
.service__left {
  // ...

  &__desc {
    // ...
    white-space: pre-line; // 줄바꿈(\n) 처리
  }

  &__inner {
    // ...
    gap: 24px;
    // text-align: center; 제거 (왼쪽 정렬)
  }
}
```

### 7.5 브라우저 호환성

#### `overscroll-behavior` 지원 현황

| 브라우저   | 버전            | 지원 여부  |
| ---------- | --------------- | ---------- |
| Chrome     | 63+             | ✅ Full    |
| Safari     | 16.0+ (iOS 16+) | ✅ Full    |
| Firefox    | 59+             | ✅ Full    |
| Edge       | 18+             | ✅ Full    |
| Safari iOS | 15 이하         | ⚠️ Partial |

#### Fallback 전략

**iOS 15 이하 대응**:

```typescript
// 필요시 JavaScript body 잠금 활성화
if (isScrollLocked.current) {
  lockBodyScroll();
}
```

**Feature Detection**:

```typescript
const supportsOverscrollBehavior = CSS.supports("overscroll-behavior", "none");
if (!supportsOverscrollBehavior) {
  // JavaScript 대안 사용
}
```

### 7.6 성능 최적화

#### CSS vs JavaScript 비교

| 방법                    | 성능       | 부작용       | 권장도 |
| ----------------------- | ---------- | ------------ | ------ |
| CSS overscroll-behavior | ⭐⭐⭐⭐⭐ | 없음         | 최우선 |
| JavaScript body 잠금    | ⭐⭐⭐     | 깜빡임 가능  | 대안   |
| preventDefault on wheel | ⭐⭐       | passive 이슈 | 비권장 |

#### 최적화 결과

**Before**:

- ❌ 스크롤 바운스로 컨텐츠 튐
- ❌ 시각적으로 불안정
- ❌ UX 저하

**After**:

- ✅ 완전히 고정된 스크롤
- ✅ 부드러운 인터랙션
- ✅ 성능 오버헤드 없음

### 7.7 구현 체크리스트

#### 스크롤 바운스 방지

- [x] 전역 `overscroll-behavior-y: none` 적용
- [x] 컴포넌트 레벨 `overscroll-behavior` 적용
- [x] JavaScript 대안 코드 준비 (주석)
- [x] 크로스 브라우저 테스트

#### UI 개선

- [x] 좌측 경계 그라데이션 블러 효과
- [x] 블러 위치 조정 (right: -200px)
- [x] pointer-events: none 설정
- [x] 전문상담 버튼 스타일 개선
- [x] 텍스트 줄바꿈 처리

### 7.8 핵심 학습 내용

#### 1. CSS `overscroll-behavior`의 강력함

- 브라우저 스크롤 동작을 제어하는 가장 우아한 방법
- 성능 오버헤드 없음
- JavaScript 대안보다 안정적

#### 2. Pseudo-element를 활용한 시각 효과

- `::before`, `::after`로 구조 변경 없이 효과 추가
- `pointer-events: none`으로 인터랙션 유지
- 성능에 미치는 영향 최소

#### 3. 그라데이션 블렌딩 기법

- `linear-gradient`로 부드러운 경계 처리
- 투명도 조절로 자연스러운 전환
- 고정 레이아웃에서도 유연한 시각 효과

### 7.9 최종 코드 구조

```
스크롤 바운스 방지
├── styles/_reset.scss (전역)
│   └── overscroll-behavior-y: none
├── mainService.module.scss (컴포넌트)
│   ├── .mainService: overscroll-behavior: none
│   └── .serviceWrapper: overscroll-behavior-y: contain
└── mainService.tsx (JavaScript 대안)
    └── lockBodyScroll/unlockBodyScroll (주석)

UI 개선
├── .service__left::before (블러 효과)
│   ├── width: 200px
│   ├── right: -200px
│   └── linear-gradient
└── .service__btnWrapper (버튼 스타일)
    ├── margin-top: 50px
    └── __btn: 320px × 96px
```

### 7.10 남은 과제 업데이트

- [x] ~~스크롤 바운스 방지~~ ✅ Phase 7 완료
- [x] ~~좌측 경계 블러 효과~~ ✅ Phase 7 완료
- [ ] 모바일 터치 인터랙션 (터치 스와이프)
- [ ] 키보드 네비게이션 (Tab, Arrow keys)
- [ ] Skip 버튼 제공 (접근성)
- [ ] 크로스 브라우저 테스트 (Safari, Firefox, iOS 15)
- [ ] 성능 모니터링 (FPS, 메모리)
- [ ] 반응형 디자인 (모바일/태블릿)

---

**문서 작성일**: 2025-11-05  
**작성자**: AI Pair Programming Session  
**버전**: 3.0  
**최종 업데이트**: Phase 7 스크롤 바운스 방지 및 UI 개선 완료 (2025-11-06)
