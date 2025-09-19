import React, { useState } from 'react';
import MzInputText from '../../common/components/form/mzInputText';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const sampleCode = `import MzInputText from '../../components/common/form/mzInputText';

// 일반 텍스트 인풋
<MzInputText mzSize="3" placeholder="일반 텍스트" />

// 숫자 천단위 콤마 인풋
<MzInputText mzSize="3" numberFormat placeholder="숫자만 입력" />
`;

export default function SampleInputBox() {
  const [text, setText] = useState('');
  const [number, setNumber] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <div className="sample">
      <h2>Sample mzInputText (MzInputText) Page</h2>
      <div className="sampleInfo">
        <h3>MzInputText props 설명</h3>
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
              <td>mzSize</td>
              <td>string</td>
              <td>인풋 크기 (1~5)</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스</td>
            </tr>
            <tr>
              <td>numberFormat</td>
              <td>boolean</td>
              <td>숫자만 입력, 천단위 콤마 자동 (옵션)</td>
            </tr>
            <tr>
              <td>...rest</td>
              <td>InputHTMLAttributes</td>
              <td>기본 input 속성 모두 지원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>일반 텍스트 인풋</h3>

        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>입력값</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  placeholder="일반 텍스트"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </td>
              <td>{text || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>숫자 천단위 콤마 인풋</h3>

        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>입력값(콤마제거)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  numberFormat
                  placeholder="숫자만 입력"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </td>
              <td>{number || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopy(sampleCode, setCopied)}
          type="button"
          className="copyButton"
        >
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
