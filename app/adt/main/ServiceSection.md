# ServiceSection 기술 문서

본 문서는 `app/adt/main/ServiceSection.tsx` 구성 요소를 후속 작업자가 빠르게 이해하고 확장할 수 있도록 작성되었습니다. 컴포넌트 목적, 데이터/상수, 모션 처리 방식, 스타일 구조, 유지보수 체크리스트를 상세히 정리합니다.

---

## 1. 컴포넌트 목적
- ADT 랜딩 상단에서 **우측 비주얼 영역의 폭이 스크롤에 따라 100% → 50%까지 감소**하며 긴장감을 주는 섹션.
- 좌측 `serviceRight` 패널은 sticky 컨테이너 안에서 고정된 채 서비스 리스트를 노출하고, 우측 `service` 영역은 실제 어트랙션 배경 역할을 수행.
- 전체 섹션 높이를 555vh로 잡아, 한 번의 스크롤 과정에서 서비스 메시지를 충분히 노출시키는 것이 목표.

---

## 2. 주요 상수 및 데이터 흐름
| 상수 | 위치 | 설명 |
| --- | --- | --- |
| `SCROLL_SENSITIVITY` | `ServiceSection.tsx` | 휠 델타를 얼마나 widthProgress에 반영할지 결정 (기본 0.0015). |
| 서비스 목록 데이터 | JSX 내부 | mock 형태로 하드코딩되어 있으며, 실제 프로젝트에서는 API 혹은 CMS로 분리 가능. |

### 상태/모션 값
- `widthProgress`: `useMotionValue`로 관리되며, 휠 이벤트마다 0~1 범위에서 증감.
- `widthSpring`: `useSpring(widthProgress)` – 스프링 애니메이션을 통해 `widthProgress` 값 변화를 부드럽게 보간.
- `width`: `useTransform(widthSpring, [0, 1], ["100%", "50%"])`.
- `serviceRightX`: `useTransform(widthSpring, [0, 0.6, 1], ["0%", "0%", "100%"])` – 우측 배경이 좁아질수록 좌측 패널이 천천히 오른쪽으로 이동하는 효과.

---

## 3. 인터랙션 상세
1. **스크롤/휠 감지**
   - `handleWheel` 함수는 `serviceRef` 영역에 포커스가 잡혀 있을 때만 동작.
   - 휠 델타를 `widthProgress`에 누적. 음수 델타는 확장, 양수 델타는 축소.
2. **스타일 반영**
   - `motion.div` (우측 영역)에 `style={{ width }}` 전달. 이 값은 spring 기반이므로 큰 델타에도 자연스러운 easing을 유지.
   - `serviceRight`는 절대 위치로 띄워서 `serviceWrapper`를 기준으로 이동. `x` 스타일에 `serviceRightX` 할당.
3. **접근성 고려**
   - 우측 `service` 영역은 `tabIndex={0}`와 `aria-label`을 가지므로 키보드 사용자가 포커스를 두고 휠/트랙패드 조작 가능.

---

## 4. 스타일 구조 (BEM)
`serviceSection.module.scss`는 다음 블록/엘리먼트를 포함합니다.

- `.serviceWrapper`: Sticky 컨테이너. 높이 555vh, `position: sticky` + `top: 0`.
- `.serviceRight`
  - `&__inner`: 패널 내부 레이아웃.
  - `&__list`: 서비스 목록 `ul`. 내부 `li`는 호버 시 오른쪽으로 10px 이동.
- `.service`
  - `&__inner`, `&__inner__title`, `&__inner__desc`: 우측 배경 텍스트 영역.

> ✅ **TIP**: 디자인 팀이 레이아웃 높이를 요청하면 `.serviceWrapper`의 `height`를 조정하면 된다. 패널 자체는 100vh 고정이므로 높이 변화에 따른 콘텐츠 오버플로우는 좌측 목록 스크롤로 처리됨.

---

## 5. 확장 및 유지보수 시 유의점
1. **서비스 목록 데이터 분리**
   - 향후 CMS 연동 시 `services` 배열을 상단 상수로 이동하거나 props로 주입.
2. **반응형 Breakpoint**
   - 현재 스타일은 데스크탑 기준. 모바일/태블릿 대응이 필요하면 SCSS에 media mixin을 추가해 폭, padding, font-size를 조정.
3. **애니메이션 민감도**
   - 사용자 피드백에 따라 휠 감도를 조정할 수 있음 (`SCROLL_SENSITIVITY`). 너무 크게 잡으면 작은 스크롤에도 폭이 급격히 변동.
4. **접근성 유지**
   - 우측 영역의 `aria-label`/`tabIndex`를 유지하거나, 포커스 이동 시 애니메이션이 과도하게 움직이지 않도록 `handleWheel` 안에서 `event.preventDefault()` 고려 가능.

---

## 6. 추후 작업 아이디어
- **서비스 카드 컴포넌트화**: 리스트 항목을 카드 컴포넌트로 분리하여 아이콘/CTA 등을 추가하기 용이하게 만들 수 있음.
- **Progress Indicator**: 우측 폭 감소 상태를 시각적으로 나타내는 progress bar를 추가하면 사용자에게 현재 위치를 명확히 제공.
- **터치 디바이스 대응**: 모바일에서는 휠 이벤트 대신 `touchmove` 기반의 모션이 필요하므로 인터랙션을 분리 구현 권장.

---

이 문서는 최소한의 엣지 케이스를 고려해 작성된 가이드입니다. 다른 에이전트가 `ServiceSection`을 수정할 때 본 문서를 참고하면 스크롤 기반 Lottie/GSAP 전환 등도 쉽게 도입할 수 있습니다. 필요 시 이 파일을 더 확장하여 디자인 시스템, 실 사용 데이터 구조 등을 추가하세요.

