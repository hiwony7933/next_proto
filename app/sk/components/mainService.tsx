"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import S from "./mainService.module.scss";
import MzButton from "@/app/common/components/atom/mzButton";

interface MainServiceSecondAreaData {
  title: string;
  desc: string;
  list: string[];
  link: string;
}

interface MainServiceProps {
  data: MainServiceSecondAreaData[];
}

export default function MainService({ data }: MainServiceProps) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [serviceWidth, setServiceWidth] = useState(100); // 초기값 100% (10:0)
  const [isInHorizontalZone, setIsInHorizontalZone] = useState(false);
  const [horizontalProgress, setHorizontalProgress] = useState(0); // 0~100 가상 진행도
  const [rightSectionProgress, setRightSectionProgress] = useState(0); // serviceRight 진행도 (0~100)
  const [isListScrollMode, setIsListScrollMode] = useState(false); // list 스크롤 모드
  const [listScrollTop, setListScrollTop] = useState(0); // list 스크롤 위치

  const serviceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const serviceTriggerPoint = useRef<number>(0);
  const isScrollLocked = useRef(false);
  const lockedScrollY = useRef(0);
  const isProcessComplete = useRef(false); // 전체 프로세스 완료 플래그
  const hasUserScrolled = useRef(false); // 사용자가 실제로 스크롤했는지 플래그
  const initialCheckDone = useRef(false); // 초기 위치 확인 완료 플래그

  // 수평 스크롤 전환 구간 설정
  const HORIZONTAL_SCROLL_STEPS = 5; // 휠 이벤트 10번으로 100% 진행
  const SCROLL_LOCK_THRESHOLD = 100; // 스크롤 잠금 진입 민감도 (px)

  // 버튼 애니메이션 스타일 계산 함수
  const getButtonAnimationStyle = (): React.CSSProperties => {
    const isVisible = horizontalProgress >= 30;
    return {
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? 0 : 20}px)`,
      pointerEvents: isVisible ? "auto" : "none",
    };
  };

  useEffect(() => {
    // 브라우저의 스크롤 복원 방지 (히스토리 백/포워드 시)
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 초기 service 섹션의 위치 계산
    if (serviceRef.current) {
      serviceTriggerPoint.current = serviceRef.current.offsetTop;
    }

    // 스크롤 잠금 상태 관리 함수 (필요시 활성화)
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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 초기 위치 확인 (페이지 로드 시 이미 service 영역에 있는지 체크)
      if (!initialCheckDone.current) {
        initialCheckDone.current = true;

        // 페이지 로드 시 이미 service 영역에 있다면 프로세스 완료 상태로 간주
        if (
          currentScrollY >= serviceTriggerPoint.current &&
          currentScrollY > 100
        ) {
          console.log(
            "⚠️ 초기 로드 시 service 영역에 위치 → 프로세스 완료 상태로 설정"
          );
          isProcessComplete.current = true;
          setServiceWidth(50); // 5:5 상태로 시작
          setHorizontalProgress(100);
          setRightSectionProgress(100);
          // 스크롤 잠금은 활성화하지 않음
          return;
        }
      }

      // 사용자 스크롤 감지 (약간의 이동이 있으면 활성화)
      if (
        !hasUserScrolled.current &&
        Math.abs(currentScrollY - lastScrollY) > 5
      ) {
        hasUserScrolled.current = true;
      }

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }

      // service가 top에 도착했는지 확인
      // (프로세스가 완료되지 않았고 사용자가 실제로 스크롤한 경우에만)
      if (
        hasUserScrolled.current &&
        !isScrollLocked.current &&
        !isProcessComplete.current &&
        currentScrollY >=
          serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
        currentScrollY <=
          serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2
      ) {
        // 수평 스크롤 구간 진입
        setIsInHorizontalZone(true);
        isScrollLocked.current = true;
        lockedScrollY.current = serviceTriggerPoint.current;
        setServiceWidth(100); // 초기값 100% (10:0)
        setHorizontalProgress(0); // 진행도 리셋
        setRightSectionProgress(0); // serviceRight 진행도 리셋
        setIsListScrollMode(false); // list 스크롤 모드 리셋
        setListScrollTop(0); // list 스크롤 위치 리셋

        console.log("수평 스크롤 모드 진입, 스크롤 잠금:", {
          currentScrollY,
          triggerPoint: serviceTriggerPoint.current,
          threshold: SCROLL_LOCK_THRESHOLD,
        });
      }

      // 스크롤 잠금 상태일 때 강제로 위치 고정
      if (isScrollLocked.current && currentScrollY !== lockedScrollY.current) {
        window.scrollTo(0, lockedScrollY.current);
        return;
      }

      // 프로세스 완료 후 위로 스크롤하여 service 영역을 벗어나면 플래그 리셋
      // (다시 내려올 때 순방향 재시작 가능하도록)
      if (
        isProcessComplete.current &&
        !isScrollLocked.current &&
        currentScrollY < serviceTriggerPoint.current - 200
      ) {
        console.log(
          "✅ Service 영역 벗어남 → 프로세스 초기화 (순방향 재시작 가능)",
          {
            currentScrollY,
            triggerPoint: serviceTriggerPoint.current,
            diff: serviceTriggerPoint.current - currentScrollY,
          }
        );

        // 프로세스 완료 플래그 리셋
        isProcessComplete.current = false;
        hasUserScrolled.current = false; // 스크롤 플래그도 리셋

        // 모든 상태 초기화
        setServiceWidth(100);
        setHorizontalProgress(0);
        setRightSectionProgress(0);
        setIsListScrollMode(false);
        setListScrollTop(0);
      }

      setLastScrollY(currentScrollY);
    };

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
          // 수평 스크롤 역방향 시작 (100%에서 감소)
          setIsInHorizontalZone(true);
          return;
        }

        setListScrollTop(newScrollTop);
        list.scrollTop = newScrollTop;

        console.log("List 스크롤:", {
          scrollTop: newScrollTop,
          maxScroll,
          deltaY: e.deltaY,
        });

        // list 스크롤 끝에 도달하고 아래로 스크롤 시 프로세스 완료
        if (newScrollTop >= maxScroll && e.deltaY > 0) {
          console.log("✅ List 스크롤 완료 → 프로세스 완료 (5:5 상태 유지)");
          // 전체 프로세스 완료 플래그 설정
          isProcessComplete.current = true;
          // 즉시 잠금 해제
          isScrollLocked.current = false;
          setIsInHorizontalZone(false);
          setIsListScrollMode(false);
          // 5:5 상태는 유지 (serviceWidth: 50%)
          // 다음 스크롤 이벤트부터 일반 스크롤로 동작
          return;
        }

        return;
      }

      // 수평 스크롤 구간에 있을 때만 처리
      if (isScrollLocked.current) {
        e.preventDefault();

        // deltaY 값을 정규화하여 스크롤 속도 반영
        // 일반적인 deltaY: 작은 스크롤 ~100, 빠른 스크롤 ~300+
        const normalizedDelta =
          Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
        const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);

        setHorizontalProgress((prev) => {
          const newProgress = Math.max(0, Math.min(100, prev + deltaStep));

          // service width 계산 (100% → 50%)
          // 좌:우 10:0 → 7:3 → 5:5
          const newWidth = 100 - (newProgress / 100) * 50;
          setServiceWidth(newWidth);

          // serviceRight 진행도 계산
          // 30% 이후부터 시작 (width 70% = 7:3 시점)
          const rightProgress = Math.max(
            0,
            Math.min(100, ((newProgress - 30) / 70) * 100)
          );
          setRightSectionProgress(rightProgress);

          console.log("수평 진행도:", {
            progress: newProgress.toFixed(1) + "%",
            width: newWidth.toFixed(1) + "%",
            ratio: `${(newWidth / 10).toFixed(0)}:${((100 - newWidth) / 10).toFixed(0)}`,
            rightProgress: rightProgress.toFixed(1) + "%",
            deltaY: e.deltaY.toFixed(0),
            normalizedDelta: normalizedDelta.toFixed(2),
          });

          // 100% 도달 시 list 스크롤 모드로 전환 (순방향)
          if (newProgress >= 100 && normalizedDelta > 0) {
            console.log("✅ 수평 스크롤 완료 (5:5) → List 스크롤 모드 전환");
            setIsListScrollMode(true);
            setServiceWidth(50); // 완료 시 50% (5:5)
            return 100; // 더 이상 진행하지 않음
          }

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
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });

    // cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);

      // 스크롤 복원 기능 원래대로 복구
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, [lastScrollY, isListScrollMode, listScrollTop]);

  return (
    <section className={S.mainService}>
      <div ref={serviceRef} className={S.serviceWrapper}>
        {/* 뒤편: serviceRight (배경층) */}
        <section
          className={S.serviceRight}
          style={{
            transform: `translateX(${rightSectionProgress - 100}%)`,
            opacity: rightSectionProgress > 0 ? 1 : 0,
          }}
        >
          <div ref={listRef} className={S.serviceRight__listWrapper}>
            <ul className={S.serviceRight__list}>
              {data.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <Link
                    href={item.link}
                    className={S.serviceRight__listItem}
                    aria-label={`${item.title} 상세 페이지로 이동`}
                  >
                    <div className={S.serviceRight__listItem__title}>
                      {item.title}
                    </div>
                    <div className={S.serviceRight__listItem__desc}>
                      {item.desc}
                    </div>
                    <ul className={S.serviceRight__listItem__tags}>
                      {item.list.map((listContent, listIndex) => (
                        <li
                          key={`${item.title}-${listIndex}`}
                          className={S.serviceRight__listItem__tag}
                        >
                          <span className={S.serviceRight__listItem__tagHash}>
                            #
                          </span>
                          {listContent}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={S.serviceRight__listItem__moreBtn}
                      aria-hidden="true"
                    >
                      <span className={S.serviceRight__listItem__moreBtnIcon}>
                        +
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 앞편: service (전경층, 100% → 50%) */}
        <section
          className={S.service}
          style={{
            width: `${serviceWidth}%`,
          }}
        >
          <div className={`${S.service__inner} layout__container`}>
            <div
              className={S.service__content}
              style={{
                alignItems: horizontalProgress >= 30 ? "flex-start" : "center",
              }}
            >
              <h2
                className={S.service__title}
                style={{
                  opacity: horizontalProgress >= 30 ? 0 : 1,
                  transition: "opacity 0.3s ease-out",
                }}
              >
                사이버보안 서비스 & 솔루션
              </h2>
              <p
                className={S.service__desc}
                style={{
                  textAlign: horizontalProgress >= 30 ? "left" : "center",
                  transition: "text-align 0.3s ease-out",
                }}
              >
                {horizontalProgress >= 30
                  ? `진단, 모의해킹부터\n컨설팅, 통합 관제까지`
                  : `진단, 모의해킹부터 컨설팅, 통합 관제까지`}
                <br />
                사이버보안 End-to-End 서비스
              </p>
              <div
                className={S.service__btnWrapper}
                style={getButtonAnimationStyle()}
              >
                <MzButton
                  className={S.service__btnWrapper__btn}
                  size="Large"
                  fill="Red"
                  href="/contact/expert-consultation"
                  passHref
                >
                  사이버보안 전문상담
                </MzButton>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 스크롤 상태 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: isScrollingDown ? "#ff4444" : "#44ff44",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        {isScrollingDown ? "스크롤 다운 ↓" : "스크롤 업 ↑"}
      </div> */}
      {/* 수평 스크롤 구간 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          padding: "10px 20px",
          background: isInHorizontalZone ? "#ff6600" : "#cccccc",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        {isInHorizontalZone ? "🔒 스크롤 잠금 활성" : "일반 스크롤"}
      </div> */}
      {/* 수평 진행도 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "120px",
          right: "20px",
          padding: "10px 20px",
          background: "#9944ff",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        Progress: {horizontalProgress.toFixed(1)}%
      </div> */}
      {/* Service Width 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "170px",
          right: "20px",
          padding: "10px 20px",
          background: "#4444ff",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        Width: {serviceWidth.toFixed(1)}% ({(serviceWidth / 10).toFixed(0)}:
        {((100 - serviceWidth) / 10).toFixed(0)})
      </div> */}
      {/* ServiceRight 진행도 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "220px",
          right: "20px",
          padding: "10px 20px",
          background: "#ff9944",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        Right Progress: {rightSectionProgress.toFixed(1)}%
      </div> */}
      {/* List 스크롤 모드 표시 (개발용) */}
      {/* <div
        style={{
          position: "fixed",
          top: "270px",
          right: "20px",
          padding: "10px 20px",
          background: isListScrollMode ? "#00ff88" : "#666666",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        {isListScrollMode ? "📜 List 스크롤 활성" : "List 대기"}
      </div> */}
      {/* List 스크롤 위치 표시 (개발용) */}
      {/* {isListScrollMode && (
        <div
          style={{
            position: "fixed",
            top: "320px",
            right: "20px",
            padding: "10px 20px",
            background: "#00bbff",
            color: "white",
            borderRadius: "8px",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          Scroll: {listScrollTop.toFixed(0)}px
        </div>
      )} */}
    </section>
  );
}
