import React, { useState } from 'react';
import MzTree from '../../common/components/ui/mzTree';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const treeSampleCode = `import MzTree from '../../components/common/ui/mzTree';

const treeData = [
  {
    text: '상업용 보안',
    children: [
      { text: 'AI CCTV' },
      { text: '출동경비' },
      { text: '출입보안' }
    ]
  },
  {
    text: '스마트매장',
    children: [
      { text: '무인매장솔루션' },
      { text: '매장관리솔루션' },
      { text: '방역·방제 서비스' },
      { text: '도난·화재 보상서비스' }
    ]
  }
];

<MzTree
  data={treeData}
  onNodeSelect={node => console.log('선택:', node)}
/>`;

const treeData = [
  {
    text: 'SK쉴더스',
    children: [
      {
        text: '상업용 보안',
        children: [{ text: 'AI CCTV' }, { text: '출동경비' }, { text: '출입보안' }],
      },
      {
        text: '스마트매장',
        children: [
          { text: '무인매장솔루션' },
          { text: '매장관리솔루션' },
          { text: '방역·방제 서비스' },
          { text: '도난·화재 보상서비스' },
        ],
      },
    ],
  },
];

export default function SampleMzTree() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="sample">
      <h2>Sample MzTree Page</h2>
      <div className="sampleInfo">
        <h3>MzTree props 설명</h3>
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
              <td>data</td>
              <td>any[]</td>
              <td>트리 데이터</td>
            </tr>
            <tr>
              <td>onNodeSelect</td>
              <td>(node: any) =&gt; void</td>
              <td>노드 선택 이벤트</td>
            </tr>
            <tr>
              <td>style</td>
              <td>React.CSSProperties</td>
              <td>스타일</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>트리 샘플</h3>
        <MzTree
          data={treeData}
          style={{ width: 300, minHeight: 400 }}
          onNodeSelect={(node) => setSelected(node.text)}
        />
        <div style={{ marginTop: 16 }}>선택된 노드: {selected}</div>
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {treeSampleCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
