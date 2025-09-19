import React, { useState } from 'react';

import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzDatePicker from '../../common/components/form/mzDatePicker';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const sampleCodePicker = `import MzDatePicker from '../../components/common/form/mzDatePicker';

const [date, setDate] = useState('');
<MzDatePicker value={date} onChange={setDate} showQuickButtons={true} />
`;

export default function SampleDatePicker() {
  // With quick buttons
  const [dateWithBtn, setDateWithBtn] = useState('');
  // Without quick buttons
  const [dateNoBtn, setDateNoBtn] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <div className="sample">
      <h2>Sample mzDatePicker (MzDatePicker) Page</h2>
      <div className="sampleInfo">
        <h3>MzDatePicker props 설명</h3>
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
              <td>value</td>
              <td>string</td>
              <td>선택된 날짜 (YYYY.MM.DD)</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>(date: string) =&gt; void</td>
              <td>날짜 변경 시 호출되는 콜백</td>
            </tr>
            <tr>
              <td>showQuickButtons</td>
              <td>boolean</td>
              <td>오늘/어제 버튼 노출 여부 (옵션)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* With quick buttons */}
      <div className="sampleInfo">
        <h3>
          오늘/어제 버튼 <b>포함</b> 케이스
        </h3>
        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>선택값</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzDatePicker
                  value={dateWithBtn}
                  onChange={setDateWithBtn}
                  showQuickButtons={true}
                />
              </td>
              <td>{dateWithBtn || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Without quick buttons */}

      <div className="sampleInfo">
        <h3>
          오늘/어제 버튼 <b>미포함</b> 케이스
        </h3>
        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>선택값</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzDatePicker value={dateWithBtn} onChange={setDateWithBtn} />
              </td>
              <td>{dateWithBtn || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCodePicker}
        </SyntaxHighlighter>
        <button
          onClick={() => {
            navigator.clipboard.writeText(sampleCodePicker);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          type="button"
          className="copyButton"
        >
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
