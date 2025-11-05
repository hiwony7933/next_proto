"use client";
import { useEffect, useState, useRef } from "react";
import S from "./page.module.scss";

export default function Page() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [serviceWidth, setServiceWidth] = useState(100); // 초기값 100% (10:0)
  const [isInHorizontalZone, setIsInHorizontalZone] = useState(false);
  const [horizontalProgress, setHorizontalProgress] = useState(0); // 0~100 가상 진행도
  const [rightSectionProgress, setRightSectionProgress] = useState(0); // serviceRight 진행도 (0~100)
  const [isListScrollMode, setIsListScrollMode] = useState(false); // list 스크롤 모드
  const [listScrollTop, setListScrollTop] = useState(0); // list 스크롤 위치
  
  const serviceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const serviceTriggerPoint = useRef<number>(0);
  const isScrollLocked = useRef(false);
  const lockedScrollY = useRef(0);
  const isProcessComplete = useRef(false); // 전체 프로세스 완료 플래그
  
  // 수평 스크롤 전환 구간 설정
  const HORIZONTAL_SCROLL_STEPS = 10; // 휠 이벤트 10번으로 100% 진행
  const SCROLL_LOCK_THRESHOLD = 100; // 스크롤 잠금 진입 민감도 (px)

  useEffect(() => {
    // 초기 service 섹션의 위치 계산
    if (serviceRef.current) {
      serviceTriggerPoint.current = serviceRef.current.offsetTop;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }

      // service가 top에 도착했는지 확인 (프로세스가 완료되지 않았을 때만)
      // 버퍼 구간을 두어 자연스럽게 진입
      if (!isScrollLocked.current && 
          !isProcessComplete.current && 
          currentScrollY >= serviceTriggerPoint.current - SCROLL_LOCK_THRESHOLD / 2 &&
          currentScrollY <= serviceTriggerPoint.current + SCROLL_LOCK_THRESHOLD / 2) {
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
          threshold: SCROLL_LOCK_THRESHOLD
        });
      }

      // 스크롤 잠금 상태일 때 강제로 위치 고정
      if (isScrollLocked.current && currentScrollY !== lockedScrollY.current) {
        window.scrollTo(0, lockedScrollY.current);
        return;
      }

      // 프로세스 완료 후 위로 스크롤하여 service 영역을 벗어나면 플래그 리셋
      // (다시 내려올 때 순방향 재시작 가능하도록)
      if (isProcessComplete.current && 
          !isScrollLocked.current && 
          currentScrollY < serviceTriggerPoint.current - 200) {
        console.log("✅ Service 영역 벗어남 → 프로세스 초기화 (순방향 재시작 가능)", {
          currentScrollY,
          triggerPoint: serviceTriggerPoint.current,
          diff: serviceTriggerPoint.current - currentScrollY
        });
        
        // 프로세스 완료 플래그 리셋
        isProcessComplete.current = false;
        
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
      // list 스크롤 모드일 때 (순방향만)
      if (isListScrollMode && listRef.current) {
        e.preventDefault();
        
        const list = listRef.current;
        const maxScroll = list.scrollHeight - list.clientHeight;
        const newScrollTop = Math.max(0, Math.min(maxScroll, listScrollTop + e.deltaY));
        
        setListScrollTop(newScrollTop);
        list.scrollTop = newScrollTop;
        
        console.log("List 스크롤:", {
          scrollTop: newScrollTop,
          maxScroll,
          deltaY: e.deltaY
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
        const normalizedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 100, 3);
        const deltaStep = normalizedDelta * (100 / HORIZONTAL_SCROLL_STEPS);
        
        setHorizontalProgress((prev) => {
          const newProgress = Math.max(0, Math.min(100, prev + deltaStep));
          
          // service width 계산 (100% → 50%)
          // 좌:우 10:0 → 7:3 → 5:5
          const newWidth = 100 - (newProgress / 100) * 50;
          setServiceWidth(newWidth);
          
          // serviceRight 진행도 계산
          // 30% 이후부터 시작 (width 70% = 7:3 시점)
          const rightProgress = Math.max(0, Math.min(100, ((newProgress - 30) / 70) * 100));
          setRightSectionProgress(rightProgress);
          
          console.log("수평 진행도:", {
            progress: newProgress.toFixed(1) + "%",
            width: newWidth.toFixed(1) + "%",
            ratio: `${(newWidth / 10).toFixed(0)}:${((100 - newWidth) / 10).toFixed(0)}`,
            rightProgress: rightProgress.toFixed(1) + "%",
            deltaY: e.deltaY.toFixed(0),
            normalizedDelta: normalizedDelta.toFixed(2)
          });
          
          // 100% 도달 시 list 스크롤 모드로 전환 (순방향만)
          if (newProgress >= 100 && normalizedDelta > 0) {
            console.log("✅ 수평 스크롤 완료 (5:5) → List 스크롤 모드 전환");
            setIsListScrollMode(true);
            setServiceWidth(50); // 완료 시 50% (5:5)
            return 100; // 더 이상 진행하지 않음
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
    };
  }, [lastScrollY, isListScrollMode, listScrollTop]);

  return (
    <div className={S.container}>
      <section style={{ height: "1660px" }}>
        123
      </section>
      <div 
        ref={serviceRef}
        className={S.serviceWrapper}
      >
        {/* 뒤편: serviceRight (배경층) */}
        <section 
          className={S.serviceRight}
          style={{
            transform: `translateX(${rightSectionProgress - 100}%)`,
            opacity: rightSectionProgress > 0 ? 1 : 0
          }}
        >
          <div className={S.serviceRight__inner}>
            <div className={S.serviceRight__inner__title}>
              사이버보안 서비스 & 솔루션
            </div>
            <ul ref={listRef} className={S.serviceRight__list}>
              <li>취약점 진단</li>
              <li>통합 정보 보호</li>
              <li>정보 보안 관리체계</li>
              <li>모의해킹</li>
              <li>개인정보보호</li>
              <li>침입 탐지 시스템</li>
              <li>방화벽 관리</li>
              <li>암호화 솔루션</li>
              <li>보안 컨설팅</li>
              <li>데이터 백업</li>
              <li>재해 복구</li>
              <li>보안 교육</li>
              <li>24시간 관제</li>
              <li>위협 인텔리전스</li>
              <li>보안 감사</li>
            </ul>
          </div>
        </section>
        
        {/* 앞편: service (전경층, 100% → 50%) */}
        <section 
          className={S.service}
          style={{
            width: `${serviceWidth}%`
          }}
        >
          <div className={S.service__inner}>
            <div className={S.service__inner__title}>
              사이버보안 서비스 & 솔루션
            </div>
            <div className={S.service__inner__desc}>
              진단, 모의해킹부터 컨설팅, 통합 관제까지<br/>
              사이버보안 End-to-End 서비스
            </div>
          </div>
        </section>
      </div>
      
      {/* 스크롤 상태 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "20px", 
        right: "20px", 
        padding: "10px 20px", 
        background: isScrollingDown ? "#ff4444" : "#44ff44",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        {isScrollingDown ? "스크롤 다운 ↓" : "스크롤 업 ↑"}
      </div>
      {/* 수평 스크롤 구간 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "70px", 
        right: "20px", 
        padding: "10px 20px", 
        background: isInHorizontalZone ? "#ff6600" : "#cccccc",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        {isInHorizontalZone ? "🔒 스크롤 잠금 활성" : "일반 스크롤"}
      </div>
      {/* 수평 진행도 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "120px", 
        right: "20px", 
        padding: "10px 20px", 
        background: "#9944ff",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        Progress: {horizontalProgress.toFixed(1)}%
      </div>
      {/* Service Width 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "170px", 
        right: "20px", 
        padding: "10px 20px", 
        background: "#4444ff",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        Width: {serviceWidth.toFixed(1)}% ({(serviceWidth / 10).toFixed(0)}:{((100 - serviceWidth) / 10).toFixed(0)})
      </div>
      {/* ServiceRight 진행도 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "220px", 
        right: "20px", 
        padding: "10px 20px", 
        background: "#ff9944",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        Right Progress: {rightSectionProgress.toFixed(1)}%
      </div>
      {/* List 스크롤 모드 표시 (개발용) */}
      <div style={{ 
        position: "fixed", 
        top: "270px", 
        right: "20px", 
        padding: "10px 20px", 
        background: isListScrollMode ? "#00ff88" : "#666666",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000
      }}>
        {isListScrollMode ? "📜 List 스크롤 활성" : "List 대기"}
      </div>
      {/* List 스크롤 위치 표시 (개발용) */}
      {isListScrollMode && (
        <div style={{ 
          position: "fixed", 
          top: "320px", 
          right: "20px", 
          padding: "10px 20px", 
          background: "#00bbff",
          color: "white",
          borderRadius: "8px",
          fontWeight: "bold",
          zIndex: 1000
        }}>
          Scroll: {listScrollTop.toFixed(0)}px
        </div>
      )}
      
      <section style={{ height: "1660px" }} className={S.imsi}>
        123
      </section>
    </div>
  );
}
