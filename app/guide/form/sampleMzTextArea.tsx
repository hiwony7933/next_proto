import React, { useState } from 'react';
import MzTextArea from '../../common/components/form/mzTextArea';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const sampleCode = `import MzTextArea from '@/components/form/mzTextArea';

<MzTextArea
  type="normal"
  value={value}
  onChange={onChange}
  count="YES"
  maxBite={200}
  minBite={10}
  placeholder="내용을 입력하세요"
/>

<MzTextArea
  type="editor"
  value={value}
  onChange={onChange}
  count="YES"
  maxBite={500}
  minBite={20}
/>
`;

export default function SampleMzTextArea() {
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample MzTextArea Page</h2>
      <div className="sampleInfo">
        <h3>MzTextArea props 설명</h3>
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
              <td>type</td>
              <td>'normal' | 'editor'</td>
              <td>normal: textarea, editor: Toast UI Editor</td>
            </tr>
            <tr>
              <td>value</td>
              <td>string</td>
              <td>입력값</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>(e: ChangeEvent&lt;HTMLTextAreaElement&gt; | string) =&gt; void</td>
              <td>값 변경 핸들러</td>
            </tr>
            <tr>
              <td>count</td>
              <td>'YES' | 'NO'</td>
              <td>바이트 카운트 표시 여부</td>
            </tr>
            <tr>
              <td>maxBite</td>
              <td>number</td>
              <td>최대 바이트</td>
            </tr>
            <tr>
              <td>minBite</td>
              <td>number</td>
              <td>최소 바이트</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>string</td>
              <td>placeholder</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스명</td>
            </tr>
            <tr>
              <td>style</td>
              <td>React.CSSProperties</td>
              <td>추가 스타일 (height 등)</td>
            </tr>
            <tr>
              <td>id</td>
              <td>string</td>
              <td>textarea id</td>
            </tr>
            <tr>
              <td>height</td>
              <td>string</td>
              <td>textarea/editor 높이 (ex: '50px', '300px')</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h4>Normal 타입 (textarea)</h4>
        <MzTextArea
          type="normal"
          value={value}
          onChange={(e) => setValue(typeof e === 'string' ? e : e.target.value)}
          count="YES"
          maxBite={200}
          minBite={10}
          placeholder="내용을 입력하세요"
          height="50px"
          id="sample-normal"
        />
        <h4>Editor 타입 (Toast UI Editor)</h4>
        <MzTextArea
          type="editor"
          value={editorValue}
          onChange={(e) => setEditorValue(typeof e === 'string' ? e : e.target.value)}
          count="YES"
          maxBite={500}
          minBite={20}
        />
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
