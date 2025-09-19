import React, { useState, ChangeEvent } from 'react';
import { MzCheckBox } from '../../common/components/form/mzCheckBox';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const checkBoxSampleCode = `import { MzCheckBox } from '../../components/common/form/mzCheckBox';

// 체크박스
<MzCheckBox type="checkbox" id="chk1" checked={checked} onChange={onChange}>체크박스</MzCheckBox>

// 라디오
<MzCheckBox type="radio" id="radio1" checked={selected === 'A'} value="A" onChange={onChange}>A</MzCheckBox>
<MzCheckBox type="radio" id="radio2" checked={selected === 'B'} value="B" onChange={onChange}>B</MzCheckBox>
`;

export default function SampleCheckBox() {
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState('A');
  const [copied, setCopied] = useState(false);
  return (
    <div className="sample">
      <h2>Sample MzCheckBox Page</h2>
      <div className="sampleInfo">
        <h3>MzCheckBox props 설명</h3>
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
              <td>"checkbox" | "radio"</td>
              <td>input 타입</td>
            </tr>
            <tr>
              <td>id</td>
              <td>string</td>
              <td>input id, label과 연결</td>
            </tr>
            <tr>
              <td>checked</td>
              <td>boolean</td>
              <td>체크 여부</td>
            </tr>
            <tr>
              <td>value</td>
              <td>string | number | string[]</td>
              <td>값</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>(e: ChangeEvent) =&gt; void</td>
              <td>체크/선택 변경 이벤트</td>
            </tr>
            <tr>
              <td>stroke</td>
              <td>string</td>
              <td>테두리 스타일</td>
            </tr>
            <tr>
              <td>fill</td>
              <td>string</td>
              <td>배경색</td>
            </tr>
            <tr>
              <td>shape</td>
              <td>string</td>
              <td>모양(둥글게 등)</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스</td>
            </tr>
            <tr>
              <td>children</td>
              <td>ReactNode</td>
              <td>라벨 텍스트/컴포넌트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <table>
          <thead>
            <tr className="center">
              <th style={{ width: '200px' }}>셀렉트 Type</th>
              <th>샘플</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>체크박스</th>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <MzCheckBox type="checkbox" id="allCheck" shape="round">
                  체크박스
                </MzCheckBox>
              </td>
            </tr>
            <tr>
              <th>라디오버튼</th>
              <td>
                <MzCheckBox
                  type="radio"
                  id="radio1"
                  checked={selected === 'A'}
                  value="A"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSelected(e.target.value)}
                >
                  A
                </MzCheckBox>
                <MzCheckBox
                  type="radio"
                  id="radio2"
                  checked={selected === 'B'}
                  value="B"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSelected(e.target.value)}
                >
                  B
                </MzCheckBox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {checkBoxSampleCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopy(checkBoxSampleCode, setCopied)}
          type="button"
          className="copyButton"
        >
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
