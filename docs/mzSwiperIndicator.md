# MzSwiperIndicator 컴포넌트 가이드

## 📋 개요

`MzSwiperIndicator`는 Swiper 슬라이더와 함께 사용하는 커스텀 인디케이터 컴포넌트입니다.  
모바일 스와이프 UI에서 현재 위치를 시각적으로 표시하고, 특정 슬라이드로 빠르게 이동할 수 있는 기능을 제공합니다.

### 위치
```
app/common/components/molecule/
├── mzSwiperIndicator.tsx
└── mzSwiperIndicator.module.scss
```

---

## ✨ 주요 특징

- ✅ **2가지 테마 지원**: 밝은 배경용(light) / 어두운 배경용(dark)
- ✅ **완전한 접근성**: 키보드 네비게이션, 스크린 리더 지원
- ✅ **반응형**: 모바일/태블릿 최적화
- ✅ **BEM 방식**: 명확한 클래스 네이밍 규칙
- ✅ **재사용 가능**: 모든 Swiper 기반 컴포넌트에서 사용 가능

---

## 📦 Props 인터페이스

```typescript
interface MzSwiperIndicatorProps {
  /**
   * 전체 슬라이드 개수
   */
  totalSlides: number;

  /**
   * 현재 활성화된 슬라이드 인덱스 (0부터 시작)
   */
  activeIndex: number;

  /**
   * 인디케이터 클릭 시 호출되는 콜백 함수
   * @param index - 클릭된 슬라이드 인덱스
   */
  onIndicatorClick: (index: number) => void;

  /**
   * 인디케이터 색상 테마
   * - 'light': 밝은 배경용 (어두운 인디케이터)
   * - 'dark': 어두운 배경용 (밝은 인디케이터) - 기본값
   * @default 'dark'
   */
  variant?: "light" | "dark";

  /**
   * 추가 CSS 클래스명
   * @optional
   */
  className?: string;

  /**
   * 접근성을 위한 aria-label
   * @default "슬라이드 인디케이터"
   */
  ariaLabel?: string;
}
```

---

## 🎨 테마 (Variant)

### 🌙 Dark 테마 (기본값)
**사용 시점**: 어두운 배경에서 사용 (검은색, 회색, 진한 색상)

**스타일**:
- 트랙 배경: `rgba(255, 255, 255, 0.3)` (밝은 회색)
- 인디케이터: 흰색 (`#fff`)
- 활성 상태: `opacity: 1`
- 비활성 상태: `opacity: 0.3`

```tsx
<MzSwiperIndicator
  totalSlides={8}
  activeIndex={activeIndex}
  onIndicatorClick={handleClick}
  variant="dark" // 또는 생략 (기본값)
/>
```

### ☀️ Light 테마
**사용 시점**: 밝은 배경에서 사용 (흰색, 연한 회색, 밝은 색상)

**스타일**:
- 트랙 배경: `rgba(0, 0, 0, 0.1)` (연한 회색)
- 인디케이터: 검은색 (`#000`)
- 활성 상태: `opacity: 0.8`
- 비활성 상태: `opacity: 0.3`

```tsx
<MzSwiperIndicator
  totalSlides={8}
  activeIndex={activeIndex}
  onIndicatorClick={handleClick}
  variant="light"
/>
```

---

## 💡 사용 방법

### 1. 기본 사용법

```tsx
"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import MzSwiperIndicator from "@/app/common/components/molecule/mzSwiperIndicator";
import "swiper/css";

export default function MySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleIndicatorClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  return (
    <div>
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
      >
        <SwiperSlide>슬라이드 1</SwiperSlide>
        <SwiperSlide>슬라이드 2</SwiperSlide>
        <SwiperSlide>슬라이드 3</SwiperSlide>
      </Swiper>

      <MzSwiperIndicator
        totalSlides={3}
        activeIndex={activeIndex}
        onIndicatorClick={handleIndicatorClick}
        variant="dark"
      />
    </div>
  );
}
```

### 2. mainServiceM.tsx 실제 사용 예시

