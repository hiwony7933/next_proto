import React, { useState } from 'react';
import MzSelectBox from '../../common/components/form/mzSelectBox';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const selectBoxSampleCode = `import MzSelectBox from '../../components/common/form/mzSelectBox';//import 공통 셀렉트박스 컴포넌트

const options = ['전체', '이미지', '텍스트', 'HTML', '상품', '파일'];
const [selected, setSelected] = useState(options[0]);

// 기본 셀렉트박스
<MzSelectBox type="default" size="5" options={options} selected={selected} onSelect={v => setSelected(typeof v === 'string' ? v : v[0])} />

// 검색 셀렉트박스
<MzSelectBox
  className="search"
  options={options}
  selected={selected}
  onSelect={v => setSelected(typeof v === 'string' ? v : v[0])}
  type="search"
/>

// 드롭다운 셀렉트박스
<MzSelectBox
  className="dropdown"
  options={options}
  selected={selected}
  onSelect={v => setSelected(typeof v === 'string' ? v : v[0])}
  type="dropdown"
  size="5"
/>`;

export default function SampleMzSelectBox() {
  const options = ['전체', '이미지', '텍스트', 'HTML', '상품', '파일'];
  const [selected, setSelected] = useState(options[0]);
  const [copied, setCopied] = useState(false);
  return (
    <div className="sample">
      <h2>Sample MzSelectBox Page</h2>
      <div className="sampleInfo">
        <h3>MzSelectBox props 설명</h3>
        <table>
          <thead>
            <tr>
              <th style={{ width: '200px' }}>props</th>
              <th style={{ width: '300px' }}>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>options</td>
              <td>string[]</td>
              <td>드롭다운에 표시할 옵션 목록</td>
            </tr>
            <tr>
              <td>selected</td>
              <td>string</td>
              <td>현재 선택된 값</td>
            </tr>
            <tr>
              <td>onSelect</td>
              <td>(value: string) =&gt; void</td>
              <td>옵션 선택 시 호출되는 콜백</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>(선택) 추가 커스텀 클래스</td>
            </tr>
            <tr>
              <td>type</td>
              <td>'default' | 'search' | 'dropdown'</td>
              <td>
                드롭다운 타입 (default: 셀렉트박스, search: 검색 셀렉트박스, dropdown: 드롭다운)
              </td>
            </tr>
            <tr>
              <td>size</td>
              <td>'1' | '2' | '3' | '4' | '5'</td>
              <td>셀렉트박스 높이/크기 (기본값: '3')</td>
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
              <th>
                default
                <br />
                <span style={{ fontWeight: 'normal' }}>(size 1~5)</span>
              </th>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <MzSelectBox
                  type="default"
                  size="1"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="default"
                  size="2"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="default"
                  size="3"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="default"
                  size="4"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="default"
                  size="5"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
              </td>
            </tr>
            <tr>
              <th>search</th>
              <td>
                <div className="search">
                  <MzSelectBox
                    type="search"
                    className="search"
                    options={options}
                    selected={selected}
                    onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                  />
                  <input type="text" placeholder="검색어를 입력해주세요." className="key" />
                  <MzButton fill="black">검색</MzButton>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                dropdown
                <br />
                <span style={{ fontWeight: 'normal' }}>(size 1~5)</span>
              </th>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <MzSelectBox
                  type="dropdown"
                  className="dropdown"
                  size="1"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="dropdown"
                  className="dropdown"
                  size="2"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="dropdown"
                  className="dropdown"
                  size="3"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="dropdown"
                  className="dropdown"
                  size="4"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
                <MzSelectBox
                  type="dropdown"
                  className="dropdown"
                  size="5"
                  options={options}
                  selected={selected}
                  onSelect={(v) => setSelected(typeof v === 'string' ? v : v[0])}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {selectBoxSampleCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopy(selectBoxSampleCode, setCopied)}
          type="button"
          className="copyButton"
        >
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
