'use client';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styles from './mzTreeNew.module.scss';

export interface MzTreeProps {
  data: any[];
  className?: string;
  style?: React.CSSProperties;
  onNodeSelect?: (node: any) => void; //선택이벤트
  onNode3DepthClick?: (node: any) => void; //3뎁스 클릭이벤트
  onNode4DepthClick?: (node: any) => void; //4뎁스 클릭이벤트
}

export default function MzTreeNew({
  data,
  className,
  style,
  onNodeSelect,
  onNode3DepthClick,
  onNode4DepthClick,
}: MzTreeProps) {
  const [treeData, setTreeData] = useState(data);
  const [openedNodes, setOpenedNodes] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // 노드의 고유 키 생성 함수 (성능 최적화: useCallback 적용)
  const getNodeKey = useCallback((item: any, index: number, parentKey: string = '') => {
    return parentKey ? `${parentKey}-${index}` : `${index}`;
  }, []);

  // 버튼 className 결정 함수 (성능 최적화: useCallback 적용)
  const getButtonClassName = useCallback((item: any) => {
    return item.children && item.children.length > 0 ? 'folderBtn' : 'docBtn';
  }, []);

  // 모든 노드 키를 수집하는 재귀 함수 (성능 최적화: useCallback 적용)
  const getAllNodeKeys = useCallback(
    (items: any[], parentKey: string = ''): string[] => {
      const keys: string[] = [];
      items.forEach((item, index) => {
        const nodeKey = getNodeKey(item, index, parentKey);
        keys.push(nodeKey);
        if (item.children && item.children.length > 0) {
          keys.push(...getAllNodeKeys(item.children, nodeKey));
        }
      });
      return keys;
    },
    [getNodeKey],
  );

  // 성능 최적화: 모든 노드 키를 메모이제이션
  const allNodeKeys = useMemo(() => {
    if (data && data.length > 0) {
      return getAllNodeKeys(data);
    }
    return [];
  }, [data, getAllNodeKeys]);

  // 초기 상태 설정
  useEffect(() => {
    if (allNodeKeys.length > 0 && !isInitialized) {
      setOpenedNodes(new Set(allNodeKeys));
      setIsInitialized(true);
    }
  }, [allNodeKeys, isInitialized]);

  // 성능 최적화: 개발용 로그 제거

  // 버튼 클릭 핸들러 (성능 최적화: useCallback 적용)
  const handleNodeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, item: any, nodeKey: string) => {
      e.preventDefault();

      // 노드의 열림/닫힘 상태 토글 - 최적화된 방식
      setOpenedNodes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(nodeKey)) {
          newSet.delete(nodeKey);
        } else {
          newSet.add(nodeKey);
        }
        return newSet;
      });

      // onNodeSelect 콜백 호출
      if (onNodeSelect) {
        onNodeSelect(item);
      }
    },
    [onNodeSelect],
  );
  // 3뎁스 전용 클릭 핸들러 (성능 최적화: useCallback 적용)
  const handle3DepthClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, item: any, nodeKey: string) => {
      e.preventDefault();

      // 노드의 열림/닫힘 상태 토글 (하위 메뉴가 있는 경우)
      if (item.children && item.children.length > 0) {
        setOpenedNodes((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(nodeKey)) {
            newSet.delete(nodeKey);
          } else {
            newSet.add(nodeKey);
          }
          return newSet;
        });
      }

      // onNodeSelect 콜백 호출
      if (onNodeSelect) {
        onNodeSelect(item);
      }

      // onNode3DepthClick 콜백 호출
      if (onNode3DepthClick) {
        onNode3DepthClick(item);
      }
      console.log('3depth 클릭', item.text);
    },
    [onNodeSelect, onNode3DepthClick],
  );
  // 4뎁스 전용 클릭 핸들러 (성능 최적화: useCallback 적용)
  const handle4DepthClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
      e.preventDefault();

      // onNodeClick 콜백 호출
      if (onNode4DepthClick) {
        onNode4DepthClick(item);
      }
      console.log('4depth 클릭', item.text);
    },
    [onNode4DepthClick],
  );

  return (
    <>
      {/** 트리 컴포넌트 */}
      <div className={className} style={style}>
        <ul className={styles.treeStyle}>
          {isInitialized &&
            data.map((depthOne, depthOneIndex) => {
              const depthOneKey = getNodeKey(depthOne, depthOneIndex);
              const isDepthOneOpened = openedNodes.has(depthOneKey);
              // 성능 최적화: 렌더링 로그 제거
              return (
                <li
                  key={depthOneIndex}
                  className={`${isDepthOneOpened ? 'opened' : 'closed'} ${depthOne.children && depthOne.children.length > 0 ? styles.arrow : ''}`}
                >
                  <button
                    type="button"
                    className={getButtonClassName(depthOne)}
                    onClick={(e) => handleNodeClick(e, depthOne, depthOneKey)}
                  >
                    {depthOne.text}
                  </button>
                  {/** ------------------- 2depth 메뉴 ------------------- */}
                  {depthOne.children && depthOne.children.length > 0 && isDepthOneOpened && (
                    <ul className={styles.subDepth}>
                      {depthOne.children.map((depthTwo: any, depthTwoIndex: number) => {
                        /** 2depth 메뉴 노드 키 */
                        const depthTwoKey = getNodeKey(depthTwo, depthTwoIndex, depthOneKey);
                        /** 2depth 메뉴 노드 열림/닫힘 상태 */
                        const isDepthTwoOpened = openedNodes.has(depthTwoKey);
                        return (
                          <li
                            key={depthTwoIndex}
                            className={`${isDepthTwoOpened ? 'opened' : 'closed'} ${depthTwo.children && depthTwo.children.length > 0 ? styles.arrow : ''}`}
                          >
                            <button
                              type="button"
                              className={getButtonClassName(depthTwo)}
                              onClick={(e) => {
                                if (depthTwo.children && depthTwo.children.length > 0) {
                                  // 하위 메뉴가 있으면 토글
                                  handleNodeClick(e, depthTwo, depthTwoKey);
                                } else {
                                  // 하위 메뉴가 없으면 2depth 클릭 이벤트
                                  handle3DepthClick(e, depthTwo, depthTwoKey);
                                }
                              }}
                            >
                              {depthTwo.text}
                            </button>
                            {/** ------------------- 3depth 메뉴 ------------------- */}
                            {depthTwo.children &&
                              depthTwo.children.length > 0 &&
                              isDepthTwoOpened && (
                                <ul className={styles.subDepth}>
                                  {depthTwo.children.map(
                                    (depthThree: any, depthThreeIndex: number) => {
                                      const depthThreeKey = getNodeKey(
                                        depthThree,
                                        depthThreeIndex,
                                        depthTwoKey,
                                      );
                                      const isDepthThreeOpened = openedNodes.has(depthThreeKey);

                                      return (
                                        <li
                                          key={depthThreeIndex}
                                          className={`${isDepthThreeOpened ? 'opened' : 'closed'} ${depthThree.children && depthThree.children.length > 0 ? styles.arrow : ''}`}
                                        >
                                          <button
                                            type="button"
                                            className={getButtonClassName(depthThree)}
                                            onClick={(e) =>
                                              handle3DepthClick(e, depthThree, depthThreeKey)
                                            }
                                          >
                                            {depthThree.text}
                                          </button>
                                          {/** ------------------- 4depth 메뉴 ------------------- */}
                                          {depthThree.children &&
                                            depthThree.children.length > 0 &&
                                            isDepthThreeOpened && (
                                              <ul className={styles.subDepth}>
                                                {depthThree.children.map(
                                                  (depthFour: any, depthFourIndex: number) => {
                                                    const depthFourKey = getNodeKey(
                                                      depthFour,
                                                      depthFourIndex,
                                                      depthThreeKey,
                                                    );
                                                    const isDepthFourOpened =
                                                      openedNodes.has(depthFourKey);
                                                    return (
                                                      <li
                                                        key={depthFourIndex}
                                                        className={`${isDepthFourOpened ? 'opened' : 'closed'}`}
                                                      >
                                                        <button
                                                          type="button"
                                                          className={`docBtn`}
                                                          onClick={(e) =>
                                                            handle4DepthClick(e, depthFour)
                                                          }
                                                        >
                                                          {depthFour.text}
                                                        </button>
                                                      </li>
                                                    );
                                                  },
                                                )}
                                              </ul>
                                            )}
                                          {/** ------------------- 4depth 메뉴 ------------------- */}
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              )}
                            {/** ------------------- 3depth 메뉴 ------------------- */}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {/** ------------------- 2depth 메뉴 ------------------- */}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
