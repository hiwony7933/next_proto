# AdtLogoSection 기술 문서

본 문서는 `app/adt/main/AdtLogoSection.tsx`를 유지보수하는 개발자를 위한 상세 가이드입니다. 컴포넌트의 목표, 데이터 흐름, 애니메이션 구간 설계, 스타일 구조, 확장 방법 등을 체계적으로 정리했습니다.

---

## 1. 목적 및 사용자 경험
`AdtLogoSection`은 ADT 브랜드 메시지를 전하는 하이라이트 섹션입니다. 스크롤 흐름에 따라

1. **화이트 → 블루 그라데이션 배경**이 내려오고,
2. **문장형 메시지**가 하나씩 나타나며,
3. **ADT 로고와 방사형 팔각형 링**이 등장해 브랜드 신뢰감을 강조합니다.

이 섹션은 스크롤 압도감을 주는 동시에 로고 등장 시점을 명확히 보여주는 것을 목표로 합니다.

---

## 2. 상수와 데이터 흐름

| 이름 | 설명 |
| --- | --- |
| `ADT_LOGO_MESSAGES` | `motion.ul`에 렌더링되는 문장 배열. CMS 연동 시 분리 가능. |
| `OCTAGON_CONFIG` | 링(팔각형) SVG 좌표를 계산할 때 사용하는 기본 크기, 개수, 반지름 간격. |
| `BACKGROUND_PROGRESS_RANGE` | 배경 오버레이가 시작/완료되는 progress 구간. 기본 `0.05~0.25`. |
| `TEXT_PROGRESS_RANGE` | 메시지 순차 노출 구간. 기본 `0.25~0.7`. |
| `LOGO_PROGRESS_RANGE` | 로고 opacity/scale이 0→1로 바뀌는 구간. 기본 `0.78~0.88`. |
| `RINGS_REVEAL_GROUP_SIZE` | 팔각형 링을 몇 개씩 묶어서 표시할지 결정. 기본 2.5, 즉 2~3개씩 묶여 순차 등장. |

### 모션 값
- `scrollYProgress`: Framer `useScroll` + sticky wrapper를 대상으로 측정.
- `adtLogoSpring`: `scrollYProgress`를 spring 보간해 급격한 스크롤에서도 자연스러운 곡선을 유지.
- `ringsProgress`: 팔각형 순차 노출을 위한 별도 MotionValue. `LOGO_PROGRESS_RANGE[1]` 이후 1로 세팅되며, `RINGS_REVEAL_GROUP_SIZE`에 따라 `AdtLogoRing`에서 useTransform으로 나눠 사용.

---

## 3. 애니메이션 파이프라인
1. **배경 오버레이 (`BACKGROUND_PROGRESS_RANGE`)**
   - `motion.div`의 `scaleY`를 0→1로 조정해 위에서부터 파란 그라데이션이 내려오는 효과.
2. **문장 노출 (`TEXT_PROGRESS_RANGE`)**
   - 메시지 수(n)에 따라 범위를 균등 분배. 각 메시지는 opacity 0→1, y축 24px → 0px으로 이동.
3. **로고 등장 (`LOGO_PROGRESS_RANGE`)**
   - 로고 wrapper는 opacity 0→1.
   - 내부 `motion.div`에는 scale 0.85→1를 적용해 살짝 커지는 느낌 제공.
4. **팔각형 링 (`ringsProgress`)**
   - `ringsProgress`는 `LOGO_PROGRESS_RANGE[1]` 이상의 progress에서 1로 세팅.
   - `AdtLogoRing`은 group-based progress를 사용해 안쪽→바깥쪽 순으로 opacity 1이 됨.

---

## 4. 구성 요소 설명
| 컴포넌트 | 역할 |
| --- | --- |
| `AdtLogoSection` | 전체 레이아웃/스크롤 관찰, 텍스트/배경/로고/링 렌더링. |
| `AdtLogoMessage` | 문장 한 줄에 대한 모션 처리. `useTransform`으로 opacity/y 제어. |
| `AdtLogoRing` | 팔각형 SVG polygon. group index를 계산해 순차적으로 노출. |
| `AdtLogoRings` | SVG 컨테이너. `OCTAGON_POINTS`로 계산한 좌표를 map. |

