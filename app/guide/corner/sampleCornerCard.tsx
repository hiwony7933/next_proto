import React, { useState } from 'react';
import MzSelectBox from '../../common/components/form/mzSelectBox';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import CardNo01 from '../../common/components/corner/cardNo01';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

export default function SampleCornerCard() {
  const options = ['전체', '이미지', '텍스트', 'HTML', '상품', '파일'];
  const [selected, setSelected] = useState(options[0]);
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div>
        <div className="title">무인매장솔루션</div>
        <CardNo01 />
      </div>

      <div style={{ height: '10000px' }}>dddd</div>
    </div>
  );
}
