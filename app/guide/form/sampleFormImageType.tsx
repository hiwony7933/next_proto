import React, { useState } from 'react';
import MzImageType from '../../common/components/form/mzImageType';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const sampleCode = `import MzImageType from '@/components/form/mzImageType';

<MzImageType onChange={val => console.log(val)} />
`;

export default function SampleFormImageType() {
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState('');
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample MzImageType Page</h2>
      <div className="sampleInfo">
        <h3>MzImageType props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>props</th>
              <th>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>onChange</td>
              <td>(value: string) =&gt; void</td>
              <td>입력값(주소 또는 파일명) 변경 시 콜백</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>
          샘플{' '}
          <em>
            https://nimg.lfmall.co.kr/speed/src/https://img.lfmall.co.kr/v2/real/origin/card/2025/6/1748846622292.jpg/dims/format/avif;fallback=webp/optimize
          </em>
        </h3>
        <MzImageType onChange={setValue} />
        <div style={{ marginTop: 8 }}>
          현재 값: <b>{value}</b>
        </div>
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCode}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