---

## 5. 스타일 구조 (`adtLogoSection.module.scss`)
- `.adtLogoWrapper`: 섹션 전체 높이(기본 200vh).
- `.adtLogo`: sticky 컨테이너(100vh).
- `.adtLogo__bgOverlay`: 배경 그라데이션, `transform-origin: top center`.
- `.adtLogo__list`: 메시지 레이아웃. 상단 13% 위치에 고정.
- `.adtLogo__visual`: 링 SVG 컨테이너.
- `.adtLogo__logoWrapper` & `.adtLogo__logo`: 중앙 로고.
- `.adtLogo__rings` & `.adtLogo__ring`: SVG 크기/색/스트로크 정의.

모든 클래스는 BEM 규칙을 따릅니다. 다른 섹션과 충돌하지 않도록 CSS Module을 사용했습니다.

---

## 6. 유지보수 및 확장 팁
1. **Progress Range 조정**
   - 배경/문장/로고 타이밍을 변경하려면 각 RANGE 상수를 수정하세요. 0~1 사이 값이며 서로 겹치지 않도록 주의.
2. **링 수량 변경**
   - `OCTAGON_CONFIG.count`와 `maxRadius/gap`을 조정하면 팔각형 개수와 크기를 쉽게 바꿀 수 있습니다.
3. **CMS 연동**
   - `ADT_LOGO_MESSAGES` 배열을 props로 받아 처리하면 다국어/자율 편집에 대응 가능.
4. **터치 디바이스 대응**
   - 추가 제스처(예: swipe to skip)가 필요하면 `useScroll` 대신 Intersection Observer와 조합하는 것을 고려하세요.

---

## 7. 자주 묻는 질문 (FAQ)
- **Q. 스크롤이 너무 빨라서 링 애니메이션이 빨리 끝나면 어떻게 하나요?**  
  A. `LOGO_PROGRESS_RANGE` 후반부를 늘리거나 `RINGS_REVEAL_GROUP_SIZE`로 그룹 크기를 조정하세요. 더 근본적으로는 `ringsProgress`를 별도 spring으로 제어하는 방법도 있음.

- **Q. 배경 이미지/색상을 테넌트마다 다르게 하고 싶습니다.**  
  A. CSS Module 클래스에 테넌트별 modifier를 추가하거나, `AdtLogoSection`에 `variant` props를 만들어 `className`을 분기하세요.

- **Q. 애니메이션이 CPU를 많이 쓰지 않을까요?**  
  A. 모든 모션이 GPU-friendly 속성(`transform`, `opacity`)만 변경하며, `framer-motion` spring을 사용하여 jank를 최소화했습니다. 다만 팔각형 개수가 많으므로 필요 시 SVG를 Canvas 기반으로 바꾸는 것도 대안입니다.

---

## 8. 향후 과제
1. **링 애니메이션 타이밍 고도화**: 현재는 순차적인 opacity 전환만 있음. 회전, scale 등을 추가하면 더 역동적인 느낌을 줄 수 있음.
2. **메시지/로고 접근성 강화**: 스크린 리더에게 핵심 메시지를 요약 제공하거나 `aria-live` 영역을 활용하는 방안 검토.
3. **테스트 자동화**: E2E 테스트에서 sticky 구간을 스크롤하며 progress 변화를 검증하는 스크립트 추가 권장.

---

이 문서를 기반으로 `AdtLogoSection`의 구조와 확장 포인트를 쉽게 파악할 수 있습니다. 추가 정보가 필요하면 상단 상수들을 재검토하거나, 컴포넌트에 JSDoc 주석을 덧붙여 더 풍부한 문맥을 제공하시길 권장합니다.

