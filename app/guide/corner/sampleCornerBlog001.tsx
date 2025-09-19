import React, { useState } from 'react';
import CornerBlog001 from '../../common/components/corner/cornerBlog001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const items = [
  { image: 'https://via.placeholder.com/220x120', title: '블로그1', description: '설명1' },
  { image: 'https://via.placeholder.com/220x120/0ff/000', title: '블로그2', description: '설명2' },
];

const sampleCode = `import CornerBlog001 from '@/components/common/corner/cornerBlog001';

const items = [
  { image: 'https://via.placeholder.com/220x120', title: '블로그1', description: '설명1' },
  { image: 'https://via.placeholder.com/220x120/0ff/000', title: '블로그2', description: '설명2' },
];

<CornerBlog001 items={items} />
`;

export default function SampleCornerBlog001() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample CornerBlog001 Page</h2>
      <div className="sampleInfo">
        <h3>CornerBlog001 props 설명</h3>
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
              <td>{`{ image: string; title: string; description: string; }[]`}</td>
              <td>블로그 항목 배열</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <CornerBlog001 items={items} />
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
