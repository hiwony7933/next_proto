import React, { useRef } from "react";
import type { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

type CollapseTransitionOptions = {
  timeout?: number;
  classNames: CSSTransitionClassNames;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
};

type TransitionProps = {
  in: boolean;
  timeout: number;
  mountOnEnter: boolean;
  unmountOnExit: boolean;
  nodeRef: React.RefObject<any>;
  classNames: CSSTransitionClassNames;
  onEnter: () => void;
  onEntering: () => void;
  onEntered: () => void;
  onExit: () => void;
  onExiting: () => void;
};

type CollapseTransitionMap = {
  getNodeRef: (key: number | string) => React.RefObject<any>;
  getTransitionProps: (
    key: number | string,
    isOpen: boolean
  ) => TransitionProps;
};

export function useCollapseTransitionMap(
  options: CollapseTransitionOptions
): CollapseTransitionMap {
  const {
    timeout = 300,
    classNames,
    mountOnEnter = false,
    unmountOnExit = false,
  } = options;

  const refMap = useRef<Map<number | string, React.RefObject<any>>>(new Map());

  const getNodeRef = (key: number | string): React.RefObject<any> => {
    let existing = refMap.current.get(key);
    if (!existing) {
      const created: React.RefObject<any> = React.createRef<any>();
      refMap.current.set(key, created);
      existing = created;
    }
    return existing;
  };

  const getTransitionProps = (
    key: number | string,
    isOpen: boolean
  ): TransitionProps => {
    const nodeRef = getNodeRef(key);

    return {
      in: isOpen,
      timeout: Number(timeout),
      mountOnEnter,
      unmountOnExit,
      nodeRef,
      classNames,
      onEnter: () => {
        const node = nodeRef.current;
        if (!node) return;
        const target = (node as unknown as HTMLDivElement).scrollHeight;
        (node as HTMLElement).style.height = "0px"; // 초기값
        (node as HTMLElement).style.setProperty(
          "--target-height",
          `${target}px`
        );
      },
      onEntering: () => {
        const node = nodeRef.current;
        if (!node) return;
        (node as HTMLElement).style.height =
          `${(node as unknown as HTMLDivElement).scrollHeight}px`;
      },
      onEntered: () => {
        const node = nodeRef.current;
        if (!node) return;
        (node as HTMLElement).style.height = "auto";
      },
      onExit: () => {
        const node = nodeRef.current;
        if (!node) return;
        const target = (node as unknown as HTMLDivElement).scrollHeight;
        (node as HTMLElement).style.setProperty(
          "--target-height",
          `${target}px`
        );
        (node as HTMLElement).style.height = `${target}px`;
      },
      onExiting: () => {
        const node = nodeRef.current;
        if (!node) return;
        (node as HTMLElement).style.height = "0px";
      },
    };
  };

  return { getNodeRef, getTransitionProps };
}
