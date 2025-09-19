import React, { useState } from 'react';
import CornerCategory002 from '../../common/components/corner/cornerCategory002';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const items = [
  { title: '카테고리A', subTitle: '설명A', image: 'https://via.placeholder.com/48', link: '#' },
  {
    title: '카테고리B',
    subTitle: '설명B',
    image: 'https://via.placeholder.com/48/f0f/000',
    link: '#',
  },
];

const sampleCode = `import CornerCategory002 from '@/components/common/corner/cornerCategory002';

const items = [
  { title: '카테고리A', subTitle: '설명A', image: 'https://via.placeholder.com/48', link: '#' },
  { title: '카테고리B', subTitle: '설명B', image: 'https://via.placeholder.com/48/f0f/000', link: '#' },
];

<CornerCategory002 items={items} />
`;

export default function SampleCornerCategory002() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample CornerCategory002 Page</h2>
      <div className="sampleInfo">
        <h3>CornerCategory002 props 설명</h3>
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
        <CornerCategory002 items={items} />
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
