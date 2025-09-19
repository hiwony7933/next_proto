import React, { useState } from 'react';
import CornerCategory001 from '../../common/components/corner/cornerCategory001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const items = [
  { title: '카테고리1', subTitle: '설명1', image: 'https://via.placeholder.com/48', link: '#' },
  {
    title: '카테고리2',
    subTitle: '설명2',
    image: 'https://via.placeholder.com/48/0ff/000',
    link: '#',
  },
];

const sampleCode = `import CornerCategory001 from '@/components/common/corner/cornerCategory001';

const items = [
  { title: '카테고리1', subTitle: '설명1', image: 'https://via.placeholder.com/48', link: '#' },
  { title: '카테고리2', subTitle: '설명2', image: 'https://via.placeholder.com/48/0ff/000', link: '#' },
];

<CornerCategory001 items={items} />
`;

export default function SampleCornerCategory001() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample CornerCategory001 Page</h2>
      <div className="sampleInfo">
        <h3>CornerCategory001 props 설명</h3>
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
              <td>items</td>
              <td>{`{ title: string; subTitle: string; image: string; link: string; }[]`}</td>
              <td>카테고리 항목 배열</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <CornerCategory001 items={items} />
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