```tsx
"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import MzSwiperIndicator from "@/app/common/components/molecule/mzSwiperIndicator";

export default function MainServiceM({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handlePaginationClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  return (
    <section>
      {/* Swiper 슬라이더 */}
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        breakpoints={{
          320: { slidesPerView: "auto", spaceBetween: 16 },
          720: { slidesPerView: "auto", spaceBetween: 20 },
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            {/* 슬라이드 컨텐츠 */}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 인디케이터 */}
      <MzSwiperIndicator
        totalSlides={data.length}
        activeIndex={activeIndex}
        onIndicatorClick={handlePaginationClick}
        variant="dark"
        ariaLabel="서비스 카드 인디케이터"
      />
    </section>
  );
}
```

### 3. 밝은 배경에서 사용

```tsx
export default function LightBackgroundSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <div style={{ background: "#fff", padding: "40px" }}>
      <Swiper
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {/* 슬라이드 */}
      </Swiper>

      {/* Light 테마 사용 */}
      <MzSwiperIndicator
        totalSlides={5}
        activeIndex={activeIndex}
        onIndicatorClick={(index) => swiperInstance?.slideTo(index)}
        variant="light"  // 밝은 배경이므로 어두운 인디케이터
        ariaLabel="제품 이미지 인디케이터"
      />
    </div>
  );
}
```

---

## 🎯 필수 구현 패턴

### ✅ 필수 상태 관리

```tsx
// 1. activeIndex 상태 (현재 슬라이드)
const [activeIndex, setActiveIndex] = useState(0);

// 2. swiperInstance 상태 (Swiper 인스턴스 참조)
const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
```

### ✅ 필수 핸들러

```tsx
// 1. 슬라이드 변경 감지
const handleSlideChange = (swiper: SwiperType) => {
  setActiveIndex(swiper.activeIndex);
};

// 2. 인디케이터 클릭 처리
const handleIndicatorClick = (index: number) => {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
};
```

### ✅ Swiper 연결

```tsx
<Swiper
  onSwiper={setSwiperInstance}      // 인스턴스 저장
  onSlideChange={handleSlideChange} // 슬라이드 변경 감지
>
  {/* 슬라이드 */}
</Swiper>
```

---

## 📱 반응형 지원

컴포넌트는 자동으로 반응형으로 동작합니다:

```scss
// 모바일 (≤719px)
@include mobiles {
  .mzSwiperIndicator__track {
    height: 2px;  // 기본 높이
  }
}

// 태블릿 (720px~1023px)
@include tablet {
  .mzSwiperIndicator__track {
    height: 3px;  // 조금 더 두껍게
  }
}
```

---

## ♿ 접근성 (Accessibility)

### 자동 지원되는 기능

1. **키보드 네비게이션**
   - `Tab` 키로 인디케이터 간 이동
   - `Enter` 또는 `Space`로 슬라이드 이동

2. **스크린 리더 지원**
   - 각 인디케이터에 `aria-label` 자동 생성
   - 현재 활성 슬라이드에 `aria-current="true"` 적용

3. **포커스 표시**
   - `:focus-visible`로 키보드 포커스 명확히 표시

### 접근성 커스터마이징

```tsx
<MzSwiperIndicator
  totalSlides={10}
  activeIndex={activeIndex}
  onIndicatorClick={handleClick}
  ariaLabel="제품 이미지 갤러리"  // 커스텀 라벨
/>
```

**생성되는 HTML 예시**:
```html
<div aria-label="제품 이미지 갤러리">
  <button aria-label="1번째 슬라이드 보기" aria-current="true">...</button>
  <button aria-label="2번째 슬라이드 보기">...</button>
  <button aria-label="3번째 슬라이드 보기">...</button>
</div>
```

---

## 🎨 스타일 커스터마이징

### 기본 패딩 추가

```tsx
<div style={{ padding: "0 20px" }}>
  <MzSwiperIndicator
    totalSlides={8}
    activeIndex={activeIndex}
    onIndicatorClick={handleClick}
  />
</div>
```

### CSS Module로 추가 스타일

```scss
// yourComponent.module.scss
.customIndicator {
  margin-top: 32px;
  margin-bottom: 40px;
  padding: 0 20px;
}
```

```tsx
// yourComponent.tsx
<MzSwiperIndicator
  totalSlides={8}
  activeIndex={activeIndex}
  onIndicatorClick={handleClick}
  className={styles.customIndicator}
/>
```

---

## 🔧 BEM 클래스 구조

컴포넌트는 BEM 방식을 따릅니다:

```scss
.mzSwiperIndicator              // Block: 컨테이너
  &--dark                        // Modifier: 어두운 배경용
  &--light                       // Modifier: 밝은 배경용
  &__track                       // Element: 인디케이터 트랙
  &__item                        // Element: 개별 인디케이터
    &__active                    // Modifier: 활성 상태
```

**생성되는 클래스명**:
```html
<div class="mzSwiperIndicator mzSwiperIndicator--dark">
  <div class="mzSwiperIndicator__track">
    <button class="mzSwiperIndicator__item mzSwiperIndicator__item__active"></button>
    <button class="mzSwiperIndicator__item"></button>
  </div>
</div>
```

---

## 🚨 주의사항

### ❌ 잘못된 사용

```tsx
// 1. swiperInstance 없이 사용
<MzSwiperIndicator
  totalSlides={5}
  activeIndex={activeIndex}
  onIndicatorClick={(index) => {
    // ❌ swiperInstance가 없으면 동작하지 않음
    swiperInstance.slideTo(index);
  }}
/>

// 2. onSlideChange 없이 사용
<Swiper onSwiper={setSwiperInstance}>
  {/* ❌ onSlideChange가 없으면 activeIndex가 업데이트되지 않음 */}
</Swiper>

// 3. totalSlides와 실제 슬라이드 개수 불일치
<Swiper>
  <SwiperSlide>1</SwiperSlide>
  <SwiperSlide>2</SwiperSlide>
  <SwiperSlide>3</SwiperSlide>
</Swiper>
<MzSwiperIndicator
  totalSlides={5}  // ❌ 실제는 3개인데 5개로 설정
  activeIndex={activeIndex}
  onIndicatorClick={handleClick}
/>
```

### ✅ 올바른 사용

```tsx
const slides = [1, 2, 3, 4, 5];
const [activeIndex, setActiveIndex] = useState(0);
const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

<Swiper
  onSwiper={setSwiperInstance}
  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
>
  {slides.map((slide) => (
    <SwiperSlide key={slide}>{slide}</SwiperSlide>
  ))}
</Swiper>

<MzSwiperIndicator
  totalSlides={slides.length}  // ✅ 배열 길이 사용
  activeIndex={activeIndex}
  onIndicatorClick={(index) => {
    if (swiperInstance) {  // ✅ null 체크
      swiperInstance.slideTo(index);
    }
  }}
/>
```

---

## 📊 성능 최적화

### 1. useCallback 사용

```tsx
import { useCallback } from "react";

const handleIndicatorClick = useCallback((index: number) => {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
}, [swiperInstance]);

<MzSwiperIndicator
  totalSlides={data.length}
  activeIndex={activeIndex}
  onIndicatorClick={handleIndicatorClick}  // 메모이제이션
/>
```

### 2. 조건부 렌더링

```tsx
{data.length > 1 && (  // 슬라이드가 1개보다 많을 때만 표시
  <MzSwiperIndicator
    totalSlides={data.length}
    activeIndex={activeIndex}
    onIndicatorClick={handleIndicatorClick}
  />
)}
```

---

## 📝 체크리스트

컴포넌트를 사용할 때 다음 항목을 확인하세요:

- [ ] `useState`로 `activeIndex` 상태 관리
- [ ] `useState`로 `swiperInstance` 상태 관리
- [ ] `Swiper`에 `onSwiper` prop 연결
- [ ] `Swiper`에 `onSlideChange` prop 연결
- [ ] `totalSlides`에 정확한 슬라이드 개수 전달
- [ ] `onIndicatorClick`에서 `swiperInstance.slideTo()` 호출
- [ ] 배경색에 맞는 `variant` 선택 (dark/light)
- [ ] 필요시 `ariaLabel` 커스터마이징
- [ ] 접근성 테스트 (키보드 네비게이션, 스크린 리더)

---

## 🔗 관련 파일

- 컴포넌트: `app/common/components/molecule/mzSwiperIndicator.tsx`
- 스타일: `app/common/components/molecule/mzSwiperIndicator.module.scss`
- 사용 예시: `app/sk/components/mainServiceM.tsx`
- Swiper 공식 문서: https://swiperjs.com/react

---

## 📞 문의 및 개선

컴포넌트 사용 중 문제가 발생하거나 개선 제안이 있다면 팀에 문의해주세요.

**마지막 업데이트**: 2024년 11월

