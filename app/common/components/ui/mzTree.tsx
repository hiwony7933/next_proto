'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'tui-tree/dist/tui-tree.css';

const DynamicTuiTree = dynamic(() => import('tui-tree'), { ssr: false });

export interface MzTreeProps {
  data: any[];
  className?: string;
  style?: React.CSSProperties;
  onNodeSelect?: (node: any) => void;
  // 필요시 옵션 추가 (예: draggable, checkable 등)
}

export default function MzTree({ data, className, style, onNodeSelect }: MzTreeProps) {
  const treeRef = useRef<HTMLDivElement>(null);
  const treeInstance = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!treeRef.current) return;
      const Tree = (await import('tui-tree')).default as any;
      if (cancelled) return;
      treeRef.current.innerHTML = '';
      treeInstance.current = new Tree(treeRef.current, {
        data,
        nodeDefaultState: 'opened',
        rootElement: false,
      });
      if (onNodeSelect) {
        treeInstance.current.on('select', (ev: any) => {
          onNodeSelect(ev.node);
        });
      }
    }
    init();
    return () => {
      cancelled = true;
      // 추가 정리 필요 시 여기서 처리
    };
  }, [data, onNodeSelect]);

  return <div ref={treeRef} className={className} style={style} />;
}
